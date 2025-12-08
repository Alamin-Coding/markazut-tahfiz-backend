import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/lib/models/Student";

// GET /api/student - list students (with optional filters)
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const klass = searchParams.get("class");
		const section = searchParams.get("section");

		const filter: Record<string, unknown> = { isActive: true };
		if (status) filter.status = status;
		if (klass) filter.class = klass;
		if (section) filter.section = section;

		const students = await Student.find(filter).sort({ createdAt: -1 });

		return NextResponse.json({ success: true, data: students });
	} catch (error) {
		console.error("Error fetching students:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch students" },
			{ status: 500 }
		);
	}
}

// POST /api/student - create student
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const {
			name,
			email,
			guardianPhone,
			guardianName,
			admissionDate,
			class: klass,
			section,
			status = "active",
			feePlan,
		} = body;

		if (!name || !guardianPhone || !admissionDate || !klass) {
			return NextResponse.json(
				{
					success: false,
					message: "Name, guardian phone, admissionDate and class are required",
				},
				{ status: 400 }
			);
		}

		const student = new Student({
			name,
			email,
			guardianPhone,
			guardianName,
			admissionDate,
			class: klass,
			section,
			status,
			feePlan,
		});

		await student.save();

		return NextResponse.json({
			success: true,
			data: student,
			message: "Student created successfully",
		});
	} catch (error) {
		console.error("Error creating student:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create student" },
			{ status: 500 }
		);
	}
}

