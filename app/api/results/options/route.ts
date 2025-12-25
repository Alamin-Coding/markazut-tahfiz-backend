import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/Result";

export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const [terms, divisions, classes, years, rolls] = await Promise.all([
			Result.distinct("term", { isActive: true }),
			Result.distinct("division", { isActive: true }),
			Result.distinct("class", { isActive: true }),
			Result.distinct("examYear", { isActive: true }),
			Result.distinct("roll", { isActive: true }),
		]);

		return NextResponse.json({
			success: true,
			data: {
				terms: terms.sort(),
				divisions: divisions.sort(),
				classes: classes.sort(),
				years: years.sort(),
				rolls: rolls.sort((a, b) => Number(a) - Number(b)),
			},
		});
	} catch (error: any) {
		console.error("Error fetching result options:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch options" },
			{ status: 500 }
		);
	}
}
