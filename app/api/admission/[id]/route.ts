import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admission from "@/lib/models/Admission";

// PUT /api/admission/[id] - update status/details
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const body = await request.json();

		const updated = await Admission.findByIdAndUpdate(id, body, { new: true });
		if (!updated) {
			return NextResponse.json(
				{ success: false, message: "Application not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: updated,
			message: "Application updated",
		});
	} catch (error) {
		console.error("Error updating admission:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update admission" },
			{ status: 500 }
		);
	}
}

// DELETE /api/admission/[id] - soft delete
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const deleted = await Admission.findByIdAndUpdate(
			id,
			{ isActive: false },
			{ new: true }
		);
		if (!deleted) {
			return NextResponse.json(
				{ success: false, message: "Application not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({
			success: true,
			message: "Application deleted",
		});
	} catch (error) {
		console.error("Error deleting admission:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete admission" },
			{ status: 500 }
		);
	}
}

