import { type NextRequest, NextResponse } from "next/server";
import type { GitHubReleaseResponse, GithubRelease } from "~/types";
import { ghFetch, ghMarkdown } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string; repo: string }> },
) {
	try {
		const { owner, repo } = await params;
		const repoName = `${owner}/${repo}`;

		try {
			const i = await ghFetch<GitHubReleaseResponse>(
				`/repos/${repoName}/releases/latest`,
			);

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
				html: await ghMarkdown(i.body, repoName),
				assets: i.assets.map((a) => ({
					content_type: a.content_type,
					size: a.size,
					created_at: a.created_at,
					updated_at: a.updated_at,
					download_count: a.download_count,
					download_url: a.download_url,
				})),
			};

			return NextResponse.json({ release });
		} catch (error) {
			if (error instanceof Error && "status" in error && error.status === 404) {
				return NextResponse.json(
					{
						error: "Release not found",
						message: `No releases found for repository ${repoName}`,
					},
					{ status: 404 },
				);
			}
			throw error;
		}
	} catch (error) {
		console.error("Error fetching release:", error);
		const message =
			error instanceof Error ? error.message : "An unexpected error occurred";
		return NextResponse.json(
			{
				error: "Internal server error",
				message,
			},
			{ status: 500 },
		);
	}
}
