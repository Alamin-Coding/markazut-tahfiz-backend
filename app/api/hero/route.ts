import { NextRequest, NextResponse } from "next/server";
import Hero from "@/lib/models/Hero";
import dbConnect from "@/lib/db";

// GET /api/hero - Fetch hero section
export async function GET() {
  try {
    await dbConnect();
    const hero = await Hero.findOne();
    const response = NextResponse.json({
      success: true,
      data: hero || {},
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch hero" },
      { status: 500 }
    );
  }
}

// POST /api/hero - Update hero section
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const hero = await Hero.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });
    const response = NextResponse.json({
      success: true,
      data: hero,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update hero" },
      { status: 500 }
    );
  }
}
