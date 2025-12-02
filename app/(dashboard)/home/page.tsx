"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CloudinaryImageUpload } from "../components/CloudinaryImageUpload";

// Theme Context
const ThemeContext = React.createContext({
	theme: "light",
	toggleTheme: () => {},
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const savedTheme = localStorage.getItem("dashboard-theme") || "light";
		setTheme(savedTheme);
		document.documentElement.classList.toggle("dark", savedTheme === "dark");
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("dashboard-theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

function useTheme() {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

// Custom styles for better visibility
const inputClasses =
	"border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
const labelClasses = "text-gray-700 dark:text-gray-300 font-medium";

function HomeDashboard() {
	const [activeTab, setActiveTab] = useState("hero");
	const { theme, toggleTheme } = useTheme();

	const tabs = [
		{ id: "hero", label: "হিরো সেকশন" },
		{ id: "about", label: "আমাদের সম্পর্কে" },
		{ id: "speech", label: "প্রতিষ্ঠাতার বাণী" },
		{ id: "testimonial", label: "অভিভাবকদের মতামত" },
		{ id: "gallery", label: "গ্যালারি" },
	];

	// Function to upload image to Cloudinary
	const uploadToCloudinary = async (
		file: File,
		folder: string = "markazut-tahfiz"
	) => {
		try {
			const formData = new FormData();
			formData.append("files", file);
			formData.append("folder", folder);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Upload failed");
			}

			return result.data[0];
		} catch (error) {
			console.error("Upload error:", error);
			throw error;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
			{/* Sidebar */}
			<div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-bold text-gray-900 dark:text-white">
								ড্যাশবোর্ড
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								মারকাজুত তাহফিজ
							</p>
						</div>
						<button
							onClick={toggleTheme}
							className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
							title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
						>
							{theme === "light" ? "🌙" : "☀️"}
						</button>
					</div>
				</div>

				<nav className="mt-6">
					<div className="px-3">
						<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
							পেজ সমূহ
						</p>
					</div>
					<div className="space-y-1">
						{[
							{ id: "home", label: "হোম পেজ", icon: "🏠", active: true },
							{ id: "about", label: "আমাদের সম্পর্কে", icon: "📖" },
							{ id: "admission", label: "ভর্তি", icon: "📝" },
							{ id: "departments", label: "বিভাগসমূহ", icon: "🏫" },
							{ id: "notice", label: "নোটিশ", icon: "📢" },
							{ id: "contact", label: "যোগাযোগ", icon: "📞" },
						].map((page) => (
							<a
								key={page.id}
								href={`/dashboard/${page.id === "home" ? "" : page.id}`}
								className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
									page.active
										? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-r-2 border-green-500"
										: "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
								}`}
							>
								<span className="mr-3">{page.icon}</span>
								{page.label}
							</a>
						))}
					</div>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								হোম পেজ
							</h2>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								কনটেন্ট পরিচালনা করুন
							</p>
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							শেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}
						</div>
					</div>
				</div>

				{/* Content Area */}
				<div className="flex-1 p-8">
					{/* Tabs */}
					<div className="mb-6">
						<nav
							className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm overflow-x-auto"
							aria-label="Tabs"
						>
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex-1 min-w-0 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
										activeTab === tab.id
											? "bg-green-500 text-white shadow-sm"
											: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
									}`}
								>
									{tab.label}
								</button>
							))}
						</nav>
					</div>

					{/* Tab Content */}
					<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
						{activeTab === "hero" && (
							<HeroForm uploadToCloudinary={uploadToCloudinary} />
						)}
						{activeTab === "about" && <AboutForm />}
						{activeTab === "speech" && <SpeechForm />}
						{activeTab === "testimonial" && <TestimonialForm />}
						{activeTab === "gallery" && <GalleryForm />}
					</div>
				</div>
			</div>
		</div>
	);
}

// Hero Section Form
function HeroForm({
	uploadToCloudinary,
}: {
	uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) {
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

				<Button type="submit" className="bg-green-600 hover:bg-green-700">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

// About Section Form
function AboutForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				আমাদের সম্পর্কে সেকশন সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Steps */}
				<div>
					<h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
						স্টেপস
					</h3>
					{[1, 2, 3, 4].map((step) => (
						<div
							key={step}
							className="mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-700"
						>
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
									<Label className={labelClasses}>আইকন</Label>
									<Input
										type="text"
										defaultValue={
											step === 1
												? "School"
												: step === 2
												? "NotebookPen"
												: step === 3
												? "MonitorCog"
												: "BookOpenText"
										}
										className={inputClasses}
									/>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Content */}
				<div className="space-y-2">
					<Label className={labelClasses}>মূল কনটেন্ট</Label>
					<Textarea
						rows={4}
						defaultValue="আমাদের প্রতিষ্ঠান আপনার সন্তানের হিফজ শিক্ষাগত মান ও জ্ঞান বিকাশে প্রতিশ্রুতিবদ্ধ..."
						className={inputClasses}
					/>
				</div>

				{/* Images */}
				<div>
					<h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
						ইমেজেস
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className={labelClasses}>ইমেজ ১</Label>
							<Input type="file" accept="image/*" className="text-sm" />
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>ইমেজ ২</Label>
							<Input type="file" accept="image/*" className="text-sm" />
						</div>
					</div>
				</div>

				{/* Phone */}
				<div className="space-y-2">
					<Label className={labelClasses}>ফোন নাম্বার</Label>
					<Input
						type="text"
						defaultValue="+8801712-054763"
						className={inputClasses}
					/>
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

// Speech Section Form
function SpeechForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				প্রতিষ্ঠাতার বাণী সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label className={labelClasses}>নাম</Label>
						<Input
							type="text"
							defaultValue="শায়েখ নেজার আহমেদ আন নাহিরী"
							className={inputClasses}
						/>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>পদবী</Label>
						<Input
							type="text"
							defaultValue="প্রতিষ্ঠাতা পরিচালক"
							className={inputClasses}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>সাবটাইটেল</Label>
					<Input
						type="text"
						defaultValue="মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসা"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>আরবি টেক্সট</Label>
					<Input
						type="text"
						defaultValue="بسم الله الرحمن الرحيم"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>গ্রিটিং</Label>
					<Input
						type="text"
						defaultValue="আলাহামদুলিল্লাহ"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>বাণী টেক্সট (প্যারাগ্রাফ ১)</Label>
					<Textarea
						rows={3}
						defaultValue="মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসা প্রতিষ্ঠার মাধ্যে আমরা এমন উদ্দেশ্য নিয়ে কাজ করছি..."
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>বাণী টেক্সট (প্যারাগ্রাফ ২)</Label>
					<Textarea
						rows={3}
						defaultValue="আমাদের লক্ষ্য হলো কেমন পরিবর্তনশীল প্রজেক্ট ও চ্যারিটিক সুবায়ারের উপজন সৃষ্টি গড়ে তোলা..."
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>বাণী টেক্সট (প্যারাগ্রাফ ৩)</Label>
					<Textarea
						rows={3}
						defaultValue="দোয়া ও সহযোগিতা কামনা করি, যেন আল্লাহ আমাদের এই মহৎ উদ্দেশ্য বাস্তবায়নের তারিফে দান করেন।"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>রেটিং</Label>
					<Input type="number" defaultValue="99" className={inputClasses} />
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>প্রোফাইল ইমেজ</Label>
					<Input type="file" accept="image/*" className="text-sm" />
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

// Testimonial Section Form
function TestimonialForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				অভিভাবকদের মতামত সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-2">
					<Label className={labelClasses}>সেকশন টাইটেল</Label>
					<Input
						type="text"
						defaultValue="আমাদের অভিভাবকদের আমাদের সম্পর্কে যা বলেন"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>সাবটাইটেল</Label>
					<Input
						type="text"
						defaultValue="আমাদের মূল্যবান অভিভাবকদের মতামত এবং অভিজ্ঞতা জানুন"
						className={inputClasses}
					/>
				</div>

				{/* Testimonial Items */}
				<div>
					<h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
						টেস্টিমোনিয়ালস
					</h3>
					{[1, 2].map((item) => (
						<div
							key={item}
							className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-700"
						>
							<h4 className="font-medium mb-4 text-gray-900 dark:text-white">
								টেস্টিমোনিয়াল {item}
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className={labelClasses}>নাম</Label>
									<Input
										type="text"
										defaultValue={item === 1 ? "আতাউর রহমান" : "রাহুলান হোসাইন"}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>লোকেশন</Label>
									<Input
										type="text"
										defaultValue="গাজীপুর"
										className={inputClasses}
									/>
								</div>
							</div>
							<div className="mt-4 space-y-2">
								<Label className={labelClasses}>টেক্সট</Label>
								<Textarea
									rows={3}
									defaultValue={
										item === 1
											? "মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসায় আমার সন্তানকে ভর্তি করে আমরা অত্যন্ত সন্তুষ্ট..."
											: "মারকাজুত তারফিজ ইউনোয়ানানাল মাদ্রাসার শিক্ষা পদ্ধতি অসাধারণ..."
									}
									className={inputClasses}
								/>
							</div>
							<div className="mt-4 space-y-2">
								<Label className={labelClasses}>ইমেজ</Label>
								<Input type="file" accept="image/*" className="text-sm" />
							</div>
						</div>
					))}
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

// Gallery Section Form
function GalleryForm() {
	const [galleryImages, setGalleryImages] = useState(
		Array.from({ length: 9 }, (_, i) => ({
			id: i + 1,
			url: `/api/placeholder/300/200?text=Image ${i + 1}`,
			alt: `ইভেন্ট ছবি ${i + 1}`,
			uploaded: false,
		}))
	);

	const handleImageUpdate = (id: number, file: File | null, alt: string) => {
		setGalleryImages((images) =>
			images.map((img) =>
				img.id === id ? { ...img, alt, uploaded: !!file } : img
			)
		);
	};

	const handleImageDelete = (id: number) => {
		if (confirm("আপনি কি এই ছবিটি মুছে ফেলতে চান?")) {
			setGalleryImages((images) =>
				images.map((img) =>
					img.id === id
						? {
								...img,
								url: `/api/placeholder/300/200?text=Deleted`,
								alt: "",
								uploaded: false,
						  }
						: img
				)
			);
		}
	};

	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				গ্যালারি সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-2">
					<Label className={labelClasses}>টাইটেল</Label>
					<Input
						type="text"
						defaultValue="আমাদের ফটো গ্যালারি"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>সাবটাইটেল</Label>
					<Input
						type="text"
						defaultValue="আমাদের স্মৃতিময় মুহূর্তগুলি এখানে দেখুন"
						className={inputClasses}
					/>
				</div>

				{/* Gallery Images */}
				<div>
					<h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
						গ্যালারি ইমেজেস
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{galleryImages.map((image) => (
							<div
								key={image.id}
								className="p-4 border rounded-md space-y-3 bg-gray-50 dark:bg-gray-800"
							>
								{/* Image Preview */}
								<div className="relative">
									<img
										src={image.url}
										alt={image.alt}
										className="w-full h-32 object-cover rounded border"
									/>
									{image.uploaded && (
										<div className="absolute top-2 right-2 flex gap-1">
											<button
												onClick={() => handleImageDelete(image.id)}
												className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
												title="ডিলিট"
											>
												🗑️
											</button>
										</div>
									)}
								</div>

								{/* Image Controls */}
								<div className="space-y-2">
									<Label className="text-sm text-gray-600 dark:text-gray-400">
										ইমেজ {image.id}
									</Label>
									<Input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file = e.target.files?.[0];
											handleImageUpdate(image.id, file || null, image.alt);
										}}
										className="text-sm"
									/>
									<Input
										type="text"
										placeholder="Alt text"
										value={image.alt}
										onChange={(e) =>
											handleImageUpdate(image.id, null, e.target.value)
										}
										className={`${inputClasses} text-sm`}
									/>
									{image.uploaded && (
										<div className="text-xs text-green-600 dark:text-green-400 flex items-center">
											✓ আপলোড সম্পন্ন
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

export default function HomePage() {
	return (
		<ThemeProvider>
			<HomeDashboard />
		</ThemeProvider>
	);
}
