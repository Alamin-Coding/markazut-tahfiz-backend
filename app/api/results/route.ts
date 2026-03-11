import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/Result";

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const term = searchParams.get("term");
		const department = searchParams.get("department");
		const class_ = searchParams.get("class");
		const roll = searchParams.get("roll");
		const year = searchParams.get("year");

		const status = searchParams.get("status");

		if (!term || !department || !class_ || !roll || !year) {
			return NextResponse.json(
				{ success: false, message: "Missing search parameters" },
				{ status: 400 }
			);
		}

		const query: any = {
			term,
			department,
			class: class_,
			roll,
			examYear: year,
			isActive: true,
		};

		if (status) query.status = status;
		
		const result = await Result.findOne(query);

		if (!result) {
			return NextResponse.json(
				{ success: false, message: "Result not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: result });
	} catch (error: any) {
		console.error("Error fetching result:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		// Ensure new results are created as draft by default unless explicitly specified
		const resultData = { ...body };
		if (!resultData.status) {
			resultData.status = "draft";
		}
		
		const result = new Result(resultData);
		await result.save();
		return NextResponse.json({ success: true, data: result });
	} catch (error: any) {
		console.error("Error saving result:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
