import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			// Don't reveal if user exists or not
			return NextResponse.json({
				message: "If the email exists, a reset link has been sent.",
			});
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		user.resetToken = resetToken;
		user.resetTokenExpiry = resetTokenExpiry;
		await user.save();

		// Send email
		const transporter = nodemailer.createTransporter({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: email,
			subject: "Password Reset Request",
			html: `
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
		};

		await transporter.sendMail(mailOptions);

		return NextResponse.json({
			message: "If the email exists, a reset link has been sent.",
		});
	} catch (error) {
		console.error("Forgot password error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
