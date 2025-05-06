import { type NextRequest, NextResponse } from "next/server";
import pMap, { pMapSkip } from "p-map";
import { CONCURRENCY_LIMIT, DEBUG_ENABLED } from "~/app";
import { ghApi, ghRepo } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ repos: string[] }> },
) {
	const { repos } = await params;
	const repoString = repos.join("/");

	const repoSources = await pMap(
		repoString.split(/[ +,]/).filter(Boolean),
		async (p) => {
			p = p.trim();
			if (p.endsWith("/*")) {
				const owner = p.split("/")[0];
				let reposEndpoint = "";

				try {
					const ownerDetails = await ghApi<{ type: string }>(`/users/${owner}`);
					if (ownerDetails.type === "Organization") {
						reposEndpoint = `/orgs/${owner}/repos`;
					} else if (ownerDetails.type === "User") {
						reposEndpoint = `/users/${owner}/repos`;
					} else {
						console.warn(
							`Unknown owner type for ${owner}: ${ownerDetails.type}. Skipping. P: ${p}`,
						);
						return [];
					}

					const ownerRepos = await ghApi<{ name: string }[]>(
						reposEndpoint,
					).then((r) => r.map((repo) => `${owner}/${repo.name}`));
					return ownerRepos;
				} catch (error: unknown) {
					if (
						error instanceof Error &&
						error.message.includes("GitHub API error: Not Found")
					) {
						// Owner not found, this is an expected case for invalid owner
						// names, so we don't log an error if DEBUG_ENABLED is false.
						if (DEBUG_ENABLED) {
							console.log(
								`🟡 Owner ${owner} (from pattern ${p}) not found, skipping.`,
							);
						}
					} else {
						console.error(`Error processing owner/* for ${p}:`, error);
					}
					return [];
				}
			}
			return p;
		},
		{ concurrency: CONCURRENCY_LIMIT },
	).then((r) => r.flat().filter(Boolean));

	const starsArr = await pMap(
		repoSources,
		async (source: string): Promise<[string, number] | typeof pMapSkip> => {
			try {
				const repoDetails = await ghRepo(source);
				return [source, repoDetails.stargazers_count];
			} catch (error) {
				console.error(`Error fetching stars for ${source}:`, error);
				return pMapSkip;
			}
		},
		{ concurrency: CONCURRENCY_LIMIT },
	);

	const validStarsArr = starsArr as [string, number][];

	const stars = Object.fromEntries(validStarsArr);
	const totalStars = validStarsArr.reduce((c, r) => c + r[1], 0);

	return NextResponse.json({
		totalStars,
		stars,
	});
}
