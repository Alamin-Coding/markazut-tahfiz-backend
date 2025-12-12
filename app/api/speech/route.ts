import { NextRequest, NextResponse } from "next/server";
import Speech from "@/lib/models/Speech";
import dbConnect from "@/lib/db";

// GET /api/speech - Fetch speech section
export async function GET() {
  try {
    await dbConnect();
    const speech = await Speech.findOne();
    const response = NextResponse.json({
      success: true,
      data: speech || {},
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch speech" },
      { status: 500 }
    );
  }
}

// POST /api/speech - Update speech section
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log("Updating speech with data:", body);
    const speech = await Speech.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      strict: false // Allow new fields even if schema is stale
    });
    const response = NextResponse.json({
      success: true,
      data: speech,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update speech" },
      { status: 500 }
    );
  }
}
