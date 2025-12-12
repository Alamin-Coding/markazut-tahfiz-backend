import { NextRequest, NextResponse } from "next/server";
import DepartmentPage from "@/lib/models/DepartmentPage";
import dbConnect from "@/lib/db";

// GET /api/departments - Fetch departments page data
export async function GET() {
  try {
    await dbConnect();
    const data = await DepartmentPage.findOne();
    const response = NextResponse.json({
      success: true,
      data: data || {},
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching department page data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// POST /api/departments - Update departments page data
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log("Updating department page with data:", body);
    
    // Use strict: false to allow flexibility during dev
    const data = await DepartmentPage.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      strict: false, 
    });
    
    const response = NextResponse.json({
      success: true,
      data: data,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error updating department page data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update data" },
      { status: 500 }
    );
  }
}
