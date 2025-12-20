import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Income from "@/lib/models/Income";

// GET /api/finance/income/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const item = await Income.findById(id);
		if (!item || !item.isActive) {
			return NextResponse.json(
				{ success: false, message: "Income entry not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ success: true, data: item });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetch income entry" },
			{ status: 500 }
		);
	}
}

// PUT /api/finance/income/[id]
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const body = await request.json();
		const updatedItem = await Income.findByIdAndUpdate(
			id,
			{ ...body },
			{ new: true }
		);
		if (!updatedItem) {
			return NextResponse.json(
				{ success: false, message: "Income entry not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			data: updatedItem,
			message: "Income updated successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to update income entry" },
			{ status: 500 }
		);
	}
}

// DELETE /api/finance/income/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		// Soft delete
		const item = await Income.findByIdAndUpdate(id, { isActive: false });
		if (!item) {
			return NextResponse.json(
				{ success: false, message: "Income entry not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			message: "Income deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to delete income entry" },
			{ status: 500 }
		);
	}
}
