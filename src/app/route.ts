import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({
		message: "🤭 regh (docs: https://github.com/blefnk/regh)",
	});
}
