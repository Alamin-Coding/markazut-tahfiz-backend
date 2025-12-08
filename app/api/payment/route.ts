import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/lib/models/Payment";
import Student from "@/lib/models/Student";

// GET /api/payment - list payments with filters
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const studentId = searchParams.get("studentId");
		const from = searchParams.get("from");
		const to = searchParams.get("to");

		const filter: Record<string, unknown> = { isActive: true };
		if (studentId) filter.student = studentId;
		if (from || to) {
			filter.paidAt = {};
			if (from) (filter.paidAt as Record<string, Date>).$gte = new Date(from);
			if (to) (filter.paidAt as Record<string, Date>).$lte = new Date(to);
		}

		const payments = await Payment.find(filter)
			.populate("student", "name class section guardianPhone")
			.sort({ paidAt: -1 });

		return NextResponse.json({ success: true, data: payments });
	} catch (error) {
		console.error("Error fetching payments:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch payments" },
			{ status: 500 }
		);
	}
}

// POST /api/payment - create payment
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { studentId, amount, paidAt, monthOf, method, reference, notes } =
			body;

		if (!studentId || amount === undefined || !monthOf) {
			return NextResponse.json(
				{
					success: false,
					message: "studentId, amount and monthOf are required",
				},
				{ status: 400 }
			);
		}

		const student = await Student.findById(studentId);
		if (!student || !student.isActive) {
			return NextResponse.json(
				{ success: false, message: "Student not found" },
				{ status: 404 }
			);
		}

		const payment = new Payment({
			student: studentId,
			amount,
			paidAt: paidAt ? new Date(paidAt) : undefined,
			monthOf,
			method,
			reference,
			notes,
		});

		await payment.save();

		return NextResponse.json({
			success: true,
			data: payment,
			message: "Payment recorded successfully",
		});
	} catch (error) {
		console.error("Error creating payment:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create payment" },
			{ status: 500 }
		);
	}
}

