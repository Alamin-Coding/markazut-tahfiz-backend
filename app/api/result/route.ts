import { NextRequest, NextResponse } from "next/server";
import Result from "@/lib/models/Result";
import dbConnect from "@/lib/db";

// GET /api/result - Fetch all results with optional filtering
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const term = searchParams.get("term");
		const division = searchParams.get("division");
		const classParam = searchParams.get("class");
		const roll = searchParams.get("roll");

		// Build filter object
		const filter: Record<string, any> = { isActive: true };

		if (term) filter.term = term;
		if (division) filter.division = division;
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
			division,
			class: classParam,
			term,
			totalMarks,
			subjects,
			examDate,
			resultDate,
			principal,
		} = body;

		if (
			!name ||
			!roll ||
			!division ||
			!classParam ||
			!term ||
			totalMarks === undefined ||
			!subjects ||
			!examDate ||
			!resultDate ||
			!principal
		) {
			return NextResponse.json(
				{
					success: false,
					message: "All fields are required",
				},
				{ status: 400 }
			);
		}

		// Check if result already exists for this student in this term
		const existingResult = await Result.findOne({
			roll,
			term,
			division,
			class: classParam,
			isActive: true,
		});

		if (existingResult) {
			return NextResponse.json(
				{
					success: false,
					message: "Result already exists for this student in this term",
				},
				{ status: 400 }
			);
		}

		const result = new Result({
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
