import { NextRequest, NextResponse } from "next/server";
import Info from "@/lib/models/Info";
import dbConnect from "@/lib/db";

// GET /api/info - Fetch info section
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await dbConnect();
    const info = await Info.findOne();
    const response = NextResponse.json({
      success: true,
      data: info || {},
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch info" },
      { status: 500 }
    );
  }
}

// POST /api/info - Update info section
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const info = await Info.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });
    const response = NextResponse.json({
      success: true,
      data: info,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update info" },
      { status: 500 }
    );
  }
}
