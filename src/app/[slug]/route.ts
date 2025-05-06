import { type NextRequest, NextResponse } from "next/server";

/**
 * GET endpoint that handles slug-based requests
 * @param request The incoming Next.js request
 * @param params Object containing the route parameters
 * @returns JSON response with greeting message or error
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		const { slug } = await params;

		// Validate slug
		if (!slug || typeof slug !== "string") {
			return NextResponse.json(
				{ error: "Invalid slug parameter" },
				{ status: 400 },
			);
		}

		// Remove any potentially harmful characters
		const sanitizedSlug = slug.replace(/[^\w\s-]/g, "");

		return NextResponse.json(
			{
				success: true,
				data: {
					message: `Hello ${sanitizedSlug}!`,
					timestamp: new Date().toISOString(),
					slug: sanitizedSlug,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error processing request:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
