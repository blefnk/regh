import { type NextRequest, NextResponse } from "next/server";
import pMap, { pMapSkip } from "p-map";
import { CONCURRENCY_LIMIT, DEFAULT_PER_PAGE, MAX_PER_PAGE } from "~/app";
import type { GithubRepo } from "~/types";
import { ghApi, ghRepo } from "~/utils/github";

/**
 * Get organization repositories.
 *
 * @see http://localhost:3000/orgs/reliverse/repos
 * @see http://localhost:3000/orgs/reliverse/repos?page=2
 * @see http://localhost:3000/orgs/reliverse/repos?details=1
 * @see http://localhost:3000/orgs/reliverse/repos?per_page=10
 * @see http://localhost:3000/orgs/reliverse/repos?per_page=5&details=1
 * @see http://localhost:3000/orgs/reliverse/repos?per_page=5&fields=id,full_name,description
 * @see http://localhost:3000/orgs/reliverse/repos?details=1&page=2&details=1&per_page=10&fields=id,full_name,subscribers_count
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string }> },
) {
	const { owner } = await params;
	const url = new URL(request.url);
	const details = url.searchParams.get("details");
	let per_page = Number.parseInt(
		url.searchParams.get("per_page") || String(DEFAULT_PER_PAGE),
		10,
	);
	if (Number.isNaN(per_page) || per_page < 1) per_page = DEFAULT_PER_PAGE;
	if (per_page > MAX_PER_PAGE) per_page = MAX_PER_PAGE;
	const fields = url.searchParams.get("fields"); // comma-separated list
	const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
	const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

	const rawRepos = await ghApi<GithubRepo[]>(
		`/orgs/${owner}/repos?per_page=${per_page}&page=${safePage}`,
	);

	let fetchedRepos: GithubRepo[];
	if (details && details !== "0" && details.toLowerCase() !== "false") {
		fetchedRepos = await pMap(
			rawRepos,
			async (rawRepo: GithubRepo): Promise<GithubRepo | typeof pMapSkip> => {
				try {
					// Fetch detailed repo info for subscribers_count (watchers)
					const repoDetails = await ghRepo(`${owner}/${rawRepo.name}`);
					return {
						id: rawRepo.id,
						name: rawRepo.name,
						full_name: rawRepo.full_name,
						description: rawRepo.description,
						created_at: rawRepo.created_at,
						updated_at: rawRepo.updated_at,
						pushed_at: rawRepo.pushed_at,
						stargazers_count: rawRepo.stargazers_count,
						subscribers_count: repoDetails.subscribers_count ?? null,
						forks: rawRepo.forks,
						default_branch: rawRepo.default_branch,
						git_url: rawRepo.git_url,
						html_url: rawRepo.html_url,
						language: rawRepo.language,
						private: rawRepo.private,
						open_issues_count: rawRepo.open_issues_count,
					};
				} catch (error) {
					console.error(
						`Error fetching details for org repo ${owner}/${rawRepo.name}:`,
						error,
					);
					return pMapSkip; // Skip this repo if fetching details fails
				}
			},
			{ concurrency: CONCURRENCY_LIMIT },
		);
	} else {
		fetchedRepos = rawRepos.map(
			(rawRepo: GithubRepo): GithubRepo => ({
				id: rawRepo.id,
				name: rawRepo.name,
				full_name: rawRepo.full_name,
				description: rawRepo.description,
				created_at: rawRepo.created_at,
				updated_at: rawRepo.updated_at,
				pushed_at: rawRepo.pushed_at,
				stargazers_count: rawRepo.stargazers_count,
				subscribers_count: null,
				forks: rawRepo.forks,
				default_branch: rawRepo.default_branch,
				git_url: rawRepo.git_url,
				html_url: rawRepo.html_url,
				language: rawRepo.language,
				private: rawRepo.private,
				open_issues_count: rawRepo.open_issues_count,
			}),
		);
	}

	// Filter by fields if provided, applying to the successfully fetched repos
	let finalRepos = fetchedRepos as GithubRepo[]; // Type assertion after pMapSkip
	if (fields) {
		const fieldList = fields
			.split(",")
			.map((f) => f.trim())
			.filter(Boolean);
		finalRepos = finalRepos.map((repo) => {
			const filtered: Partial<GithubRepo> = {};
			for (const field of fieldList) {
				if (field in repo) {
					// @ts-expect-error: dynamic key
					filtered[field] = repo[field as keyof GithubRepo];
				}
			}
			return filtered as GithubRepo;
		});
	}

	// Fetch total repo count for the org
	const orgInfo = await ghApi<{ public_repos: number }>(`/orgs/${owner}`);
	const public_repos = orgInfo.public_repos;

	return NextResponse.json({
		page: safePage,
		per_page,
		public_repos,
		repos: finalRepos,
	});
}
