import { type NextRequest, NextResponse } from "next/server";
import type { GithubRepo } from "~/types";
import { ghRepo } from "~/utils/github";

/**
 * Get repository details.
 *
 * @see http://localhost:3000/repos/reliverse/rse
 * @see http://localhost:3000/repos/reliverse/rse?details=1
 * @see http://localhost:3000/repos/reliverse/rse?fields=id,full_name,description,updated_at
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string; repo: string }> },
) {
	const { owner, repo } = await params;
	const url = new URL(request.url);
	const fields = url.searchParams.get("fields"); // comma-separated list

	const rawRepo = await ghRepo(`${owner}/${repo}`);
	const repoData: GithubRepo = {
		id: rawRepo.id,
		name: rawRepo.name,
		full_name: rawRepo.full_name,
		description: rawRepo.description,
		created_at: rawRepo.created_at,
		updated_at: rawRepo.updated_at,
		pushed_at: rawRepo.pushed_at,
		stargazers_count: rawRepo.stargazers_count,
		subscribers_count: rawRepo.subscribers_count ?? null,
		forks: rawRepo.forks,
		default_branch: rawRepo.default_branch,
		git_url: rawRepo.git_url,
		html_url: rawRepo.html_url,
		language: rawRepo.language,
		private: rawRepo.private,
		open_issues_count: rawRepo.open_issues_count,
	};

	let responseRepo: Partial<GithubRepo> = repoData;

	// If fields param is provided, filter the output
	if (fields) {
		const fieldList = fields
			.split(",")
			.map((f) => f.trim())
			.filter(Boolean);
		responseRepo = {};
		for (const field of fieldList) {
			if (field in repoData) {
				// @ts-expect-error: dynamic key
				responseRepo[field] = repoData[field as keyof GithubRepo];
			}
		}
	}

	return NextResponse.json({ repo: responseRepo });
}
