import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubjectConfig from "@/lib/models/SubjectConfig";

// GET /api/subject-config
// Fetch all subject configs or a specific one by department and class
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const department = searchParams.get("department");
		const cls = searchParams.get("class");

		const filter: any = {};
		if (department) filter.department = department;
		if (cls) filter.class = cls;

		const configs = await SubjectConfig.find(filter).sort({
			department: 1,
			class: 1,
		});

		return NextResponse.json({ success: true, data: configs });
	} catch (error: any) {
		console.error("Error fetching subject config:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 },
		);
	}
}

// POST /api/subject-config
// Create or update a subject config
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const { id, department, class: cls, subjects } = body;

		if (!department || !cls || !subjects) {
			return NextResponse.json(
				{ success: false, message: "Department, class and subjects are required" },
				{ status: 400 },
			);
		}

		// Ensure subjects have numeric marks (defaults to 100)
		const formattedSubjects = subjects.map((s: any) => ({
			name: s.name.trim(),
			total: Number(s.total) || 100,
		}));

		let savedConfig;
		if (id) {
			savedConfig = await SubjectConfig.findByIdAndUpdate(
				id,
				{ department, class: cls, subjects: formattedSubjects },
				{ new: true, runValidators: true },
			);
		} else {
			// Check if exists
			const existing = await SubjectConfig.findOne({ department, class: cls });
			if (existing) {
				return NextResponse.json(
					{
						success: false,
						message: "এই বিভাগ এবং শ্রেণীর জন্য বিষয় তালিকা ইতিমধ্যে তৈরি করা হয়েছে",
					},
					{ status: 400 },
				);
			}

			savedConfig = await SubjectConfig.create({
				department,
				class: cls,
				subjects: formattedSubjects,
			});
		}

		return NextResponse.json({ success: true, data: savedConfig });
	} catch (error: any) {
		console.error("Error saving subject config:", error);
		
		// Handle MongoDB duplicate key error explicitly
		if (error.code === 11000) {
			return NextResponse.json(
				{
					success: false,
					message: "এই বিভাগ এবং শ্রেণীর জন্য বিষয় তালিকা ইতিমধ্যে তৈরি করা হয়েছে",
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ success: false, message: "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন" },
			{ status: 500 },
		);
	}
}

// DELETE /api/subject-config
export async function DELETE(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		if (!id) {
			return NextResponse.json(
				{ success: false, message: "ID is required" },
				{ status: 400 },
			);
		}

		await SubjectConfig.findByIdAndDelete(id);
		return NextResponse.json({
			success: true,
			message: "ডিলিট করা হয়েছে",
		});
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 },
		);
	}
}
