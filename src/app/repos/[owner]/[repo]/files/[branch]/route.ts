import { type NextRequest, NextResponse } from "next/server";
import type { GithubFile } from "~/types";
import { ghRepoFiles } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{
		params,
	}: { params: Promise<{ owner: string; repo: string; branch: string }> },
) {
	const { owner, repo, branch } = await params;
	const repoName = `${owner}/${repo}`;
	const res = await ghRepoFiles(repoName, branch);

	const files = res.tree
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		.filter((i: any) => i.type === "blob")
		.map(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(i: any) =>
				({
					path: i.path,
					mode: i.mode,
					sha: i.sha,
					size: i.size,
				}) as GithubFile,
		);

	return NextResponse.json({
		meta: {
			sha: res.sha,
		},
		files,
	});
}
