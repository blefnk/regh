import { type NextRequest, NextResponse } from "next/server";
import type { GitHubBranches } from "~/types";
import { ghFetch } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string; repo: string }> },
) {
	const { owner, repo } = await params;
	const res = await ghFetch<GitHubBranches[]>(
		`/repos/${owner}/${repo}/branches`,
	);

	const branches = res.map(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(i: any) =>
			({
				name: i.name,
				commit: i.commit,
				protected: i.protected,
			}) as GitHubBranches,
	);

	return NextResponse.json({ branches });
}
