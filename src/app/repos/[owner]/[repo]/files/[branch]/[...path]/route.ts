import { type NextRequest, NextResponse } from "next/server";

// import { $fetch, FetchError } from "ofetch";
// import { ghMarkdown } from "~/utils/github";
// import type { GithubFileData } from "~/types";

export async function GET(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			owner: string;
			repo: string;
			branch: string;
			path: string;
		}>;
	},
) {
	try {
		const { owner, repo, branch, path } = await params;
		const repoName = `${owner}/${repo}`;
		const ref = `${branch}/${path}`;
		const url = `https://raw.githubusercontent.com/${repoName}/${ref}`;

		// TEMP: Redirect to the raw file URL
		return NextResponse.redirect(url, 302);

		// TODO: uncomment after rate-limit is implemented
		// try {
		// const contents = await $fetch<string>(url);
		// const file: GithubFileData = { contents };
		// if (url.endsWith(".md")) {
		// 	file.html = await ghMarkdown(contents, repoName);
		// }
		// return NextResponse.json({
		// 	meta: { url },
		// 	file,
		// });
		// } catch (error) {
		// if (error instanceof FetchError && error.response?.status === 404) {
		// 	return NextResponse.json(
		// 		{
		// 			error: "File not found",
		// 			message: `The file '${path}' was not found in ${repoName} repository at branch '${branch}'`,
		// 		},
		// 		{ status: 404 },
		// 	);
		// }
		// throw error;
		// }
	} catch (error) {
		// console.error("Error fetching file:", error);
		console.error("Error creating redirect:", error);
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
