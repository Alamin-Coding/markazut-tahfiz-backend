import { NextRequest, NextResponse } from "next/server";
import { ContactSubmission } from "@/lib/models/Contact";
import dbConnect from "@/lib/db";

// POST /api/contact/submit - Submit contact form
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const { name, email, phone, subject, message } = body;

		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{
					success: false,
					message: "Name, email, subject, and message are required",
				},
				{ status: 400 }
			);
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					success: false,
					message: "Please provide a valid email address",
				},
				{ status: 400 }
			);
		}

		const contactSubmission = new ContactSubmission({
			name,
			email,
			phone,
			subject,
			message,
		});

		await contactSubmission.save();

		const response = NextResponse.json({
			success: true,
			data: contactSubmission,
			message: "Contact form submitted successfully",
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "POST");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error submitting contact form:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to submit contact form",
			},
			{ status: 500 }
		);
	}
}
