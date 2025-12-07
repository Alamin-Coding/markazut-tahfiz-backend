// Hero Section Form
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { inputClasses, labelClasses } from "@/app/(dashboard)/dashboard/page";
import { CloudinaryImageUpload } from "@/app/(dashboard)/dashboard/components/CloudinaryImageUpload";
const HeroForm = ({
	uploadToCloudinary,
}: {
	uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				হিরো সেকশন সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="hero-title" className={labelClasses}>
						শিরোনাম
					</Label>
					<Input
						id="hero-title"
						type="text"
						defaultValue="আন্তর্জাতিক হিফজ শিক্ষা প্রতিষ্ঠান এখন আপনার হাতের কাছে!"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="hero-description" className={labelClasses}>
						বর্ণনা
					</Label>
					<Textarea
						id="hero-description"
						rows={4}
						defaultValue="মারকাজুত তাহফিজ ইন্টারন্যাশনাল মাদ্রাসা বিশ্বের অন্যতম শীর্ষস্থানীয় হিফজুল কুরআন প্রতিষ্ঠান..."
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="hero-button" className={labelClasses}>
						বাটন টেক্সট
					</Label>
					<Input
						id="hero-button"
						type="text"
						defaultValue="আমাদের সম্পর্কে"
						className={inputClasses}
					/>
				</div>

				<CloudinaryImageUpload
					label="ব্যাকগ্রাউন্ড ইমেজ"
					folder="markazut-tahfiz/hero"
					onChange={(url: string) => console.log("Hero image uploaded:", url)}
					uploadToCloudinary={uploadToCloudinary}
				/>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
};

export default HeroForm;
