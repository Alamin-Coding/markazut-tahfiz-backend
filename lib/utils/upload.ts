export const uploadToCloudinary = async (file: File, folder?: string) => {
	try {
		const formData = new FormData();
		formData.append("files", file);
		formData.append("folder", folder || "markazut-tahfiz-images");

		const response = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		const result = await response.json();

		if (!response.ok) {
			const errorMessage = result.details
				? `${result.error}: ${result.details}`
				: result.error || "Upload failed";
			throw new Error(errorMessage);
		}

		return result.data[0]; // Return the first uploaded image data
	} catch (error) {
		console.error("Upload error:", error);
		throw error;
	}
};
