import { NextRequest, NextResponse } from "next/server";
import FAQ from "@/lib/models/FAQ";
import dbConnect from "@/lib/db";

// GET /api/faq - Fetch all FAQs
export async function GET() {
	try {
		await dbConnect();

		const faqs = await FAQ.find({ isActive: true }).sort({
			order: 1,
			createdAt: -1,
		});

		const response = NextResponse.json({
			success: true,
			data: faqs,
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error fetching FAQs:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch FAQs",
			},
			{ status: 500 }
		);
	}
}

// POST /api/faq - Create a new FAQ
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const { question, answer, category = "general", order = 0 } = body;

		if (!question || !answer) {
			return NextResponse.json(
				{
					success: false,
					message: "Question and answer are required",
				},
				{ status: 400 }
			);
		}

		const faq = new FAQ({
			question,
			answer,
			category,
			order,
		});

		await faq.save();

		const response = NextResponse.json({
			success: true,
			data: faq,
			message: "FAQ created successfully",
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error creating FAQ:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create FAQ",
			},
			{ status: 500 }
		);
	}
}
