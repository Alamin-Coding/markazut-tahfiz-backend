import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import About from "@/lib/models/About";

export async function GET() {
  try {
    await dbConnect();
    
    // Get all about documents
    const abouts = await About.find({});
    
    return NextResponse.json({
      success: true,
      count: abouts.length,
      data: abouts,
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Test POST - create a sample about document
export async function POST() {
  try {
    await dbConnect();
    
    const testData = {
      title: "Test Title",
      description: "Test Description",
      image1: "https://via.placeholder.com/300/FF0000/FFFFFF?text=Image+1",
      image2: "https://via.placeholder.com/300/00FF00/FFFFFF?text=Image+2",
      image3: "https://via.placeholder.com/300/0000FF/FFFFFF?text=Image+3",
      image4: "https://via.placeholder.com/300/FFFF00/000000?text=Image+4",
    };
    
    const about = await About.findOneAndUpdate({}, testData, {
      new: true,
      upsert: true,
    });
    
    return NextResponse.json({
      success: true,
      message: "Test data created",
      data: about,
    });
  } catch (error) {
    console.error("Test POST error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
