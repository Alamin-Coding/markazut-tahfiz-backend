import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/lib/models/Student";

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search");
		const class_ = searchParams.get("class");
		const department = searchParams.get("department");

		const filter: any = { isActive: true };

		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ studentId: { $regex: search, $options: "i" } },
				{ roll: { $regex: search, $options: "i" } },
				{ guardianPhone: { $regex: search, $options: "i" } },
			];
		}

		if (class_) filter.class = class_;
		if (department) filter.department = department;

		const students = await Student.find(filter).sort({ createdAt: -1 });

		return NextResponse.json({ success: true, data: students });
	} catch (error: any) {
		console.error("Error fetching students:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch students" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();

		if (
			!body.name ||
			!body.studentId ||
			!body.guardianPhone ||
			!body.department ||
			!body.class
		) {
			return NextResponse.json(
				{ success: false, message: "Required fields missing" },
				{ status: 400 }
			);
		}

		const existingStudent = await Student.findOne({
			studentId: body.studentId,
		});
		if (existingStudent) {
			return NextResponse.json(
				{ success: false, message: "Student ID already exists" },
				{ status: 400 }
			);
		}

		const student = new Student({
			...body,
			roll: body.roll, // Explicitly pass roll
		});

		await student.save();
		return NextResponse.json({
			success: true,
			data: student,
			message: "Student added successfully",
		});
	} catch (error: any) {
		console.error("Error creating student:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create student: " + error.message },
			{ status: 500 }
		);
	}
}
