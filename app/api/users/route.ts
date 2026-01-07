import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { verifyAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/users - List all users (Auth required)
export async function GET(request: NextRequest) {
	const auth = await verifyAuth(request);
	if (!auth) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		await dbConnect();
		const users = await User.find({})
			.select("-password")
			.sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: users });
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}

// POST /api/users - Create a new user (Auth required)
export async function POST(request: NextRequest) {
	const auth = await verifyAuth(request);
	if (!auth) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		await dbConnect();
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ success: false, message: "Email and password are required" },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return NextResponse.json(
				{ success: false, message: "User with this email already exists" },
				{ status: 400 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			email: email.toLowerCase(),
			password: hashedPassword,
		});

		await user.save();

		return NextResponse.json({
			success: true,
			message: "User created successfully",
			data: { _id: user._id, email: user.email },
		});
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create user" },
			{ status: 500 }
		);
	}
}
