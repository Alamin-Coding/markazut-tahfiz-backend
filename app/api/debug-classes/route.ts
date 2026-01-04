import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClassConfig from "@/lib/models/ClassConfig";

export const dynamic = "force-dynamic";

export async function GET() {
	await dbConnect();
	const configs = await ClassConfig.find({});
	return NextResponse.json({
		count: configs.length,
		departments: configs.map((c) => c.department),
	});
}
