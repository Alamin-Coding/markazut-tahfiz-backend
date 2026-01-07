import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { verifyAuth } from "@/lib/auth";

// DELETE /api/users/[id] - Delete a user (Auth required)
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const auth = await verifyAuth(request);
	if (!auth) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		);
	}

	const { id } = await params;

	// Prevent deleting yourself
	if (auth.userId === id) {
		return NextResponse.json(
			{ success: false, message: "You cannot delete your own account" },
			{ status: 400 }
		);
	}

	try {
		await dbConnect();

		// Ensure at least one admin remains
		const count = await User.countDocuments({});
		if (count <= 1) {
			return NextResponse.json(
				{ success: false, message: "At least one admin account must remain" },
				{ status: 400 }
			);
		}

		const deletedUser = await User.findByIdAndDelete(id);

		if (!deletedUser) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete user" },
			{ status: 500 }
		);
	}
}
