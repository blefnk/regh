import { type NextRequest, NextResponse } from "next/server";
import type { GithubContributor } from "~/types";
import { ghRepoContributors } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string; repo: string }> },
) {
	const { owner, repo } = await params;
	const res = await ghRepoContributors(`${owner}/${repo}`);

	const contributors = res.map(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(i: any) =>
			({
				id: i.id,
				login: i.login,
				contributions: i.contributions || 0,
			}) as GithubContributor,
	);

	return NextResponse.json({ contributors });
}
