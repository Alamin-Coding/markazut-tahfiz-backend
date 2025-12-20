import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Expense from "@/lib/models/Expense";

// GET /api/finance/expense/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const item = await Expense.findById(id);
		if (!item || !item.isActive) {
			return NextResponse.json(
				{ success: false, message: "Expense entry not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ success: true, data: item });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetch expense entry" },
			{ status: 500 }
		);
	}
}

// PUT /api/finance/expense/[id]
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const body = await request.json();
		const updatedItem = await Expense.findByIdAndUpdate(
			id,
			{ ...body },
			{ new: true }
		);
		if (!updatedItem) {
			return NextResponse.json(
				{ success: false, message: "Expense entry not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			data: updatedItem,
			message: "Expense updated successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to update expense entry" },
			{ status: 500 }
		);
	}
}

// DELETE /api/finance/expense/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		// Soft delete
		const item = await Expense.findByIdAndUpdate(id, {
			isActive: false,
		});
		if (!item) {
			return NextResponse.json(
				{ success: false, message: "Expense entry not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			message: "Expense deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to delete expense entry" },
			{ status: 500 }
		);
	}
}
