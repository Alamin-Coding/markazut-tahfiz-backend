import { NextRequest, NextResponse } from "next/server";
import Testimonial from "@/lib/models/Testimonial";
import dbConnect from "@/lib/db";

export const dynamic = "force-dynamic";

// DELETE /api/testimonials/[id] - Delete a testimonial
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id } = params;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
      data: deletedTestimonial,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id] - Update a testimonial
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}
