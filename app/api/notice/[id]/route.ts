import { NextRequest, NextResponse } from "next/server";
import Notice from "@/lib/models/Notice";
import dbConnect from "@/lib/db";

// PUT /api/notice/[id] - Update a notice
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();

		const { id } = await params;
		const body = await request.json();
		const { title, date, content, type, isActive } = body;

		const updatedNotice = await Notice.findByIdAndUpdate(
			id,
			{
				title,
				date,
				content,
				type,
				isActive,
			},
			{ new: true }
		);

		if (!updatedNotice) {
			return NextResponse.json(
				{
					success: false,
					message: "Notice not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: updatedNotice,
			message: "Notice updated successfully",
		});
	} catch (error) {
		console.error("Error updating notice:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update notice",
			},
			{ status: 500 }
		);
	}
}

// DELETE /api/notice/[id] - Delete a notice
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();

		const { id } = await params;

		const deletedNotice = await Notice.findByIdAndUpdate(
			id,
			{ isActive: false },
			{ new: true }
		);

		if (!deletedNotice) {
			return NextResponse.json(
				{
					success: false,
					message: "Notice not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Notice deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting notice:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to delete notice",
			},
			{ status: 500 }
		);
	}
}
