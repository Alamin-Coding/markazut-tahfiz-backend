import { NextRequest, NextResponse } from "next/server";
import DepartmentPage from "@/lib/models/DepartmentPage";
import dbConnect from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15 params is a promise
) {
  try {
    await dbConnect();
    const pageData = await DepartmentPage.findOne();
    
    if (!pageData || !pageData.departments) {
       return NextResponse.json({ success: false, message: "No data found" }, { status: 404 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    // Departments are 1-indexed in the URL strategy we adopted
    if (isNaN(id) || id < 1 || id > pageData.departments.length) {
         return NextResponse.json({ success: false, message: "Department not found" }, { status: 404 });
    }

    const department = pageData.departments[id - 1];

    return NextResponse.json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Error fetching department details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch department" },
      { status: 500 }
    );
  }
}
