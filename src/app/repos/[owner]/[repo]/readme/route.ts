import { type NextRequest, NextResponse } from "next/server";
import { $fetch } from "ofetch";
import { ghMarkdown, ghRepo } from "~/utils/github";
import { resolveMarkdownRelativeLinks } from "~/utils/markdown";

const GH_RAW_URL = "https://raw.githubusercontent.com";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ owner: string; repo: string }> },
) {
	const { owner, repo } = await params;
	const repoName = `${owner}/${repo}`;
	const defaultBranch = await ghRepo(repoName).then(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(r: any) => r.default_branch || "main",
	);
	const cdnBaseURL = `${GH_RAW_URL}/${repoName}/${defaultBranch}`;
	const markdown = await $fetch<string>(`${cdnBaseURL}/README.md`);
	// const html = await ghMarkdown(markdown, repoName, "readme");
	const html = await ghMarkdown(markdown, repoName);
	return NextResponse.json({
		markdown: resolveMarkdownRelativeLinks(markdown, cdnBaseURL),
		html: resolveMarkdownRelativeLinks(html, cdnBaseURL),
	});
}
