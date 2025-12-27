"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CloudinaryImageUploadProps {
	label: string;
	value?: string;
	onChange: (url: string) => void;
	folder?: string;
	className?: string;
	uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}

export function CloudinaryImageUpload({
	label,
	value,
	onChange,
	folder = "markazut-tahfiz",
	className = "",
	uploadToCloudinary,
}: CloudinaryImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(value || null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const result = await uploadToCloudinary(file, folder);
			const imageUrl = result.secure_url;
			setPreview(imageUrl);
			onChange(imageUrl);
			toast.success("ছবি সফলভাবে আপলোড হয়েছে");
		} catch (error) {
			toast.error("ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className={`space-y-2 ${className}`}>
			<Label className="text-gray-700 dark:text-gray-300 font-medium">
				{label}
			</Label>
			<div className="space-y-3">
				<Input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					disabled={uploading}
					className={uploading ? "opacity-50" : ""}
				/>
				{uploading && (
					<div className="text-sm text-blue-600 flex items-center">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
						Uploading to Cloudinary...
					</div>
				)}
				{preview && (
					<div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
							Preview:
						</p>
						<img
							src={preview}
							alt="Uploaded preview"
							className="max-w-full h-32 object-cover rounded border"
						/>
						<p className="text-xs text-gray-500 mt-2 break-all">
							URL: {preview}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
