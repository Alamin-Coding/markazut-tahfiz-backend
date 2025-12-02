import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	console.log("Middleware:", request.nextUrl.pathname, "token:", !!token);

	if (request.nextUrl.pathname.startsWith("/dashboard")) {
		if (!token) {
			console.log("No token, redirect to /");
			return NextResponse.redirect(new URL("/", request.url));
		}

		try {
			jwt.verify(token, process.env.JWT_SECRET!);
			console.log("Token valid");
		} catch (err) {
			console.log("Token invalid:", err);
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	// If logged in and trying to access login page, redirect to dashboard
	if (request.nextUrl.pathname === "/" && token) {
		try {
			jwt.verify(token, process.env.JWT_SECRET!);
			console.log("Logged in, redirect to /dashboard");
			return NextResponse.redirect(new URL("/dashboard", request.url));
		} catch (err) {
			console.log("Token invalid on /");
			// Invalid token, continue to login
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/dashboard/:path*"],
};
