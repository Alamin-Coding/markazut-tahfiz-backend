import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TermConfig from "@/lib/models/TermConfig";

export async function GET() {
	try {
		await dbConnect();
		const configs = await TermConfig.find({ isActive: true }).sort({
			createdAt: 1,
		});
		return NextResponse.json({ success: true, data: configs });
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { id, name } = body;

		if (id) {
			const updated = await TermConfig.findByIdAndUpdate(
				id,
				{ name },
				{ new: true },
			);
			return NextResponse.json({ success: true, data: updated });
		} else {
			const created = await TermConfig.create({ name });
			return NextResponse.json({ success: true, data: created });
		}
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		if (!id) throw new Error("ID is required");

		await TermConfig.findByIdAndDelete(id);
		return NextResponse.json({
			success: true,
			message: "Deleted successfully",
		});
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 },
		);
	}
}
