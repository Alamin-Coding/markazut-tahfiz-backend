import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admission from "@/lib/models/Admission";
import Notification from "@/lib/models/Notification";

// GET /api/admission - list applications
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");

		const filter: Record<string, unknown> = { isActive: true };
		if (status) filter.status = status;

		const applications = await Admission.find(filter).sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: applications });
	} catch (error) {
		console.error("Error fetching admissions:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch admissions" },
			{ status: 500 }
		);
	}
}

// POST /api/admission - submit application (public)
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const {
			nameBangla,
			nameEnglish,
			fatherName,
			motherName,
			presentAddress,
			permanentAddress,
			exMadrasa,
			lastClass,
			admissionClass,
			admissionDepartment,
			guardianName,
			guardianPhone,
			guardianRelation,
			photo,
			notes,
		} = body;

		if (
			!nameBangla ||
			!nameEnglish ||
			!fatherName ||
			!motherName ||
			!admissionClass ||
			!admissionDepartment ||
			!guardianName ||
			!guardianPhone
		) {
			return NextResponse.json(
				{
					success: false,
					message: "Required fields are missing",
				},
				{ status: 400 }
			);
		}

		const application = new Admission({
			nameBangla,
			nameEnglish,
			fatherName,
			motherName,
			presentAddress,
			permanentAddress,
			exMadrasa,
			lastClass,
			admissionClass,
			admissionDepartment,
			guardianName,
			guardianPhone,
			guardianRelation,
			photo,
			notes,
		});
		await application.save();

		// Create a dashboard notification
		const notification = new Notification({
			type: "alert",
			title: "নতুন ভর্তি আবেদন",
			message: `${nameBangla} ${admissionClass} শ্রেণীতে ভর্তির জন্য আবেদন করেছে`,
			payload: { applicationId: application._id },
			status: "pending",
		});
		await notification.save();

		return NextResponse.json({
			success: true,
			data: application,
			message: "Application submitted",
		});
	} catch (error) {
		console.error("Error submitting admission:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to submit admission" },
			{ status: 500 }
		);
	}
}
