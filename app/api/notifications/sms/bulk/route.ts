import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { smsService } from "@/lib/services/sms";

// POST /api/notifications/sms/bulk
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const { numbers, message, title, payload } = await request.json();

		// Validate input
		if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
			return NextResponse.json(
				{ success: false, message: "অন্তত একটি ফোন নম্বর প্রয়োজন" },
				{ status: 400 }
			);
		}

		if (!message) {
			return NextResponse.json(
				{ success: false, message: "মেসেজ প্রয়োজন" },
				{ status: 400 }
			);
		}

		// Send bulk SMS using SMS service
		const smsResult = await smsService.sendBulkSMS({ numbers, message, title });

		// Save notification to database
		const notification = new Notification({
			type: "sms",
			title: title || "Bulk SMS", // Use provided title or default
			message: smsResult.message,
			payload: {
				numbers,
				message,
				result: smsResult.data,
				...payload,
			},
			status: smsResult.success ? "sent" : "failed",
		});
		await notification.save();

		return NextResponse.json({
			success: smsResult.success,
			message: smsResult.message,
			data: {
				notificationId: notification._id,
				sent: smsResult.data?.sent || 0,
				failed: smsResult.data?.failed || 0,
				details: smsResult.data?.details || [],
			},
		});
	} catch (error) {
		console.error("Error sending bulk SMS:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to send bulk SMS" },
			{ status: 500 }
		);
	}
}
