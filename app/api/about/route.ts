import { NextRequest, NextResponse } from "next/server";
import About from "@/lib/models/About";
import dbConnect from "@/lib/db";

// GET /api/about - Fetch about section
export async function GET() {
	try {
		await dbConnect();
		const about = await About.findOne();
		const response = NextResponse.json({
			success: true,
			data: about || {},
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		return response;
	} catch (error) {
		console.error("Error fetching about:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch about",
				error: String(error),
			},
			{ status: 500 }
		);
	}
}

// POST /api/about - Update about section
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();

		const about = await About.findOneAndUpdate({}, body, {
			new: true,
			upsert: true,
		});

		const response = NextResponse.json({
			success: true,
			data: about,
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		return response;
	} catch (error) {
		console.error("Error updating about:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update about",
				error: String(error),
			},
			{ status: 500 }
		);
	}
}
