import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/Result";

export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const term = searchParams.get("term");
		const division = searchParams.get("division");
		const class_ = searchParams.get("class");
		const roll = searchParams.get("roll");
		const year = searchParams.get("year");

		if (!term || !division || !class_ || !roll || !year) {
			return NextResponse.json(
				{ success: false, message: "Missing search parameters" },
				{ status: 400 }
			);
		}

		const result = await Result.findOne({
			term,
			division,
			class: class_,
			roll,
			examYear: year,
			isActive: true,
		});

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
		const result = new Result(body);
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
