"use client";

import { useState } from "react";
import { inputClasses, labelClasses, selectClasses } from "@/app/(dashboard)/dashboard/page";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CloudinaryImageUpload } from "./CloudinaryImageUpload";
import image from "next/image";


// About Page Hero Form
function AboutHeroForm() {
	return (
		<div>
			<h2 className="text-lg font-semibold text-gray-900 mb-6">
				আমাদের সম্পর্কে পেজ - হিরো ব্যানার সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-2">
					<Label>শিরোনাম</Label>
					<Input type="text" defaultValue="আমাদের সম্পর্কে" />
				</div>

				<div className="space-y-2">
					<Label>সাবটাইটেল</Label>
					<Input
						type="text"
						defaultValue="মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসার ইতিহাস ও মিশন"
					/>
				</div>

				<div className="space-y-2">
					<Label>ব্যাকগ্রাউন্ড Image</Label>
					<Input type="file" />
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// মিশন ও ভিশন - প্রতিষ্ঠানের ইতিহাস
function AboutContentForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				আমাদের মিশন ও ভিশন - প্রতিষ্ঠানের ইতিহাস
			</h2>
			<form className="space-y-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div>
							আমাদের মিশন ও ভিশন
						<h3 className="text-md font-medium mb-2">
						</h3>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>মিশন টাইটেল</Label>
								<Input type="text" defaultValue="মিশন:" />
							</div>
							<div className="space-y-2">
								<Label>মিশন কনটেন্ট</Label>
								<Textarea
									rows={3}
									defaultValue="ইসলামী শিক্ষার মাধ্যমে দেশের যুব সমাজকে সুশিক্ষিত, চরিত্রবান এবং আদর্শ মানুষ হিসেবে গড়ে তোলা যারা সমাজে শান্তি, ন্যায়বিচার এবং সমৃদ্ধি আনতে পারে।"
								/>
							</div>
							<div className="space-y-2">
								<Label>ভিশন টাইটেল</Label>
								<Input type="text" defaultValue="ভিশন:" />
							</div>
							<div className="space-y-2">
								<Label>ভিশন কনটেন্ট</Label>
								<Textarea
									rows={3}
									defaultValue="একটি বিশ্বমানের শিক্ষা প্রতিষ্ঠান হিসেবে গড়ে তোলা যেখানে শিক্ষার্থীরা আধুনিক জ্ঞান এবং ইসলামী মূল্যবোধের সমন্বয়ে গঠিত হয়।"
								/>
							</div>
						</div>
					</div>
					<div>
						<div className="space-y-2">
							<h2 className="text-md font-medium mb-2">প্রতিষ্ঠানের ইতিহাস</h2>
							<div className="space-y-2">
								<Label>Paragraph 1</Label>
								<Textarea rows={3} defaultValue="মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসা" />
							</div>
							<div className="space-y-2">
								<Label>Paragraph 2</Label>
								<Textarea rows={3} defaultValue="দীর্ঘ প্রচেষ্টা এবং নিষ্ঠার মাধ্যমে আজ এটি একটি সুপ্রতিষ্ঠিত শিক্ষা প্রতিষ্ঠানে পরিণত হয়েছে।" />
							</div>
							<div className="space-y-2">
								<Label>Paragraph 3</Label>
								<Input type="text" defaultValue="আমরা নূরানী থেকে শুরু করে আলিম পর্যন্ত সম্পূর্ণ শিক্ষা কার্যক্রম পরিচালনা করছি।" />
							</div>
						</div>
					</div>
				</div>
				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// আমাদের বৈশিষ্ট্য
function AboutFeaturesForm({ uploadToCloudinary }: { uploadToCloudinary: (file: File, folder?: string) => Promise<any> }) {
	const [featureImages, setFeatureImages] = useState<string[]>(Array(6).fill(""));

	const handleImageChange = (index: number, url: string) => {
		const newImages = [...featureImages];
		newImages[index] = url;
		setFeatureImages(newImages);
	};

	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				আমাদের বৈশিষ্ট্য
			</h2>
			<form className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[1, 2, 3, 4, 5, 6].map((feature, index) => (
						<div key={feature} className="p-4 border rounded-md space-y-4">
								<div className="space-y-2">
									<Label className={labelClasses}>আইকন / svg or png আপলোড করুন</Label>
									<CloudinaryImageUpload
										label="ছবি আপলোড করুন"
										folder="markazut-tahfiz/features"
										value={featureImages[index]}
										onChange={(url: string) => handleImageChange(index, url)}
										uploadToCloudinary={uploadToCloudinary}
									/>
								</div>
							<div className="space-y-2">
								<Label className={labelClasses}>টাইটেল</Label>
								<Input
									type="text"
									defaultValue={
										feature === 1
											? "গুণমানের শিক্ষা"
											: feature === 2
											? "অভিজ্ঞ শিক্ষকমণ্ডলী"
											: feature === 3
											? "সামগ্রিক উন্নয়ন"
											: feature === 4
											? "স্বীকৃত প্রতিষ্ঠান"
											: feature === 5
											? "দৃষ্টিভঙ্গি ও লক্ষ্য"
											: "আধুনিক সুবিধা"
									}
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>বর্ণনা</Label>
								<Textarea
									rows={3}
									defaultValue={
										feature === 1
											? "আমরা আন্তর্জাতিক মানের ইসলামী শিক্ষা প্রদান করি এবং শিক্ষার্থীদের জীবনকে সমৃদ্ধ করি।"
											: feature === 2
											? "আমাদের শিক্ষকরা উচ্চ প্রশিক্ষিত এবং আধুনিক শিক্ষা পদ্ধতিতে দক্ষ।"
											: feature === 3
											? "আমরা শুধু শিক্ষাই নয়, শিক্ষার্থীদের নৈতিক ও সামাজিক উন্নয়নে বিশ্বাসী।"
											: feature === 4
											? "আমরা সরকার অনুমোদিত এবং বিভিন্ন আন্তর্জাতিক সংস্থা দ্বারা স্বীকৃত।"
											: feature === 5
											? "আমাদের লক্ষ্য হল সুশিক্ষিত এবং চরিত্রবান নাগরিক তৈরি করা।"
											: "আমাদের রয়েছে আধুনিক ক্লাসরুম, লাইব্রেরি এবং প্রযুক্তিগত সুবিধা।"
									}
									className={inputClasses}
								/>
							</div>
						</div>
					))}
				</div>

				<Button type="submit">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

// আমাদের অর্জন
function OurAchievementsForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				আমাদের অর্জন
			</h2>
			<form className="space-y-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="১৫+ বছরের অভিজ্ঞতা" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Input
								type="text"
								defaultValue="১৫+ বছরের অভিজ্ঞতা"
								/>
						</div>
					</div>
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="২০০০+ সফল স্নাতক" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Input
								type="text"
								defaultValue="২০০০+ সফল স্নাতক"
								/>
						</div>
					</div>
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="৭০+ শিক্ষক ও কর্মচারী" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Input
								type="text"
								defaultValue="৭০+ শিক্ষক ও কর্মচারী"
								/>
						</div>
					</div>
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="৫০০+ বর্তমান শিক্ষার্থী" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Input
								type="text"
								defaultValue="৫০০+ বর্তমান শিক্ষার্থী"
								/>
						</div>
					</div>
				</div>
				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// আমাদের শিক্ষা কর্মসূচি
function OurProgramForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				আমাদের শিক্ষা কর্মসূচি
			</h2>
			<form className="space-y-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="নূরানী প্রোগ্রাম" />
						</div>
						<div className="space-y-2">
							<Label>সময়কাল</Label>
							<Input type="text" defaultValue="সময়কাল: ৩ বছর" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Textarea
								rows={2}
								defaultValue="কুরআন পড়ার মৌলিক প্রশিক্ষণ এবং আরবি ভাষার প্রাথমিক শিক্ষা।"
							/>
						</div>
					</div>
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="হিফজ প্রোগ্রাম" />
						</div>
						<div className="space-y-2">
							<Label>সময়কাল</Label>
							<Input type="text" defaultValue="সময়কাল: ২-৩ বছর" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Textarea
								rows={2}
								defaultValue="সম্পূর্ণ কুরআন হিফজ করার জন্য নিবিড় প্রোগ্রাম।"
							/>
						</div>
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
};

//আমাদের মূল্যবোধ
function OurValuesForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				আমাদের মূল্যবোধ
			</h2>
			<form className="space-y-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="space-y-4 p-4 border rounded-md">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="সততা" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Textarea
								rows={2}
								defaultValue="আমরা সকল কাজে সততা এবং স্বচ্ছতা বজায় রাখি।"
							/>
						</div>
					</div>
					<div className="space-y-4 p-4 border rounded-md">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="মানসম্মত শিক্ষা" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Textarea
								rows={2}
								defaultValue="উচ্চমানের শিক্ষা প্রদান করা আমাদের প্রথম অগ্রাধিকার।"
							/>
						</div>
					</div>
				</div>
				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
};

