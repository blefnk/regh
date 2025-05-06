import { unstable_cache as cachedFunction } from "next/cache";
import type {
	GitHubErrorResponse,
	GitHubTreeResponse,
	GithubContributor,
	GithubRepo,
} from "~/types";

const GH_TOKEN = process.env.GH_TOKEN;

export async function ghFetch<T>(
	url: string,
	opts: RequestInit = {},
): Promise<T> {
	const apiUrl = url.startsWith("/")
		? `https://api.github.com${url}`
		: `https://api.github.com/${url}`;

	const res = await fetch(apiUrl, {
		...opts,
		headers: {
			"User-Agent": "fetch",
			Authorization: `token ${GH_TOKEN}`,
			Accept: "application/vnd.github+json",
			...(opts.headers || {}),
		},
		method: opts.method || "GET",
		...(opts.body && typeof opts.body !== "string"
			? { body: JSON.stringify(opts.body) }
			: {}),
	});

	if (!res.ok) {
		const error = (await res.json()) as GitHubErrorResponse;
		throw new Error(`GitHub API error: ${error.message}`);
	}

	return res.json() as Promise<T>;
}

// Cache options
const REVALIDATE_6H = 60 * 60 * 6;

// General API fetch (for search, etc.)
export const ghApi = cachedFunction(
	async <T>(url: string, opts: RequestInit = {}) => ghFetch<T>(url, opts),
	["api"],
	{ revalidate: REVALIDATE_6H, tags: ["api"] },
);

// Repo details
export const ghRepo = cachedFunction(
	async (repo: string) => ghFetch<GithubRepo>(`/repos/${repo}`),
	["repo"],
	{ revalidate: REVALIDATE_6H, tags: ["repo"] },
);

// Repo contributors
export const ghRepoContributors = cachedFunction(
	async (repo: string) =>
		ghFetch<GithubContributor[]>(`/repos/${repo}/contributors`),
	["contributors"],
	{ revalidate: REVALIDATE_6H, tags: ["contributors"] },
);

// Repo files/tree
export const ghRepoFiles = cachedFunction(
	async (repo: string, ref: string) =>
		ghFetch<GitHubTreeResponse>(`/repos/${repo}/git/trees/${ref}?recursive=1`),
	["files"],
	{ revalidate: REVALIDATE_6H, tags: ["files"] },
);

// Markdown rendering
export const ghMarkdown = cachedFunction(
	async (markdown: string, repo: string) => {
		if (!markdown) return "";
		const response = await fetch("https://api.github.com/markdown", {
			method: "POST",
			headers: {
				Accept: "application/vnd.github.v3+json",
				"Content-Type": "application/json",
				...(GH_TOKEN ? { Authorization: `token ${GH_TOKEN}` } : {}),
			},
			body: JSON.stringify({
				text: markdown,
				mode: "gfm",
				context: repo,
			}),
		});

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.statusText}`);
		}

		return response.text();
	},
	["markdown"],
	{ revalidate: REVALIDATE_6H, tags: ["markdown"] },
);
