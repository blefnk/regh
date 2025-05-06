export interface GithubRepo {
	id: number;
	created_at: string;
	default_branch: string;
	description: string | null;
	forks: number;
	full_name: string;
	git_url: string;
	html_url: string;
	language: string | null;
	name: string;
	private: boolean;
	pushed_at: string;
	stargazers_count: number;
	subscribers_count?: number | null;
	updated_at: string;
	open_issues_count: number;
}

export interface GithubOrg {
	id: number;
	name: string;
	description: string | null;
	public_repos: number;
}

export interface GithubUser {
	id: string;
	login: string;
	name: string;
	twitter_username: string;
	avatar_url: string;
	public_repos: number;
}

export interface GithubContributor {
	avatar_url: string;
	contributions: number;
	html_url: string;
	id: string;
	login: string;
	type: string;
}

export interface GithubFile {
	path: string;
	mode: string;
	sha: string;
	size: number;
}

// TODO: uncomment after rate-limit is implemented
// export interface GithubFileData {
// 	contents: string;
// 	html?: string;
// }

interface GithubReleaseAsset {
	content_type: string;
	size: number;
	created_at: string;
	updated_at: string;
	download_count: number;
	download_url: string;
}

export interface GithubRelease {
	id: number;
	tag: string;
	author: string;
	name: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	markdown: string;
	html: string;
	assets: GithubReleaseAsset[];
}

export interface GitHubReleaseResponse {
	id: number;
	tag_name: string;
	name: string;
	body: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	author: {
		login: string;
	};
	assets: GithubReleaseAsset[];
}

export interface GitHubBranches {
	name: string;
	commit: string;
	protected: boolean;
	protection: string;
	protection_url: string;
}

export interface GitHubErrorResponse {
	message: string;
	documentation_url?: string;
}

export interface GitHubTreeResponse {
	sha: string;
	tree: {
		path: string;
		mode: string;
		type: "blob" | "tree";
		sha: string;
		size?: number;
		url: string;
	}[];
	truncated: boolean;
}

export interface GithubSearchResponse {
	items: {
		id: string;
		login: string;
		name: string;
		twitter_username: string;
		avatar_url: string;
	}[];
}
