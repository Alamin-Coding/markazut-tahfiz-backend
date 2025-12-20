import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadMultipleImages } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const files = formData.getAll("files") as File[];
		const folder = (formData.get("folder") as string) || "markazut-tahfiz";

		if (!files || files.length === 0) {
			return NextResponse.json({ error: "No files provided" }, { status: 400 });
		}

		// Check for Cloudinary credentials
		if (
			!process.env.CLOUDINARY_CLOUD_NAME ||
			!process.env.CLOUDINARY_API_KEY ||
			!process.env.CLOUDINARY_API_SECRET
		) {
			return NextResponse.json(
				{
					error:
						"Cloudinary credentials are not configured in the backend .env file.",
				},
				{ status: 500 }
			);
		}

		// Convert files to base64 strings
		const filePromises = files.map(async (file) => {
			console.log(
				`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`
			);
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);
			const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
			console.log(`Base64 prepared, length: ${base64.length}`);
			return base64;
		});

		const base64Files = await Promise.all(filePromises);
		console.log(`Total files to upload: ${base64Files.length}`);

		// Upload to Cloudinary
		let results;
		if (base64Files.length === 1) {
			results = [await uploadImage(base64Files[0], folder)];
		} else {
			results = await uploadMultipleImages(base64Files, folder);
		}

		return NextResponse.json({
			success: true,
			data: results,
			message: `${results.length} image(s) uploaded successfully`,
		});
	} catch (error: any) {
		console.error("Upload API error:", error);

		let errorMessage = "Unknown error";
		if (error instanceof Error) {
			errorMessage = error.message;
		} else if (typeof error === "string") {
			errorMessage = error;
		} else if (error && typeof error === "object") {
			errorMessage = error.message || JSON.stringify(error);
		}

		return NextResponse.json(
			{
				error: "Failed to upload images",
				details: errorMessage,
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const publicId = searchParams.get("publicId");

		if (!publicId) {
			return NextResponse.json(
				{ error: "Public ID is required" },
				{ status: 400 }
			);
		}

		const { deleteImage } = await import("@/lib/cloudinary");
		await deleteImage(publicId);

		return NextResponse.json({
			success: true,
			message: "Image deleted successfully",
		});
	} catch (error) {
		console.error("Delete API error:", error);
		return NextResponse.json(
			{
				error: "Failed to delete image",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
