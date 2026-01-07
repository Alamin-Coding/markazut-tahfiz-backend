import { NextRequest, NextResponse } from "next/server";
import Result from "@/lib/models/Result";
import Student from "@/lib/models/Student";
import dbConnect from "@/lib/db";

// GET /api/result - Fetch all results with optional filtering
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const term = searchParams.get("term");
		const department = searchParams.get("department");
		const classParam = searchParams.get("class");
		const roll = searchParams.get("roll");

		// Build filter object
		const filter: Record<string, any> = { isActive: true };

		if (term) filter.term = term;
		if (department) filter.department = department;
		if (classParam) filter.class = classParam;
		if (roll) filter.roll = roll;

		const results = await Result.find(filter).sort({
			createdAt: -1,
		});

		return NextResponse.json({
			success: true,
			data: results,
		});
	} catch (error) {
		console.error("Error fetching results:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch results",
			},
			{ status: 500 }
		);
	}
}

// POST /api/result - Create a new result
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const {
			name,
			roll,
			department,
			class: classParam,
			term,
			examYear,
			studentId,
			totalMarks,
			subjects,
			examDate,
			resultDate,
			principal,
		} = body;

		if (
			!name ||
			!roll ||
			!department ||
			!classParam ||
			!term ||
			!examYear ||
			totalMarks === undefined ||
			!subjects ||
			!examDate ||
			!resultDate ||
			!principal
		) {
			return NextResponse.json(
				{
					success: false,
					message: "All fields are required (including exam year)",
				},
				{ status: 400 }
			);
		}

		// STRICT STUDENT VALIDATION
		// Verify student exists with EXACT name, class and department
		// and matches either the provided 'roll' or 'studentId'.
		const student = await Student.findOne({
			name: name.trim(),
			class: classParam.trim(),
			department: department.trim(),
			$or: [
				{ roll: roll.toString().trim() },
				{ studentId: roll.toString().trim() },
			],
			isActive: true,
		});

		if (!student) {
			return NextResponse.json(
				{
					success: false,
					message:
						"ছাত্রের তথ্য ডাটাবেজের সাথে মিলছে না। অনুগ্রহ করে সঠিক নাম, রোল/আইডি, শ্রেণী ও বিভাগ চেক করুন।",
				},
				{ status: 400 }
			);
		}

		// Check if result already exists for this student in this term and year
		const existingResult = await Result.findOne({
			roll,
			term,
			department,
			class: classParam,
			examYear,
			isActive: true,
		});

		if (existingResult) {
			return NextResponse.json(
				{
					success: false,
					message: "এই ছাত্রের জন্য এই পরীক্ষার ফলাফল ইতিমধ্যে বিদ্যমান",
				},
				{ status: 400 }
			);
		}

		const result = new Result({
			name: name.trim(),
			roll,
			studentId: student.studentId,
			department,
			class: classParam,
			term,
			examYear,
			totalMarks,
			subjects,
			examDate,
			resultDate,
			principal,
		});

		await result.save();

		return NextResponse.json({
			success: true,
			data: result,
			message: "Result created successfully",
		});
	} catch (error) {
		console.error("Error creating result:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create result",
			},
			{ status: 500 }
		);
	}
}
