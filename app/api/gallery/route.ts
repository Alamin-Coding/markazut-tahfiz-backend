import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/lib/models/Gallery";
import dbConnect from "@/lib/db";

// GET /api/gallery - Fetch all gallery images
export async function GET() {
  try {
    await dbConnect();
    const images = await Gallery.find().sort({ createdAt: -1 });
    const response = NextResponse.json({
      success: true,
      data: images,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

// POST /api/gallery - Add new image
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const galleryRecord = await Gallery.create(body);
    const response = NextResponse.json({
      success: true,
      data: galleryRecord,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add image" },
      { status: 500 }
    );
  }
}