//আমাদের সুবিধাসমূহ
function OurFacilitiesForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				আমাদের সুবিধাসমূহ
			</h2>
			<form className="space-y-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="আধুনিক ক্লাসরুম" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Textarea
								rows={2}
								defaultValue="উন্নত প্রযুক্তি সম্পন্ন শিক্ষা কক্ষ"
							/>
						</div>
					</div>
					<div className="p-4 border rounded-md space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="ডিজিটাল লাইব্রেরি" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Textarea
								rows={2}
								defaultValue="বিস্তৃত ইসলামী জ্ঞানের ভাণ্ডার"
							/>
						</div>
					</div>
				</div>
			<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
};

//Call to action
function CallToActionForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				কল টু অ্যাকশন
			</h2>
			<form className="space-y-4">
				{/* Call to Action */}
				<div>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>টাইটেল</Label>
							<Input type="text" defaultValue="আমাদের সাথে যোগ দিন" />
						</div>
						<div className="space-y-2">
							<Label>বর্ণনা</Label>
							<Textarea
								rows={2}
								defaultValue="আপনার সন্তানের সর্বোত্তম ভবিষ্যতের জন্য আমাদের সাথে যুক্ত হন এবং মানসম্পন্ন ইসলামী শিক্ষা নিশ্চিত করুন।"
							/>
						</div>
						<div className="space-y-2">
							<Label>বাটন টেক্সট</Label>
							<Input type="text" defaultValue="এখনই ভর্তি আবেদন করুন" />
						</div>
					</div>
				</div>
			<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}


const AboutPageContent = ({ uploadToCloudinary }: { uploadToCloudinary: (file: File, folder?: string) => Promise<any> }) => {
    return (
        <div className="space-y-6">
            <AboutHeroForm />
            <AboutContentForm/>
            <AboutFeaturesForm uploadToCloudinary={uploadToCloudinary} />
            <OurAchievementsForm />
            <OurProgramForm />
            <OurValuesForm />
            <OurFacilitiesForm />
            <CallToActionForm />
        </div>
    );
};

export default AboutPageContent;
