import { type NextRequest, NextResponse } from "next/server";
import type { GithubSearchResponse, GithubUser } from "~/types";
import { ghFetch } from "~/utils/github";

const anonEmailRegex = /^(?:\d+\+)?(.+)@users.noreply.github.com$/;

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ query: string }> },
) {
	const { query } = await params;

	// Support multiple queries separated by '+' or ','
	const queries = query
		.split(/[+,]/)
		.map((q) => q.trim())
		.filter(Boolean);

	const users = [];
	for (const q of queries) {
		let searchQuery = q;
		const anonMatch = searchQuery.match(anonEmailRegex);
		if (anonMatch) {
			searchQuery = anonMatch[1];
		}

		const res = await ghFetch<GithubSearchResponse>(
			`/search/users?q=${encodeURIComponent(searchQuery)}`,
		);

		if (!res.items || res.items.length === 0) {
			continue;
		}

		const userSummary = res.items[0];
		const userDetails = await ghFetch<GithubUser>(
			`/users/${userSummary.login}`,
		);

		users.push({
			id: userDetails.id,
			login: userDetails.login,
			name: userDetails.name,
			twitter_username: userDetails.twitter_username,
			avatar_url: userDetails.avatar_url,
			public_repos: userDetails.public_repos,
		});
	}

	if (users.length === 0) {
		return NextResponse.json({ error: "User Not Found" }, { status: 404 });
	}

	if (users.length === 1) {
		return NextResponse.json({ user: users[0] });
	}
	return NextResponse.json({ users });
}
