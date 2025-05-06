import { type NextRequest, NextResponse } from "next/server";
import type { GithubOrg } from "~/types";
import { ghApi } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string }> },
) {
	const { owner } = await params;
	const org = await ghApi<GithubOrg>(`/orgs/${owner}`);

	const orgData: GithubOrg = {
		id: org.id,
		name: org.name,
		description: org.description,
		public_repos: org.public_repos,
	};

	return NextResponse.json({
		org: orgData,
	});
}
