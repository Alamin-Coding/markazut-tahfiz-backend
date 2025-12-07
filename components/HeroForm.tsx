// Hero Section Form
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
	inputClasses,
	labelClasses,
	selectClasses,
} from "@/app/(dashboard)/dashboard/page";
import { CloudinaryImageUpload } from "@/app/(dashboard)/dashboard/components/CloudinaryImageUpload";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
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
				<div className="space-y-6">
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
				</div>

				<div>
					<div>
						<h3 className="text-md font-medium text-green-500 mb-4">স্টেপস</h3>
						{[1, 2, 3, 4].map((step) => (
							<div key={step} className="mb-4 p-4 border rounded-md">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>টাইটেল</Label>
										<Input
											type="text"
											defaultValue={
												step === 1
													? "আধুনিক ক্যাম্পাস"
													: step === 2
													? "অভিজ্ঞ ওস্তাদ"
													: step === 3
													? "দক্ষ ব্যবস্থাপনা"
													: "আধুনিক পাঠ্যক্রম"
											}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<CloudinaryImageUpload
											label="আইকন"
											folder="markazut-tahfiz/hero"
											onChange={(url: string) =>
												console.log("Hero image uploaded:", url)
											}
											uploadToCloudinary={uploadToCloudinary}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* আমাদের সেবা */}
				<div className="space-y-4">
					<h3 className="text-md font-medium text-green-500 mb-4">
						আমাদের সেবা
					</h3>
					<div className="space-y-2">
						<Label>শিরোনাম</Label>
						<Input
							type="text"
							defaultValue="আমাদের প্রতিষ্ঠান আপনার সন্তানের হিফজ শিক্ষাগত মান ও জ্ঞান বিকাশে প্রতিশ্রুতিবদ্ধ"
						/>
					</div>
					<div className="space-y-2">
						<Label>মূল কনটেন্ট</Label>
						<Textarea
							rows={4}
							defaultValue="সারকাউন্ট্রি তারফিজ ঈসলামনামাল রাম্মা আমাদের সুলালে হিফজ শিক্ষার মানোয়ান ও জ্ঞান বিকাশে সবন্ধতর্পক। আমরা কুরআন শিক্ষা ও মুখ করানোর নয়, বরং দক্ষতা প্রদান করি আমরা ও আমাদেরকে উন্নয়নের জন্য প্রতেক দেওয়া দেওয়া হবি আমাদের সেবন একটি সফা তৈরি তৈরি ব্যাধান বিষয়ে গেড় উত্তর, উন্নয়ায়উল।"
						/>
					</div>

					{/* Images */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>ইমেজ ১</Label>
							<Input type="file" accept="image/*" />
						</div>
						<div className="space-y-2">
							<Label>ইমেজ ২</Label>
							<Input type="file" accept="image/*" />
						</div>
						<div className="space-y-2">
							<Label>ইমেজ ৩</Label>
							<Input type="file" accept="image/*" />
						</div>
						<div className="space-y-2">
							<Label>ইমেজ ৪</Label>
							<Input type="file" accept="image/*" />
						</div>
					</div>

					{/* Phone */}
					<div className="space-y-2">
						<Label>ফোন নাম্বার</Label>
						<Input type="text" defaultValue="+8801712-054763" />
					</div>
				</div>

				{/* Counter */}
				<div className="space-y-4">
					<h3 className="text-md font-medium text-green-500">কাউন্টার</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[...Array(4)].map((_, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<CloudinaryImageUpload
									label="কাউন্টার আইকন"
									folder="markazut-tahfiz/icons"
									onChange={(url: string) =>
										console.log("Conter icon uploaded:", url)
									}
									uploadToCloudinary={uploadToCloudinary}
								/>
								<div className="space-y-2">
									<Label className={labelClasses}>লেবেল</Label>
									<Input
										type="text"
										defaultValue={
											[
												"অভিজ্ঞ শিক্ষক",
												"শিক্ষার্থী",
												"বিভাগ",
												"বছরের অভিজ্ঞতা",
											][idx]
										}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>সংখ্যা</Label>
									<Input
										type="text"
										defaultValue={["৫০+", "১০০০+", "৬+", "২৫+"][idx]}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-6">
					<h3 className="text-md font-medium text-green-500">
						প্রতিষ্ঠাতার বাণী সম্পাদনা
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label>নাম</Label>
							<Input type="text" defaultValue="শায়েখ নেজার আহমেদ আন নাহিরী" />
						</div>
						<div className="space-y-2">
							<Label>পদবী</Label>
							<Input type="text" defaultValue="প্রতিষ্ঠাতা পরিচালক" />
						</div>
					</div>

					<div className="space-y-2">
						<Label>সাবটাইটেল</Label>
						<Input
							type="text"
							defaultValue="মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসা"
						/>
					</div>

					<div className="space-y-2">
						<Label>আরবি টেক্সট</Label>
						<Input type="text" defaultValue="بسم الله الرحمن الرحيم" />
					</div>

					<div className="space-y-2">
						<Label>গ্রিটিং</Label>
						<Input type="text" defaultValue="আলাহামদুলিল্লাহ" />
					</div>

					<div className="space-y-2">
						<Label>বাণী টেক্সট (প্যারাগ্রাফ ১)</Label>
						<Textarea
							rows={3}
							defaultValue="মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসা প্রতিষ্ঠার মাধ্যে আমরা এমন উদ্দেশ্য নিয়ে কাজ করছি..."
						/>
					</div>

					<div className="space-y-2">
						<Label>বাণী টেক্সট (প্যারাগ্রাফ ২)</Label>
						<Textarea
							rows={3}
							defaultValue="আমাদের লক্ষ্য হলো কেমন পরিবর্তনশীল প্রজেক্ট ও চ্যারিটিক সুবায়ারের উপজন সৃষ্টি গড়ে তোলা..."
						/>
					</div>

					<div className="space-y-2">
						<Label>বাণী টেক্সট (প্যারাগ্রাফ ৩)</Label>
						<Textarea
							rows={3}
							defaultValue="দোয়া ও সহযোগিতা কামনা করি, যেন আল্লাহ আমাদের এই মহৎ উদ্দেশ্য বাস্তবায়নের তারিফে দান করেন।"
						/>
					</div>

					<div className="space-y-2">
						<Label>রেটিং</Label>
						<Input type="number" defaultValue="99" />
					</div>

					<div className="space-y-2">
						<Label>প্রোফাইল ইমেজ</Label>
						<Input type="file" accept="image/*" />
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
};

export default HeroForm;
