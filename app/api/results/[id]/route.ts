import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/Result";

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const body = await request.json();

		const updatedResult = await Result.findByIdAndUpdate(
			id,
			{ $set: body },
			{ new: true }
		);

		if (!updatedResult) {
			return NextResponse.json(
				{ success: false, message: "Result not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: updatedResult,
			message: "Result updated successfully",
		});
	} catch (error) {
		console.error("Error updating result:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update result" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;

		// Hard delete as per standard practice, or soft delete if required. We'll do hard delete.
		const result = await Result.findByIdAndDelete(id);

		if (!result) {
			return NextResponse.json(
				{ success: false, message: "Result not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Result deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting result:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete result" },
			{ status: 500 }
		);
	}
}
