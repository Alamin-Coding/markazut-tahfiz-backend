import { useState } from "react";
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
  const [hasError, setHasError] = useState(false);

  // Sync preview with incoming value if it changes externally
  if (value && value !== preview) {
    setPreview(value);
    setHasError(false); // Reset error on new value
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setHasError(false);
    try {
      const result = await uploadToCloudinary(file, folder);
      const imageUrl = result.secure_url;
      setPreview(imageUrl);
      onChange(imageUrl);
      toast.success("✅ ছবি সফলভাবে আপলোড হয়েছে!");
    } catch (error: any) {
      toast.error(`❌ ছবি আপলোড ব্যর্থ হয়েছে: ${error.message || "অজানা সমস্যা"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
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
          <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Preview:</p>
            {!hasError ? (
              <img
                src={preview}
                alt="Uploaded preview"
                className="max-w-full h-32 object-cover rounded border bg-white"
                onError={() => setHasError(true)}
              />
            ) : (
              <div className="h-32 w-full bg-red-50 border border-red-200 rounded flex flex-col items-center justify-center text-red-600 p-4 text-center">
                <span className="text-2xl mb-1">⚠️</span>
                <span className="text-sm font-medium">ছবি পাওয়া যায়নি</span>
                <span className="text-xs opacity-75">Cloudinary থেকে মুছে ফেলা হয়েছে?</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 break-all">
              URL: {preview}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
