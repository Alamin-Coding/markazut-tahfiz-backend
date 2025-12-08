import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/lib/models/Payment";

// GET /api/payment/summary?studentId&from&to&groupBy=month|year
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const studentId = searchParams.get("studentId");
		const from = searchParams.get("from");
		const to = searchParams.get("to");
		const groupBy = searchParams.get("groupBy") === "year" ? "year" : "month";

		const match: Record<string, unknown> = { isActive: true };
		if (studentId) match.student = studentId;
		if (from || to) {
			match.paidAt = {};
			if (from) (match.paidAt as Record<string, Date>).$gte = new Date(from);
			if (to) (match.paidAt as Record<string, Date>).$lte = new Date(to);
		}

		const projectStage =
			groupBy === "year"
				? {
						year: { $year: "$paidAt" },
				  }
				: {
						year: { $year: "$paidAt" },
						month: { $dateToString: { format: "%Y-%m", date: "$paidAt" } },
				  };

		const groupId =
			groupBy === "year"
				? { year: "$year" }
				: { year: "$year", month: "$month" };

		const summary = await Payment.aggregate([
			{ $match: match },
			{ $project: { amount: 1, paidAt: 1, ...projectStage } },
			{
				$group: {
					_id: groupId,
					total: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
			{ $sort: groupBy === "year" ? { "_id.year": 1 } : { "_id.month": 1 } },
		]);

		const overall = await Payment.aggregate([
			{ $match: match },
			{ $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
		]);

		return NextResponse.json({
			success: true,
			data: {
				summary,
				overall: overall[0] || { total: 0, count: 0 },
			},
		});
	} catch (error) {
		console.error("Error building payment summary:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to build payment summary" },
			{ status: 500 }
		);
	}
}

