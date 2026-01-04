import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/lib/models/ContactMessage";
import Notification from "@/lib/models/Notification";
import nodemailer from "nodemailer";

// GET /api/contact - List messages (for admin)
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const messages = await ContactMessage.find().sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: messages });
	} catch (error) {
		console.error("Error fetching messages:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch messages" },
			{ status: 500 }
		);
	}
}

// POST /api/contact - Submit new message
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { name, email, phone, subject, message } = body;

		// 1. Validation
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ success: false, message: "All fields are required" },
				{ status: 400 }
			);
		}

		// 2. Save to Database
		let newMessage;
		try {
			newMessage = new ContactMessage({
				name,
				email,
				phone,
				subject,
				message,
			});
			await newMessage.save();
		} catch (dbError: any) {
			console.error("Database Save Error:", dbError);
			return NextResponse.json(
				{ success: false, message: "Database Save Failed: " + dbError.message },
				{ status: 500 }
			);
		}

		// 3. Create Dashboard Notification
		try {
			const notification = new Notification({
				type: "message",
				title: "New Contact Message",
				message: `${name} sent a message: ${subject}`,
				payload: { messageId: newMessage._id },
			});
			await notification.save();
		} catch (notifError: any) {
			console.error("Notification Error (ignoring):", notifError);
		}

		// 4. Send Email to Admin
		if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			const mailOptions = {
				from: `"${name}" <${email}>`,
				to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
				subject: `New Contact Form Submission: ${subject}`,
				html: `
                <h3>New Message from Markazut Tahfiz Website</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <br/>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
			};

			try {
				await transporter.sendMail(mailOptions);
			} catch (emailError) {
				console.error("Email Send Error (ignoring):", emailError);
			}
		}

		return NextResponse.json({
			success: true,
			message: "Message sent successfully",
			data: newMessage,
		});
	} catch (error) {
		console.error("Error submitting contact form:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to send message" },
			{ status: 500 }
		);
	}
}

// DELETE /api/contact?id=... - Delete a message
export async function DELETE(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "ID required" },
				{ status: 400 }
			);
		}

		await ContactMessage.findByIdAndDelete(id);
		return NextResponse.json({ success: true, message: "Message deleted" });
	} catch (error) {
		console.error("Error deleting message:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete" },
			{ status: 500 }
		);
	}
}

// PATCH /api/contact?id=... - Update status
export async function PATCH(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const body = await request.json();

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "ID required" },
				{ status: 400 }
			);
		}

		const updated = await ContactMessage.findByIdAndUpdate(id, body, {
			new: true,
		});
		return NextResponse.json({ success: true, data: updated });
	} catch (error) {
		console.error("Error updating message:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update" },
			{ status: 500 }
		);
	}
}
