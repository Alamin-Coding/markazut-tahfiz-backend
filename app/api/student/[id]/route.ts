import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/lib/models/Student";

// GET /api/student/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const student = await Student.findById(id);
		if (!student || !student.isActive) {
			return NextResponse.json(
				{ success: false, message: "Student not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ success: true, data: student });
	} catch (error) {
		console.error("Error fetching student:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch student" },
			{ status: 500 }
		);
	}
}

// PUT /api/student/[id]
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const body = await request.json();

		const updated = await Student.findByIdAndUpdate(id, body, { new: true });
		if (!updated) {
			return NextResponse.json(
				{ success: false, message: "Student not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			data: updated,
			message: "Student updated successfully",
		});
	} catch (error) {
		console.error("Error updating student:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update student" },
			{ status: 500 }
		);
	}
}

// DELETE /api/student/[id] (soft delete)
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const deleted = await Student.findByIdAndUpdate(
			id,
			{ isActive: false, status: "inactive" },
			{ new: true }
		);
		if (!deleted) {
			return NextResponse.json(
				{ success: false, message: "Student not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			message: "Student deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting student:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete student" },
			{ status: 500 }
		);
	}
}

