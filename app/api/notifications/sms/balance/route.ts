import { NextRequest, NextResponse } from "next/server";
import { smsService } from "@/lib/services/sms";

// GET /api/notifications/sms/balance
export async function GET(request: NextRequest) {
	try {
		const balanceResult = await smsService.checkBalance();

		if (balanceResult.success) {
			return NextResponse.json({
				success: true,
				balance: balanceResult.balance,
				message: `আপনার balance: ${balanceResult.balance} টাকা`,
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					message: balanceResult.message || "Balance পাওয়া যায়নি",
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error checking SMS balance:", error);
		return NextResponse.json(
			{ success: false, message: "Balance check করতে সমস্যা হয়েছে" },
			{ status: 500 }
		);
	}
}
