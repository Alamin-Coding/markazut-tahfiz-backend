import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClassConfig from "@/lib/models/ClassConfig";

export async function GET() {
	try {
		await dbConnect();
		const configs = await ClassConfig.find({ isActive: true }).sort({
			createdAt: 1,
		});
		return NextResponse.json({ success: true, data: configs });
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { id, className, divisions } = body;

		if (id) {
			const updated = await ClassConfig.findByIdAndUpdate(
				id,
				{ className, divisions },
				{ new: true }
			);
			return NextResponse.json({ success: true, data: updated });
		} else {
			const created = await ClassConfig.create({ className, divisions });
			return NextResponse.json({ success: true, data: created });
		}
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		if (!id) throw new Error("ID is required");

		await ClassConfig.findByIdAndDelete(id);
		return NextResponse.json({
			success: true,
			message: "Deleted successfully",
		});
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
