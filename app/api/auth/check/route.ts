import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("token")?.value;

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
			email: string;
		};

		if (!decoded) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		await dbConnect();
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		return NextResponse.json({ user });
	} catch (error) {
		console.error("Auth check error:", error);
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
