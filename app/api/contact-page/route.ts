import { NextRequest, NextResponse } from "next/server";
import ContactPage from "@/lib/models/ContactPage";
import dbConnect from "@/lib/db";

// GET /api/contact-page
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    let data = await ContactPage.findOne();

    if (!data) {
      data = new ContactPage();
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact page data" },
      { status: 500 }
    );
  }
}

// POST /api/contact-page
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    let pageData = await ContactPage.findOne();

    if (pageData) {
      Object.assign(pageData, body);
      await pageData.save();
    } else {
      const newPage = new ContactPage(body);
      pageData = await newPage.save();
    }

    return NextResponse.json({
      success: true,
      message: "Contact page updated successfully",
      data: pageData,
    });
  } catch (error) {
    console.error("Error updating contact page data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update contact page data" },
      { status: 500 }
    );
  }
}
