import { NextRequest, NextResponse } from "next/server";
import Result from "@/lib/models/Result";
import dbConnect from "@/lib/db";

// PUT /api/result/[id] - Update a result
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();

		const { id } = await params;
		const body = await request.json();
		const {
			name,
			roll,
			division,
			class: classParam,
			term,
			totalMarks,
			subjects,
			examDate,
			resultDate,
			principal,
			isActive,
		} = body;

		const updatedResult = await Result.findByIdAndUpdate(
			id,
			{
				name,
				roll,
				division,
				class: classParam,
				term,
				totalMarks,
				subjects,
				examDate,
				resultDate,
				principal,
				isActive,
			},
			{ new: true }
		);

		if (!updatedResult) {
			return NextResponse.json(
				{
					success: false,
					message: "Result not found",
				},
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
			{
				success: false,
				message: "Failed to update result",
			},
			{ status: 500 }
		);
	}
}

// DELETE /api/result/[id] - Delete a result (soft delete)
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();

		const { id } = await params;

		const deletedResult = await Result.findByIdAndUpdate(
			id,
			{ isActive: false },
			{ new: true }
		);

		if (!deletedResult) {
			return NextResponse.json(
				{
					success: false,
					message: "Result not found",
				},
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
			{
				success: false,
				message: "Failed to delete result",
			},
			{ status: 500 }
		);
	}
}
