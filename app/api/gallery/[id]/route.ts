import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/lib/models/Gallery";
import dbConnect from "@/lib/db";

// DELETE /api/gallery/[id] - Delete a gallery image
export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id } = params;
    
    const deletedImage = await Gallery.findByIdAndDelete(id);
    
    if (!deletedImage) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }
    
    const response = NextResponse.json({
      success: true,
      message: "Image deleted successfully",
      data: deletedImage,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete image" },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id] - Update a gallery image
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    
    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedImage) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }
    
    const response = NextResponse.json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update image" },
      { status: 500 }
    );
  }
}
