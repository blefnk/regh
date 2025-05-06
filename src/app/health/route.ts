import { NextResponse } from "next/server";

export async function GET() {
	// TODO: Implement health check for GitHub API rate limit
	// const runtimeConfig = useRuntimeConfig();
	// const res = await $fetch.raw("/meta", {
	//   baseURL: "https://api.github.com",
	//   headers: {
	//     "User-Agent": "fetch",
	//     Authorization: "token " + runtimeConfig.GH_TOKEN,
	//   },
	// });
	// const headers = Object.fromEntries(res.headers.entries());
	// return NextResponse.json({
	//   rateLimit:
	//     headers["x-ratelimit-remaining"] + "/" + headers["x-ratelimit-limit"],
	// });
	return NextResponse.json({ status: "ok" });
}
