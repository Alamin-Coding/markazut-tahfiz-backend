import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Generate JWT
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			process.env.JWT_SECRET!,
			{ expiresIn: "7d" }
		);

		const response = NextResponse.json({ message: "Login successful" });

		// Set cookie
		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Enable secure in production
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});

		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
