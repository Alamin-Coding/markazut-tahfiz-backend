import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/lib/models/Testimonial";
import dbConnect from "@/lib/db";

// GET /api/testimonials - Fetch all testimonials
export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true }).sort({
      createdAt: -1,
    });
    const response = NextResponse.json({
      success: true,
      data: testimonials,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
    const response = NextResponse.json({
      success: true,
      data: testimonial,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
