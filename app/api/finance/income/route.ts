import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Income from "@/lib/models/Income";

// GET /api/finance/income
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

		const items = await Income.find(filter).sort({ date: -1 });

		return NextResponse.json({ success: true, data: items });
	} catch (error) {
		console.error("Error fetching income:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch income" },
			{ status: 500 }
		);
	}
}

// POST /api/finance/income
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { source, amount, date, notes, category } = body;

		if (!source || amount === undefined) {
			return NextResponse.json(
				{ success: false, message: "source and amount are required" },
				{ status: 400 }
			);
		}

		const income = new Income({
			source,
			amount,
			date: date ? new Date(date) : undefined,
			notes,
			category,
		});
		await income.save();

		return NextResponse.json({
			success: true,
			data: income,
			message: "Income added successfully",
		});
	} catch (error) {
		console.error("Error creating income:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create income" },
			{ status: 500 }
		);
	}
}

