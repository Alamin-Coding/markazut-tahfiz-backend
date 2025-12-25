import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/lib/models/Student";

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
		return NextResponse.json(
			{ success: false, message: "Failed to fetch student" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const body = await request.json();
		const updatedStudent = await Student.findByIdAndUpdate(
			id,
			{ ...body },
			{ new: true }
		);
		if (!updatedStudent) {
			return NextResponse.json(
				{ success: false, message: "Student not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			data: updatedStudent,
			message: "Student updated successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Failed to update student" },
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
		const student = await Student.findByIdAndUpdate(id, { isActive: false });
		if (!student) {
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
		return NextResponse.json(
			{ success: false, message: "Failed to delete student" },
			{ status: 500 }
		);
	}
}
