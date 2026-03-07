import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/lib/models/Payment";

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await dbConnect();
		const body = await request.json();
		const { id } = params;

		const updatedPayment = await Payment.findByIdAndUpdate(
			id,
			{ $set: body },
			{ new: true, runValidators: true },
		);

		if (!updatedPayment) {
			return NextResponse.json(
				{ success: false, message: "Payment not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: updatedPayment,
			message: "Payment updated successfully",
		});
	} catch (error: any) {
		console.error("Error updating payment:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update payment: " + error.message },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await dbConnect();
		const { id } = params;

		const deletedPayment = await Payment.findByIdAndDelete(id);

		if (!deletedPayment) {
			return NextResponse.json(
				{ success: false, message: "Payment not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Payment deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting payment:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete payment: " + error.message },
			{ status: 500 },
		);
	}
}
