import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";
import dbConnect from "@/lib/db";
import Income from "@/lib/models/Income";
import Expense from "@/lib/models/Expense";

// GET /api/finance/summary?from&to&groupBy=month|year
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const from = searchParams.get("from");
		const to = searchParams.get("to");
		const groupBy = searchParams.get("groupBy") === "year" ? "year" : "month";

		const dateMatch: Record<string, unknown> = {};
		if (from || to) {
			dateMatch.date = {};
			if (from) (dateMatch.date as Record<string, Date>).$gte = new Date(from);
			if (to) (dateMatch.date as Record<string, Date>).$lte = new Date(to);
		}

		const buildPipeline = (): PipelineStage[] => {
			const projectStage =
				groupBy === "year"
					? { year: { $year: "$date" } }
					: {
							year: { $year: "$date" },
							month: { $dateToString: { format: "%Y-%m", date: "$date" } },
					  };

			const groupId =
				groupBy === "year"
					? { year: "$year" }
					: { year: "$year", month: "$month" };

			return [
				{ $match: { isActive: true, ...dateMatch } },
				{ $project: { amount: 1, date: 1, ...projectStage } },
				{
					$group: {
						_id: groupId,
						total: { $sum: "$amount" },
						count: { $sum: 1 },
					},
				},
				{ $sort: groupBy === "year" ? { "_id.year": 1 } : { "_id.month": 1 } },
			];
		};

		const [incomeSummary, expenseSummary] = await Promise.all([
			Income.aggregate(buildPipeline()),
			Expense.aggregate(buildPipeline()),
		]);

		const overallIncome = await Income.aggregate([
			{ $match: { isActive: true, ...dateMatch } },
			{ $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
		]);
		const overallExpense = await Expense.aggregate([
			{ $match: { isActive: true, ...dateMatch } },
			{ $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
		]);

		return NextResponse.json({
			success: true,
			data: {
				incomeSummary,
				expenseSummary,
				overall: {
					income: overallIncome[0] || { total: 0, count: 0 },
					expense: overallExpense[0] || { total: 0, count: 0 },
					net:
						(overallIncome[0]?.total || 0) - (overallExpense[0]?.total || 0),
				},
			},
		});
	} catch (error) {
		console.error("Error building finance summary:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to build finance summary" },
			{ status: 500 }
		);
	}
}

