import { NextResponse } from "next/server";

export async function POST() {
	const response = NextResponse.json({ message: "Logged out successfully" });

	response.cookies.set("token", "", {
		httpOnly: true,
		secure: false, // For localhost
		sameSite: "lax",
		maxAge: 0, // Expire immediately
	});

	return response;
}
