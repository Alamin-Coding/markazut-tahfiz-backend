import { NextRequest, NextResponse } from "next/server";
import Notice from "@/lib/models/Notice";
import dbConnect from "@/lib/db";

// GET /api/notice - Fetch all notices
export async function GET() {
	try {
		await dbConnect();

		const notices = await Notice.find({ isActive: true }).sort({
			createdAt: -1,
		});

		const response = NextResponse.json({
			success: true,
			data: notices,
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error fetching notices:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch notices",
			},
			{ status: 500 }
		);
	}
}

// POST /api/notice - Create a new notice
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const { title, date, content, type = "announcement" } = body;

		if (!title || !date || !content) {
			return NextResponse.json(
				{
					success: false,
					message: "Title, date, and content are required",
				},
				{ status: 400 }
			);
		}

		const notice = new Notice({
			title,
			date,
			content,
			type,
		});

		await notice.save();

		const response = NextResponse.json({
			success: true,
			data: notice,
			message: "Notice created successfully",
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error creating notice:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create notice",
			},
			{ status: 500 }
		);
	}
}
