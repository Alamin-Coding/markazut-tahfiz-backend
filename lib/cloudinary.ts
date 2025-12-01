import {
	v2 as cloudinary,
	UploadApiResponse,
	UploadApiOptions,
} from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "your-cloud-name",
	api_key: process.env.CLOUDINARY_API_KEY || "your-api-key",
	api_secret: process.env.CLOUDINARY_API_SECRET || "your-api-secret",
});

export interface CloudinaryUploadResult extends UploadApiResponse {
	public_id: string;
	secure_url: string;
	url: string;
	format: string;
	width: number;
	height: number;
	bytes: number;
	created_at: string;
}

/**
 * Upload image to Cloudinary
 * @param file - The file to upload (base64 string)
 * @param folder - Folder name in Cloudinary
 * @param publicId - Optional public ID for the image
 * @returns Promise<CloudinaryUploadResult>
 */
export const uploadImage = async (
	file: string,
	folder: string = "markazut-tahfiz",
	publicId?: string
): Promise<CloudinaryUploadResult> => {
	try {
		const uploadOptions: UploadApiOptions = {
			folder,
			resource_type: "auto",
			quality: "auto",
			format: "auto",
		};

		if (publicId) {
			uploadOptions.public_id = publicId;
		}

		const result = await cloudinary.uploader.upload(file, uploadOptions);
		return result as CloudinaryUploadResult;
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		throw new Error("Failed to upload image to Cloudinary");
	}
};

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @returns Promise
 */
export const deleteImage = async (
	publicId: string
): Promise<UploadApiResponse> => {
	try {
		const result = await cloudinary.uploader.destroy(publicId);
		return result;
	} catch (error) {
		console.error("Cloudinary delete error:", error);
		throw new Error("Failed to delete image from Cloudinary");
	}
};

/**
 * Get optimized image URL
 * @param publicId - Public ID of the image
 * @param options - Transformation options
 * @returns string
 */
export const getOptimizedImageUrl = (
	publicId: string,
	options: {
		width?: number;
		height?: number;
		quality?: number | string;
		format?: string;
	} = {}
): string => {
	const { width, height, quality = "auto", format = "auto" } = options;

	let transformation = `f_${format},q_${quality}`;

	if (width) transformation += `,w_${width}`;
	if (height) transformation += `,h_${height}`;

	return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of files to upload
 * @param folder - Folder name in Cloudinary
 * @returns Promise<CloudinaryUploadResult[]>
 */
export const uploadMultipleImages = async (
	files: string[],
	folder: string = "markazut-tahfiz"
): Promise<CloudinaryUploadResult[]> => {
	try {
		const uploadPromises = files.map((file) => uploadImage(file, folder));
		const results = await Promise.all(uploadPromises);
		return results;
	} catch (error) {
		console.error("Multiple upload error:", error);
		throw new Error("Failed to upload multiple images to Cloudinary");
	}
};

export default cloudinary;
