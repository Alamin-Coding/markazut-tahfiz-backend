import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function verifyAuth(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	if (!token) return null;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
			email: string;
		};
		return decoded;
	} catch (error) {
		return null;
	}
}
