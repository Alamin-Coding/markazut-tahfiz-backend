import { NextRequest, NextResponse } from "next/server";
import Result from "@/lib/models/Result";
import Student from "@/lib/models/Student";
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
			examYear,
			totalMarks,
			subjects,
			examDate,
			resultDate,
			principal,
			isActive,
		} = body;

		// STRICT STUDENT VALIDATION
		// Verify student exists with EXACT name, class and division (department)
		// and matches either the provided 'roll' or 'studentId'.
		const student = await Student.findOne({
			name: name.trim(),
			class: classParam.trim(),
			department: division.trim(),
			$or: [
				{ roll: roll.toString().trim() },
				{ studentId: roll.toString().trim() },
			],
			isActive: true,
		});

		if (!student) {
			console.log("Result Update Validation Failed. Payload:", {
				name,
				roll,
				class: classParam,
				division,
			});
			return NextResponse.json(
				{
					success: false,
					message:
						"ছাত্রের তথ্য ডাটাবেজের সাথে মিলছে না। অনুগ্রহ করে সঠিক নাম, রোল/আইডি, শ্রেণী ও বিভাগ চেক করুন।",
				},
				{ status: 400 }
			);
		}

		const updatedResult = await Result.findByIdAndUpdate(
			id,
			{
				name: name.trim(),
				roll,
				studentId: student.studentId,
				division,
				class: classParam,
				term,
				examYear,
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
