import { NextRequest, NextResponse } from "next/server";
import AdmissionPage from "@/lib/models/AdmissionPage";
import dbConnect from "@/lib/db";

// GET /api/admission-page
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    let data = await AdmissionPage.findOne();

    if (!data) {
      // If no data exists, return default/empty structure or create one
      // For now, let's return null and let frontend handle default or create on first POST
      // But typically we want one singleton 
      // We can create one if not exists
      data = new AdmissionPage();
      // Don't save yet, just return default values from schema
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching admission page data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admission page data" },
      { status: 500 }
    );
  }
}

// POST /api/admission-page
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Use findOneAndUpdate with upsert option to ensuring only one document exists
    // We pass an empty filter {} to match the first document found (singleton pattern)
    // However, findOneAndUpdate without filter matches nothing if we don't have ID. 
    // Best practice for singleton settings: use a fixed ID or check count.
    
    // Simple approach: find one, if exists update, else create.
    let pageData = await AdmissionPage.findOne();

    if (pageData) {
      Object.assign(pageData, body);
      await pageData.save();
    } else {
      const newPage = new AdmissionPage(body);
      pageData = await newPage.save();
    }

    return NextResponse.json({
      success: true,
      message: "Admission page updated successfully",
      data: pageData,
    });
  } catch (error) {
    console.error("Error updating admission page data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update admission page data" },
      { status: 500 }
    );
  }
}
