import { NextRequest, NextResponse } from "next/server";
import FAQ from "@/lib/models/FAQ";
import dbConnect from "@/lib/db";

// PUT /api/faq/[id] - Update a FAQ
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();

		const { id } = await params;
		const body = await request.json();
		const { question, answer, category, isActive, order } = body;

		const updatedFAQ = await FAQ.findByIdAndUpdate(
			id,
			{
				question,
				answer,
				category,
				isActive,
				order,
			},
			{ new: true }
		);

		if (!updatedFAQ) {
			return NextResponse.json(
				{
					success: false,
					message: "FAQ not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: updatedFAQ,
			message: "FAQ updated successfully",
		});
	} catch (error) {
		console.error("Error updating FAQ:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update FAQ",
			},
			{ status: 500 }
		);
	}
}

// DELETE /api/faq/[id] - Delete a FAQ
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();

		const { id } = await params;

		const deletedFAQ = await FAQ.findByIdAndUpdate(
			id,
			{ isActive: false },
			{ new: true }
		);

		if (!deletedFAQ) {
			return NextResponse.json(
				{
					success: false,
					message: "FAQ not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "FAQ deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting FAQ:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to delete FAQ",
			},
			{ status: 500 }
		);
	}
}
