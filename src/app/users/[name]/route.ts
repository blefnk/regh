import { type NextRequest, NextResponse } from "next/server";
import type { GithubUser } from "~/types";
import { ghApi } from "~/utils/github";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ name: string }> },
) {
	const { name } = await params;
	const user = await ghApi<GithubUser>(`/users/${name}`);

	const userData: GithubUser = {
		id: user.id,
		login: user.login,
		name: user.name,
		twitter_username: user.twitter_username,
		avatar_url: user.avatar_url,
		public_repos: user.public_repos,
	};

	return NextResponse.json({
		user: userData,
	});
}
