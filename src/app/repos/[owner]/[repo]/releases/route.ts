import { type NextRequest, NextResponse } from "next/server";
import type { GithubRelease } from "~/types";
import { ghFetch, ghMarkdown } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string; repo: string }> },
) {
	const { owner, repo } = await params;
	const repoName = `${owner}/${repo}`;
	const res = await ghFetch<GithubRelease[]>(`/repos/${repoName}/releases`);

	const releases = await Promise.all(
		res.map(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			async (i: any) => {
				const release: GithubRelease = {
					id: i.id,
					tag: i.tag_name,
					author: i.author.login,
					name: i.name,
					draft: i.draft,
					prerelease: i.prerelease,
					created_at: i.created_at,
					published_at: i.published_at,
					markdown: i.body,
					// html: await ghMarkdown(i.body, repoName, `release-${i.tag_name}`),
					html: await ghMarkdown(i.body, repoName),
					assets:
						"assets" in i
							? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
								i.assets.map((a: any) => ({
									content_type: a.content_type,
									size: a.size,
									created_at: a.created_at,
									updated_at: a.updated_at,
									download_count: a.download_count,
									download_url: a.browser_download_url,
								}))
							: [],
				};
				return release;
			},
		),
	);

	return NextResponse.json({ releases });
}
