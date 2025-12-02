import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const { token, password } = await request.json();

		if (!token || !password) {
			return NextResponse.json(
				{ error: "Token and password are required" },
				{ status: 400 }
			);
		}

		const user = await User.findOne({
			resetToken: token,
			resetTokenExpiry: { $gt: new Date() },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 400 }
			);
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(password, 12);

		user.password = hashedPassword;
		user.resetToken = null;
		user.resetTokenExpiry = null;
		await user.save();

		return NextResponse.json({ message: "Password reset successfully" });
	} catch (error) {
		console.error("Reset password error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
