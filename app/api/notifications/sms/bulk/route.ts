import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/Notification";

// POST /api/notifications/sms/bulk
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const { numbers, message, title = "Bulk SMS", payload } =
			await request.json();

		if (!Array.isArray(numbers) || numbers.length === 0 || !message) {
			return NextResponse.json(
				{
					success: false,
					message: "numbers[] and message are required",
				},
				{ status: 400 }
			);
		}

		// Placeholder: Here you would enqueue SMS jobs to your provider
		const notification = new Notification({
			type: "sms",
			title,
			message: `Queued ${numbers.length} SMS`,
			payload: { numbers, message, ...payload },
			status: "pending",
		});
		await notification.save();

		return NextResponse.json({
			success: true,
			message: "Bulk SMS queued",
			data: { notificationId: notification._id, count: numbers.length },
		});
	} catch (error) {
		console.error("Error queuing bulk SMS:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to queue bulk SMS" },
			{ status: 500 }
		);
	}
}

