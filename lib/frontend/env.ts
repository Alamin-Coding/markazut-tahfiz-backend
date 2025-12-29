export const env = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
	cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
	isDevelopment: process.env.NODE_ENV === "development",
	isProduction: process.env.NODE_ENV === "production",
	mode: process.env.NODE_ENV,
} as const;
