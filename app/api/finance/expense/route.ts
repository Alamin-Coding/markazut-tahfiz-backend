import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Expense from "@/lib/models/Expense";

// GET /api/finance/expense
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const from = searchParams.get("from");
		const to = searchParams.get("to");
		const category = searchParams.get("category");

		const filter: Record<string, unknown> = { isActive: true };
		if (category) filter.category = category;
		if (from || to) {
			filter.date = {};
			if (from) (filter.date as Record<string, Date>).$gte = new Date(from);
			if (to) (filter.date as Record<string, Date>).$lte = new Date(to);
		}

		const items = await Expense.find(filter).sort({ date: -1 });

		return NextResponse.json({ success: true, data: items });
	} catch (error) {
		console.error("Error fetching expenses:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch expenses" },
			{ status: 500 }
		);
	}
}

// POST /api/finance/expense
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { category, amount, date, notes, payee } = body;

		if (!category || amount === undefined) {
			return NextResponse.json(
				{ success: false, message: "category and amount are required" },
				{ status: 400 }
			);
		}

		const expense = new Expense({
			category,
			amount,
			date: date ? new Date(date) : undefined,
			notes,
			payee,
		});
		await expense.save();

		return NextResponse.json({
			success: true,
			data: expense,
			message: "Expense added successfully",
		});
	} catch (error) {
		console.error("Error creating expense:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create expense" },
			{ status: 500 }
		);
	}
}

