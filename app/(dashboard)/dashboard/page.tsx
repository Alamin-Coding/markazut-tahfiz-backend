/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	ResponsiveContainer,
} from "recharts";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import HeroForm from "@/components/HeroForm";

// Theme Context
const ThemeContext = React.createContext({
	theme: "light",
	toggleTheme: () => {},
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		// Check for saved theme preference or default to 'light'
		const savedTheme = localStorage.getItem("dashboard-theme") || "light";
		setTheme(savedTheme);
		document.documentElement.classList.toggle("dark", savedTheme === "dark");
	}, [theme]);

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

// Custom hook to use theme
function useTheme() {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

// Custom styles for better visibility
export const inputClasses =
	"border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
export const labelClasses = "text-gray-700 dark:text-gray-300 font-medium";
export const selectClasses =
	"border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white";

// Cloudinary Image Upload Component
function CloudinaryImageUpload({
	label,
	value,
	onChange,
	folder = "markazut-tahfiz",
	className = "",
	uploadToCloudinary,
}: {
	label: string;
	value?: string;
	onChange: (url: string) => void;
	folder?: string;
	className?: string;
	uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) {
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
		} catch (error) {
			alert("Image upload failed. Please try again.");
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
					<div className="border rounded-lg p-3 bg-gray-50">
						<p className="text-sm text-gray-600 mb-2">Preview:</p>
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

function DashboardContent() {
	const [activePage, setActivePage] = useState("home");
	const [activeTab, setActiveTab] = useState("hero");
	const [newApplicationsCount, setNewApplicationsCount] = useState(0);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();

	const pages = [
		{ id: "home", label: "হোম পেজ", icon: "🏠" },
		{ id: "about", label: "আমাদের সম্পর্কে", icon: "📖" },
		{ id: "admission", label: "ভর্তি", icon: "📝" },
		{ id: "departments", label: "বিভাগসমূহ", icon: "🏫" },
		{ id: "result", label: "ফলাফল", icon: "📊" },
		{ id: "notice", label: "নোটিশ", icon: "📢" },
		{ id: "contact", label: "যোগাযোগ", icon: "📞" },
	];

	const getTabsForPage = (pageId: string) => {
		switch (pageId) {
			case "home":
				return [
					{ id: "hero", label: "হিরো সেকশন" },
					{ id: "about", label: "আমাদের সম্পর্কে" },
					{ id: "speech", label: "প্রতিষ্ঠাতার বাণী" },
					{ id: "testimonial", label: "অভিভাবকদের মতামত" },
					{ id: "gallery", label: "গ্যালারি" },
				];
			case "about":
				return [
					{ id: "hero", label: "হিরো সেকশন" },
					{ id: "content", label: "মূল কনটেন্ট" },
					{ id: "features", label: "বৈশিষ্ট্যসমূহ" },
				];
			case "admission":
				return [
					{ id: "form", label: "ভর্তি ফর্ম" },
					{ id: "requirements", label: "যোগ্যতা" },
					{ id: "process", label: "প্রক্রিয়া" },
					{ id: "applications", label: "ভর্তি আবেদনসমূহ" },
				];
			case "departments":
				return [
					{ id: "list", label: "বিভাগ তালিকা" },
					{ id: "details", label: "বিস্তারিত" },
				];
			case "folafol":
				return [
					{ id: "manage", label: "ফলাফল পরিচালনা" },
					{ id: "analytics", label: "অ্যানালিটিক্স" },
					{ id: "communication", label: "যোগাযোগ" },
				];
			case "notice":
				return [];
			case "contact":
				return [
					{ id: "info", label: "যোগাযোগ তথ্য" },
					{ id: "form", label: "যোগাযোগ ফর্ম" },
				];
			default:
				return [];
		}
	};

	const tabs = getTabsForPage(activePage);

	// Simulate new applications for demo purposes
	useEffect(() => {
		const interval = setInterval(() => {
			// Randomly add new applications (0-2 per interval)
			const newApps = Math.floor(Math.random() * 3);
			if (newApps > 0) {
				setNewApplicationsCount((prev) => prev + newApps);
			}
		}, 30000); // Check every 30 seconds

		return () => clearInterval(interval);
	}, []);

	// Function to manually add new applications for testing
	const simulateNewApplication = () => {
		setNewApplicationsCount((prev) => prev + 1);
	};

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

			return result.data[0]; // Return the first uploaded image data
		} catch (error) {
			console.error("Upload error:", error);
			throw error;
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 flex">
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl rounded-r-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
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
							onClick={() => setSidebarOpen(false)}
							className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							✕
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
						{pages.map((page) => (
							<button
								key={page.id}
								onClick={() => {
									setActivePage(page.id);
									setActiveTab(getTabsForPage(page.id)[0]?.id || "");
									setSidebarOpen(false); // Close sidebar on mobile
									// Clear notification when viewing admission applications
									if (page.id === "admission" && activeTab === "applications") {
										setNewApplicationsCount(0);
									}
								}}
								className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
									activePage === page.id
										? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-r-2 border-green-500"
										: "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
								}`}
							>
								<span className="mr-3">{page.icon}</span>
								<span className="flex-1 text-left">{page.label}</span>
								{/* Notification badge for admission */}
								{page.id === "admission" && newApplicationsCount > 0 && (
									<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
										{newApplicationsCount > 99 ? "99+" : newApplicationsCount}
									</span>
								)}
							</button>
						))}
						{/* Logout Button at Bottom */}
						<div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
							<button
								onClick={async () => {
									await fetch("/api/auth/logout", { method: "POST" });
									window.location.href = "/";
								}}
								className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
							>
								Logout
							</button>
						</div>
					</div>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8">
				{/* Content Card */}
				<div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-[1920px] mx-auto w-full">
					{/* Header */}
					<div className="border-b border-gray-200 pb-4 mb-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								{/* Mobile menu button */}
								<button
									onClick={() => setSidebarOpen(true)}
									className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
								>
									☰
								</button>
								<div>
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
										{pages.find((p) => p.id === activePage)?.label}
									</h2>
									<p className="text-sm text-gray-600 mt-1">
										কনটেন্ট পরিচালনা করুন
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-2 sm:space-x-4">
								{/* Theme toggle */}
								<button
									onClick={toggleTheme}
									className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
									title={`Switch to ${
										theme === "light" ? "dark" : "light"
									} mode`}
								>
									{theme === "light" ? "🌙" : "☀️"}
								</button>
								{/* Demo notification button */}
								<Button
									onClick={simulateNewApplication}
									variant="outline"
									size="sm"
									className="text-xs hidden sm:inline-flex"
								>
									🔔 ডেমো নোটিফিকেশন
								</Button>
								<div className="text-xs sm:text-sm text-gray-500">
									শেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}
								</div>
							</div>
						</div>
					</div>

					{/* Content Area */}
					<div className="flex-1">
						{tabs.length > 0 && (
							<div className="mb-6">
								<nav
									className="flex space-x-1 bg-gray-50 p-1 rounded-lg overflow-x-auto"
									aria-label="Tabs"
								>
									{tabs.map((tab) => (
										<button
											key={tab.id}
											onClick={() => {
												setActiveTab(tab.id);
												// Clear notification when viewing admission applications
												if (
													activePage === "admission" &&
													tab.id === "applications"
												) {
													setNewApplicationsCount(0);
												}
											}}
											className={`flex-1 min-w-0 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
												activeTab === tab.id
													? "bg-green-500 text-white shadow-sm"
													: "text-gray-600 hover:text-gray-900 hover:bg-white"
											}`}
										>
											{tab.label}
										</button>
									))}
								</nav>
							</div>
						)}

						{/* Tab Content */}
						<div className="bg-gray-50 rounded-lg p-4 sm:p-6">
							{activePage === "home" && activeTab === "hero" && (
								<HeroForm uploadToCloudinary={uploadToCloudinary} />
							)}
							{activePage === "home" && activeTab === "about" && <AboutForm />}
							{activePage === "home" && activeTab === "speech" && (
								<SpeechForm />
							)}
							{activePage === "home" && activeTab === "testimonial" && (
								<TestimonialForm />
							)}
							{activePage === "home" && activeTab === "gallery" && (
								<GalleryForm />
							)}

							{/* About Page Content */}
							{activePage === "about" && activeTab === "hero" && (
								<AboutHeroForm />
							)}
							{activePage === "about" && activeTab === "content" && (
								<AboutContentForm />
							)}
							{activePage === "about" && activeTab === "features" && (
								<AboutFeaturesForm />
							)}

							{/* Admission Page Content */}
							{activePage === "admission" && activeTab === "form" && (
								<AdmissionForm />
							)}
							{activePage === "admission" && activeTab === "requirements" && (
								<AdmissionRequirementsForm />
							)}
							{activePage === "admission" && activeTab === "process" && (
								<AdmissionProcessForm />
							)}
							{activePage === "admission" && activeTab === "applications" && (
								<AdmissionApplicationsForm />
							)}

							{/* Departments Page Content */}
							{activePage === "departments" && activeTab === "list" && (
								<DepartmentsListForm />
							)}
							{activePage === "departments" && activeTab === "details" && (
								<DepartmentsDetailsForm />
							)}

							{/* Notice Page Content */}
							{activePage === "notice" && <NoticeManagementForm />}

							{/* Folafol Page Content */}
							{activePage === "folafol" && activeTab === "manage" && (
								<ResultsManageForm />
							)}
							{activePage === "folafol" && activeTab === "analytics" && (
								<ResultsAnalyticsForm />
							)}
							{activePage === "folafol" && activeTab === "communication" && (
								<ResultsCommunicationForm />
							)}

							{/* Contact Page Content */}
							{activePage === "contact" && activeTab === "info" && (
								<ContactInfoForm />
							)}
							{activePage === "contact" && activeTab === "form" && (
								<ContactForm />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// About Section Form
function AboutForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				আমাদের সম্পর্কে সেকশন সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Steps */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">স্টেপস</h3>
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
									<Label className={labelClasses}>আইকন</Label>
									<Select
										defaultValue={
											step === 1
												? "School"
												: step === 2
												? "NotebookPen"
												: step === 3
												? "MonitorCog"
												: "BookOpenText"
										}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="School">School</SelectItem>
											<SelectItem value="NotebookPen">NotebookPen</SelectItem>
											<SelectItem value="MonitorCog">MonitorCog</SelectItem>
											<SelectItem value="BookOpenText">BookOpenText</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Content */}
				<div className="space-y-2">
					<Label>মূল কনটেন্ট</Label>
					<Textarea
						rows={4}
						defaultValue="আমাদের প্রতিষ্ঠান আপনার সন্তানের হিফজ শিক্ষাগত মান ও জ্ঞান বিকাশে প্রতিশ্রুতিবদ্ধ..."
					/>
				</div>

				{/* Images */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">ইমেজেস</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>ইমেজ ১</Label>
							<Input type="file" accept="image/*" />
						</div>
						<div className="space-y-2">
							<Label>ইমেজ ২</Label>
							<Input type="file" accept="image/*" />
						</div>
					</div>
				</div>

				{/* Phone */}
				<div className="space-y-2">
					<Label>ফোন নাম্বার</Label>
					<Input type="text" defaultValue="+8801712-054763" />
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

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
					<Label>ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট (CSS ক্লাস)</Label>
					<Input type="text" defaultValue="from-button to-green-800" />
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// Admission Page Forms
function AdmissionForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				ভর্তি পেজ - হিরো ব্যানার সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-2">
					<Label className={labelClasses}>শিরোনাম</Label>
					<Input
						type="text"
						defaultValue="ভর্তি তথ্য ও নির্দেশিকা"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>সাবটাইটেল</Label>
					<Input
						type="text"
						defaultValue="মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসায় স্বাগতম"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>
						ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট (CSS ক্লাস)
					</Label>
					<Input
						type="text"
						defaultValue="from-button via-green-700 to-green-800"
						className={inputClasses}
					/>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

function AdmissionRequirementsForm() {
	const [documents, setDocuments] = useState([
		"জন্ম নিবন্ধন সার্টিফিকেট",
		"একাডেমিক রেকর্ড (যদি থাকে)",
		"স্বাস্থ্য পরীক্ষার রিপোর্ট",
		"অভিভাবকের পরিচয়পত্র (এনআইডি)",
		"পাসপোর্ট সাইজ ছবি (৪×৬)",
	]);

	const [infoCards, setInfoCards] = useState([
		{ title: "শ্রেণী সমূহ", value: "নূরানী থেকে আলিম পর্যন্ত" },
		{ title: "বার্ষিক ফি", value: "২,০০০ - ৫,০০০ টাকা" },
		{ title: "প্রতি ক্লাসে ধারণক্ষমতা", value: "৫০ - ৭৫ জন শিক্ষার্থী" },
		{ title: "শিক্ষা সময়কাল", value: "২ - ১০ বছর" },
	]);

	const addDocument = () => {
		setDocuments([...documents, ""]);
	};

	const removeDocument = (index: number) => {
		setDocuments(documents.filter((_, i) => i !== index));
	};

	const updateDocument = (index: number, value: string) => {
		setDocuments(documents.map((doc, i) => (i === index ? value : doc)));
	};

	const addInfoCard = () => {
		setInfoCards([...infoCards, { title: "", value: "" }]);
	};

	const removeInfoCard = (index: number) => {
		setInfoCards(infoCards.filter((_, i) => i !== index));
	};

	const updateInfoCard = (
		index: number,
		field: "title" | "value",
		value: string
	) => {
		setInfoCards(
			infoCards.map((card, i) =>
				i === index ? { ...card, [field]: value } : card
			)
		);
	};

	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				ভর্তি পেজ - প্রয়োজনীয় ডকুমেন্টস এবং তথ্য সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Info Cards */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						ইনফো কার্ডস
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{infoCards.map((card, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<div className="flex justify-between items-center mb-2">
									<h4 className="text-sm font-medium text-gray-600">
										কার্ড {idx + 1}
									</h4>
									<Button
										type="button"
										onClick={() => removeInfoCard(idx)}
										variant="outline"
										size="sm"
										className="text-red-600 hover:text-red-800"
										disabled={infoCards.length <= 1}
									>
										🗑️
									</Button>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>টাইটেল</Label>
									<Input
										type="text"
										value={card.title}
										onChange={(e) =>
											updateInfoCard(idx, "title", e.target.value)
										}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>ভ্যালু</Label>
									<Input
										type="text"
										value={card.value}
										onChange={(e) =>
											updateInfoCard(idx, "value", e.target.value)
										}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
					<Button
						type="button"
						onClick={addInfoCard}
						variant="outline"
						className="mt-4"
					>
						+ নতুন ইনফো কার্ড যোগ করুন
					</Button>
				</div>

				{/* Required Documents */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						প্রয়োজনীয় ডকুমেন্টস
					</h3>
					<div className="space-y-4">
						{documents.map((doc, idx) => (
							<div key={idx} className="flex items-center space-x-2">
								<Input
									type="text"
									value={doc}
									onChange={(e) => updateDocument(idx, e.target.value)}
									className={inputClasses}
									placeholder={`ডকুমেন্ট ${idx + 1}`}
								/>
								<Button
									type="button"
									onClick={() => removeDocument(idx)}
									variant="outline"
									size="sm"
									className="text-red-600 hover:text-red-800"
									disabled={documents.length <= 1}
								>
									🗑️
								</Button>
							</div>
						))}
						<Button
							type="button"
							onClick={addDocument}
							variant="outline"
							className="mt-2"
						>
							+ নতুন ডকুমেন্ট যোগ করুন
						</Button>
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

function AdmissionProcessForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				ভর্তি পেজ - ভর্তি প্রক্রিয়া এবং ক্লাস তথ্য সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Admission Schedule */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						ভর্তি সময়সূচী
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="p-4 border rounded-md space-y-4">
							<h4 className="font-medium">অনলাইন আবেদন</h4>
							<div className="space-y-2">
								<Label className={labelClasses}>শুরু তারিখ</Label>
								<Input
									type="text"
									defaultValue="০১ জানুয়ারি"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>শেষ তারিখ</Label>
								<Input
									type="text"
									defaultValue="৩০ জুন"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>স্ট্যাটাস</Label>
								<Input
									type="text"
									defaultValue="চলমান"
									className={inputClasses}
								/>
							</div>
						</div>
						<div className="p-4 border rounded-md space-y-4">
							<h4 className="font-medium">প্রবেশ পরীক্ষা</h4>
							<div className="space-y-2">
								<Label className={labelClasses}>তারিখ</Label>
								<Input
									type="text"
									defaultValue="জুলাই-আগস্ট"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>সময়</Label>
								<Input
									type="text"
									defaultValue="সকাল ৯:০০ টা"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>স্থান</Label>
								<Input
									type="text"
									defaultValue="প্রধান ক্যাম্পাস"
									className={inputClasses}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Class Information */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						শ্রেণী ও ফি তথ্য
					</h3>
					<div className="space-y-4">
						{[
							{
								class: "নূরানী",
								duration: "৩ বছর",
								fees: "৩,০০০ টাকা",
								capacity: "৬০ জন",
							},
							{
								class: "প্রথম শ্রেণী",
								duration: "১০ বছর",
								fees: "২,০০০ টাকা",
								capacity: "৫০ জন",
							},
							{
								class: "দ্বিতীয় শ্রেণী",
								duration: "১০ বছর",
								fees: "২,০০০ টাকা",
								capacity: "৫০ জন",
							},
							{
								class: "তৃতীয় শ্রেণী",
								duration: "১০ বছর",
								fees: "২,০০০ টাকা",
								capacity: "৫০ জন",
							},
							{
								class: "দাখিল",
								duration: "৩ বছর",
								fees: "৪,৫০০ টাকা",
								capacity: "৭৫ জন",
							},
							{
								class: "আলিম",
								duration: "২ বছর",
								fees: "৫,০০০ টাকা",
								capacity: "৬০ জন",
							},
						].map((cls, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>শ্রেণী</Label>
										<Input
											type="text"
											defaultValue={cls.class}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>সময়কাল</Label>
										<Input
											type="text"
											defaultValue={cls.duration}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ফি</Label>
										<Input
											type="text"
											defaultValue={cls.fees}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ধারণক্ষমতা</Label>
										<Input
											type="text"
											defaultValue={cls.capacity}
											className={inputClasses}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// Departments Page Forms
function DepartmentsListForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				বিভাগসমূহ পেজ - বিভাগ তালিকা সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Hero Section */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">হিরো সেকশন</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className={labelClasses}>শিরোনাম</Label>
							<Input
								type="text"
								defaultValue="আমাদের বিভাগসমূহ"
								className={inputClasses}
							/>
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>সাবটাইটেল</Label>
							<Input
								type="text"
								defaultValue="মারকাজুত তাহফীজ ইউটিবোয়ানানাল মাদরাসা"
								className={inputClasses}
							/>
						</div>
					</div>
				</div>

				{/* Departments */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">বিভাগসমূহ</h3>
					<div className="space-y-6">
						{[
							{
								name: "কিতাব বিভাগ",
								icon: "📚",
								color: "from-blue-500 to-blue-600",
								description: "উচ্চ মানের ইসলামিক শিক্ষা প্রদান করা হয়",
								details:
									"এই বিভাগে কোরআন, হাদিস এবং ইসলামিক জ্ঞানের উপর গভীর শিক্ষা প্রদান করা হয়।",
							},
							{
								name: "মক্তব",
								icon: "🏫",
								color: "from-green-500 to-green-600",
								description: "প্রাথমিক স্তরের শিক্ষার্থীদের জন্য",
								details:
									"শুরুআতী বয়সের শিশুদের কোরআন এবং মৌলিক ইসলামিক শিক্ষা প্রদান করা হয়।",
							},
							{
								name: "মক্তব (বালিকা)",
								icon: "👧",
								color: "from-pink-500 to-pink-600",
								description: "বালিকা শিক্ষার্থীদের জন্য আলাদা বিভাগ",
								details:
									"বালিকা শিক্ষার্থীদের জন্য বিশেষভাবে পরিচালিত মক্তব বিভাগ।",
							},
							{
								name: "হিফয",
								icon: "✨",
								color: "from-purple-500 to-purple-600",
								description: "কোরআন সংরক্ষণকারী প্রোগ্রাম",
								details:
									"কোরআন মুখস্থ করার জন্য বিশেষায়িত প্রশিক্ষণ প্রদান করা হয়।",
							},
							{
								name: "হিফয (বালিকা)",
								icon: "💎",
								color: "from-rose-500 to-rose-600",
								description: "বালিকা হিফয শিক্ষার্থীদের জন্য",
								details: "বালিকা শিক্ষার্থীদের জন্য কোরআন হিফয প্রোগ্রাম।",
							},
							{
								name: "জেনারেল (১ম - ৫ম)",
								icon: "🎓",
								color: "from-amber-500 to-amber-600",
								description: "সাধারণ শিক্ষা কর্মসূচি",
								details:
									"প্রথম থেকে পঞ্চম শ্রেণীর সাধারণ শিক্ষা কর্মসূচি পরিচালিত হয়।",
							},
						].map((dept, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>বিভাগ নাম</Label>
										<Input
											type="text"
											defaultValue={dept.name}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>আইকন</Label>
										<Input
											type="text"
											defaultValue={dept.icon}
											className={inputClasses}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>কালার গ্রেডিয়েন্ট</Label>
									<Input
										type="text"
										defaultValue={dept.color}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>সংক্ষিপ্ত বর্ণনা</Label>
									<Input
										type="text"
										defaultValue={dept.description}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>বিস্তারিত বর্ণনা</Label>
									<Textarea
										rows={2}
										defaultValue={dept.details}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

function DepartmentsDetailsForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				বিভাগসমূহ পেজ - পরিসংখ্যান এবং বৈশিষ্ট্যসমূহ সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Statistics */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">পরিসংখ্যান</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[
							{ label: "অভিজ্ঞ শিক্ষক", value: "৫০+" },
							{ label: "শিক্ষার্থী", value: "১০০০+" },
							{ label: "বিভাগ", value: "৬+" },
							{ label: "বছরের অভিজ্ঞতা", value: "২৫+" },
						].map((stat, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<div className="space-y-2">
									<Label className={labelClasses}>লেবেল</Label>
									<Input
										type="text"
										defaultValue={stat.label}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>সংখ্যা</Label>
									<Input
										type="text"
										defaultValue={stat.value}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Features */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						বৈশিষ্ট্যসমূহ
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h4 className="font-medium">শেখার পদ্ধতি</h4>
							{[
								"ঐতিহ্যবাহী ও আধুনিক শিক্ষা পদ্ধতির সমন্বয়",
								"ব্যক্তিগত মনোযোগ এবং পরিচর্যা",
								"নিয়মিত মূল্যায়ন এবং অগ্রগতি ট্র্যাকিং",
								"নৈতিক ও আধ্যাত্মিক উন্নয়নে ফোকাস",
							].map((feature, idx) => (
								<div key={idx} className="space-y-2">
									<Label className={labelClasses}>বৈশিষ্ট্য {idx + 1}</Label>
									<Input
										type="text"
										defaultValue={feature}
										className={inputClasses}
									/>
								</div>
							))}
						</div>
						<div className="space-y-4">
							<h4 className="font-medium">প্রশিক্ষণ কর্মসূচি</h4>
							{[
								"কোরআন তিলাওয়াত এবং তাজবিড়",
								"ইসলামিক অধ্যয়ন এবং হাদিস",
								"আরবি ভাষা শিক্ষা",
								"সাধারণ একাডেমিক বিষয়",
							].map((program, idx) => (
								<div key={idx} className="space-y-2">
									<Label className={labelClasses}>কর্মসূচি {idx + 1}</Label>
									<Input
										type="text"
										defaultValue={program}
										className={inputClasses}
									/>
								</div>
							))}
						</div>
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// Notice Page Forms
interface Notice {
	_id: string;
	title: string;
	date: string;
	content: string | string[];
	type: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

function NoticeManagementForm() {
	const [notices, setNotices] = useState<Notice[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [editingNotice, setEditingNotice] = useState({
		title: "",
		date: undefined as Date | undefined,
		content: [""] as string[],
	});
	const [newNotice, setNewNotice] = useState({
		title: "",
		date: new Date(),
		content: [""] as string[],
	});
	const [showAddForm, setShowAddForm] = useState(false);
	const [adding, setAdding] = useState(false);

	const addContentLine = (isNew: boolean) => {
		if (isNew) {
			setNewNotice((prev) => ({ ...prev, content: [...prev.content, ""] }));
		} else {
			setEditingNotice((prev) => ({ ...prev, content: [...prev.content, ""] }));
		}
	};

	const removeContentLine = (index: number, isNew: boolean) => {
		if (isNew) {
			setNewNotice((prev) => ({
				...prev,
				content: prev.content.filter((_, i) => i !== index),
			}));
		} else {
			setEditingNotice((prev) => ({
				...prev,
				content: prev.content.filter((_, i) => i !== index),
			}));
		}
	};

	const updateContentLine = (index: number, value: string, isNew: boolean) => {
		if (isNew) {
			setNewNotice((prev) => ({
				...prev,
				content: prev.content.map((c, i) => (i === index ? value : c)),
			}));
		} else {
			setEditingNotice((prev) => ({
				...prev,
				content: prev.content.map((c, i) => (i === index ? value : c)),
			}));
		}
	};

	// Fetch notices on component mount
	useEffect(() => {
		fetchNotices();
	}, []);

	const fetchNotices = async () => {
		try {
			const response = await fetch("/api/notice");
			const result = await response.json();
			if (result.success) {
				setNotices(result.data);
			}
		} catch (error) {
			console.error("Error fetching notices:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddNotice = async () => {
		if (
			newNotice.title &&
			newNotice.date &&
			newNotice.content.some((c) => c.trim())
		) {
			setAdding(true);
			try {
				const response = await fetch("/api/notice", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...newNotice,
						content: newNotice.content,
						date: newNotice.date
							? newNotice.date.toISOString().split("T")[0]
							: "",
						type: "announcement",
					}),
				});
				const result = await response.json();
				if (result.success) {
					setNotices([...notices, result.data]);
					setNewNotice({ title: "", date: new Date(), content: [""] });
					setShowAddForm(false);
				} else {
					alert("Failed to add notice");
				}
			} catch (error) {
				console.error("Error adding notice:", error);
				alert("Failed to add notice");
			} finally {
				setAdding(false);
			}
		}
	};

	const handleUpdateNotice = async () => {
		if (!editingId) return;

		setUpdatingId(editingId);
		try {
			const response = await fetch(`/api/notice/${editingId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...editingNotice,
					content: editingNotice.content,
					date: editingNotice.date
						? editingNotice.date.toISOString().split("T")[0]
						: "",
					type: "announcement",
				}),
			});
			const result = await response.json();
			if (result.success) {
				setNotices(
					notices.map((notice) =>
						notice._id === editingId ? result.data : notice
					)
				);
				setEditingId(null);
				setEditingNotice({ title: "", date: undefined, content: [""] });
			} else {
				alert("Failed to update notice");
			}
		} catch (error) {
			console.error("Error updating notice:", error);
			alert("Failed to update notice");
		} finally {
			setUpdatingId(null);
		}
	};

	const startEditing = (notice: Notice) => {
		setEditingId(notice._id);
		setEditingNotice({
			title: notice.title,
			date: notice.date ? new Date(notice.date) : undefined,
			content: Array.isArray(notice.content)
				? notice.content
				: notice.content.split("\n"),
		});
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditingNotice({ title: "", date: undefined, content: [""] });
	};

	const handleDeleteNotice = async (id: string) => {
		if (confirm("আপনি কি এই নোটিশটি মুছে ফেলতে চান?")) {
			try {
				const response = await fetch(`/api/notice/${id}`, {
					method: "DELETE",
				});
				const result = await response.json();
				if (result.success) {
					setNotices(notices.filter((notice) => notice._id !== id));
				} else {
					alert("Failed to delete notice");
				}
			} catch (error) {
				console.error("Error deleting notice:", error);
				alert("Failed to delete notice");
			}
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-medium text-gray-900 dark:text-white">
					নোটিশ ম্যানেজমেন্ট
				</h2>
				<Button
					onClick={() => setShowAddForm(!showAddForm)}
					className="bg-green-600 hover:bg-green-700"
				>
					{showAddForm ? "✕ বাতিল" : "+ নতুন নোটিশ"}
				</Button>
			</div>

			{/* Add New Notice Form */}
			{showAddForm && (
				<div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
					<h3 className="text-md font-medium mb-4 text-gray-900 dark:text-white">
						নতুন নোটিশ যোগ করুন
					</h3>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label className={labelClasses}>নোটিশ টাইটেল</Label>
								<Input
									type="text"
									value={newNotice.title}
									onChange={(e) =>
										setNewNotice({ ...newNotice, title: e.target.value })
									}
									className={inputClasses}
									placeholder="নোটিশের শিরোনাম লিখুন"
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>তারিখ</Label>
								<DatePicker
									date={newNotice.date}
									onSelect={(date) =>
										date && setNewNotice({ ...newNotice, date })
									}
									placeholder="তারিখ নির্বাচন করুন"
								/>
							</div>
							<div className="space-y-2">
								<p className="text-md font-medium text-gray-700 mb-4">
									নোটিশ কনটেন্ট
								</p>
								<div className="space-y-2">
									{newNotice.content.map((line, idx) => (
										<div key={idx} className="flex items-center space-x-2">
											<Input
												type="text"
												value={line}
												onChange={(e) =>
													updateContentLine(idx, e.target.value, true)
												}
												className={inputClasses}
												placeholder={`প্যারাগ্রাফ ${idx + 1}`}
											/>
											<Button
												type="button"
												onClick={() => removeContentLine(idx, true)}
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-800 cursor-pointer"
												disabled={newNotice.content.length <= 1}
											>
												🗑️
											</Button>
										</div>
									))}
									<Button
										type="button"
										onClick={() => addContentLine(true)}
										variant="outline"
										className="mt-2"
									>
										+ নতুন প্যারাগ্রাফ যোগ করুন
									</Button>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									onClick={handleAddNotice}
									disabled={adding}
									className="bg-green-600 hover:bg-green-700"
								>
									{adding ? "যোগ হচ্ছে..." : "যোগ করুন"}
								</Button>
								<Button onClick={() => setShowAddForm(false)} variant="outline">
									বাতিল
								</Button>
							</div>
						</div>
					</form>
				</div>
			)}

			{/* Existing Notices */}
			<div className="space-y-4">
				{notices.map((notice) => (
					<div
						key={notice._id}
						className="p-4 border rounded-lg bg-white dark:bg-gray-800"
					>
						{editingId === notice._id ? (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label className={labelClasses}>নোটিশ টাইটেল</Label>
									<Input
										type="text"
										value={editingNotice.title}
										onChange={(e) =>
											setEditingNotice({
												...editingNotice,
												title: e.target.value,
											})
										}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>তারিখ</Label>
									<DatePicker
										date={editingNotice.date}
										onSelect={(date) =>
											setEditingNotice({ ...editingNotice, date })
										}
										placeholder="তারিখ নির্বাচন করুন"
									/>
								</div>
								<div className="space-y-2">
									<p className="text-md font-medium text-gray-700 mb-4">
										নোটিশ কনটেন্ট
									</p>
									<div className="space-y-2">
										{editingNotice.content.map((line, idx) => (
											<div key={idx} className="space-y-2">
												<Textarea
													rows={2}
													value={line}
													onChange={(e) =>
														updateContentLine(idx, e.target.value, false)
													}
													className={inputClasses}
													placeholder={`প্যারাগ্রাফ ${idx + 1}`}
												/>
												<Button
													type="button"
													onClick={() => removeContentLine(idx, false)}
													variant="outline"
													size="sm"
													className="text-red-600 hover:text-red-800"
													disabled={editingNotice.content.length <= 1}
												>
													🗑️
												</Button>
											</div>
										))}
										<Button
											type="button"
											onClick={() => addContentLine(false)}
											variant="outline"
											className="mt-2"
										>
											+ নতুন প্যারাগ্রাফ যোগ করুন
										</Button>
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										onClick={handleUpdateNotice}
										disabled={updatingId === notice._id}
										className="bg-green-600 hover:bg-green-700"
									>
										{updatingId === notice._id ? "সেভ হচ্ছে..." : "সেভ করুন"}
									</Button>
									<Button onClick={cancelEditing} variant="outline">
										বাতিল
									</Button>
								</div>
							</div>
						) : (
							<div>
								<div className="flex justify-between items-start mb-2">
									<h3 className="text-lg font-medium text-gray-900 dark:text-white">
										{notice.title}
									</h3>
									<div className="flex gap-2">
										<Button
											onClick={() => startEditing(notice)}
											size="sm"
											variant="outline"
											className="text-blue-600 hover:text-blue-800"
										>
											✏️ এডিট
										</Button>
										<Button
											onClick={() => handleDeleteNotice(notice._id)}
											size="sm"
											variant="outline"
											className="text-red-600 hover:text-red-800"
										>
											🗑️ ডিলিট
										</Button>
									</div>
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
									{notice.date}
								</p>
								<div className="text-gray-700 dark:text-gray-300">
									{(Array.isArray(notice.content)
										? notice.content
										: notice.content.split("\n")
									).map((line, idx) => (
										<p key={idx} className="mb-2">
											{line}
										</p>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

interface ResultType {
	_id: string;
	name: string;
	roll: string | number;
	division: string;
	class: string;
	term: string;
	totalMarks: number;
	subjects: { name: string; marks: number; total: number }[];
	examDate: string;
	resultDate: string;
	principal: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

function ResultsManageForm() {
	const [results, setResults] = useState<ResultType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [filteredResults, setFilteredResults] = useState(results);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTerm, setSelectedTerm] = useState("all");
	const [selectedDivision, setSelectedDivision] = useState("all");
	const [selectedClass, setSelectedClass] = useState("all");
	const [showAddForm, setShowAddForm] = useState(false);
	const [adding, setAdding] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		roll: "",
		division: "",
		class: "",
		term: "",
		examDate: "",
		resultDate: "",
		principal: "মাওলানা মোহাম্মদ হোসাইন",
		subjects: [
			{ name: "কোরআন (হিফজ)", marks: 0, total: 100 },
			{ name: "কোরআন (তাজবিদ)", marks: 0, total: 100 },
			{ name: "ইসলামিক স্টাডিজ", marks: 0, total: 100 },
			{ name: "আরবি ব্যাকরণ", marks: 0, total: 100 },
			{ name: "আচরণ ও শৃঙ্খলা", marks: 0, total: 100 },
		],
	});

	// Fetch results on component mount
	useEffect(() => {
		fetchResults();
	}, []);

	const fetchResults = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/result");
			const result = await response.json();
			if (result.success) {
				setResults(result.data);
			} else {
				setError(result.message || "Failed to fetch results");
			}
		} catch (error) {
			console.error("Error fetching results:", error);
			setError("Failed to fetch results");
		} finally {
			setLoading(false);
		}
	};

	const updateSubjectMark = (index: number, value: string) => {
		const updatedSubjects = [...formData.subjects];
		updatedSubjects[index].marks = Number(value);
		setFormData({ ...formData, subjects: updatedSubjects });
	};

	const handleSave = async () => {
		if (
			!formData.name ||
			!formData.roll ||
			!formData.division ||
			!formData.class ||
			!formData.term ||
			!formData.examDate ||
			!formData.resultDate
		) {
			alert("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন");
			return;
		}

		const totalMarks = formData.subjects.reduce(
			(sum, subj) => sum + subj.marks,
			0
		);

		const payload = {
			name: formData.name,
			roll: formData.roll,
			division: formData.division,
			class: formData.class,
			term: formData.term,
			totalMarks,
			subjects: formData.subjects,
			examDate: formData.examDate,
			resultDate: formData.resultDate,
			principal: formData.principal,
		};

		try {
			let response;
			if (editingId) {
				// Update existing result
				response = await fetch(`/api/result/${editingId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});
			} else {
				// Add new result
				response = await fetch("/api/result", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});
			}

			const result = await response.json();
			if (result.success) {
				alert(editingId ? "ফলাফল আপডেট হয়েছে" : "ফলাফল যোগ হয়েছে");
				fetchResults(); // Refresh the list
				setShowAddForm(false);
				setEditingId(null);
				resetForm();
			} else {
				alert(result.message || "Failed to save result");
			}
		} catch (error) {
			console.error("Error saving result:", error);
			alert("Failed to save result");
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			roll: "",
			division: "",
			class: "",
			term: "",
			examDate: "",
			resultDate: "",
			principal: "মাওলানা মোহাম্মদ হোসাইন",
			subjects: [
				{ name: "কোরআন (হিফজ)", marks: 0, total: 100 },
				{ name: "কোরআন (তাজবিদ)", marks: 0, total: 100 },
				{ name: "ইসলামিক স্টাডিজ", marks: 0, total: 100 },
				{ name: "আরবি ব্যাকরণ", marks: 0, total: 100 },
				{ name: "আচরণ ও শৃঙ্খলা", marks: 0, total: 100 },
			],
		});
	};

	// Filter results based on search and filters
	useEffect(() => {
		let filtered = results;

		if (searchTerm) {
			filtered = filtered.filter(
				(result) =>
					result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					result.roll.toString().includes(searchTerm)
			);
		}

		if (selectedTerm !== "all") {
			filtered = filtered.filter((result) => result.term === selectedTerm);
		}

		if (selectedDivision !== "all") {
			filtered = filtered.filter(
				(result) => result.division === selectedDivision
			);
		}

		if (selectedClass !== "all") {
			filtered = filtered.filter((result) => result.class === selectedClass);
		}

		setFilteredResults(filtered);
	}, [results, searchTerm, selectedTerm, selectedDivision, selectedClass]);

	const handleEdit = (result: any) => {
		setEditingId(result._id);
		setFormData({
			name: result.name,
			roll: result.roll,
			division: result.division,
			class: result.class,
			term: result.term,
			examDate: result.examDate,
			resultDate: result.resultDate,
			principal: result.principal,
			subjects: result.subjects,
		});
		setShowAddForm(true);
	};

	const handleDelete = async (id: string) => {
		if (confirm("আপনি কি এই ফলাফলটি মুছে ফেলতে চান?")) {
			try {
				const response = await fetch(`/api/result/${id}`, {
					method: "DELETE",
				});
				const result = await response.json();
				if (result.success) {
					alert("ফলাফল মুছে ফেলা হয়েছে");
					fetchResults(); // Refresh the list
				} else {
					alert(result.message || "Failed to delete result");
				}
			} catch (error) {
				console.error("Error deleting result:", error);
				alert("Failed to delete result");
			}
		}
	};

	const exportToExcel = () => {
		const wb = XLSX.utils.book_new();

		// Prepare data for export
		const exportData = filteredResults.map((result, index) => ({
			"ক্রমিক নং": index + 1,
			নাম: result.name,
			রোল: result.roll,
			বিভাগ: result.division,
			শ্রেণী: result.class,
			পরীক্ষা: result.term,
			"সম্মিলিত নম্বর": result.totalMarks,
			"পরীক্ষার তারিখ": result.examDate,
			"ফলাফল তারিখ": result.resultDate,
		}));

		const ws = XLSX.utils.json_to_sheet(exportData);

		// Set column widths
		const colWidths = [
			{ wch: 10 }, // ক্রমিক নং
			{ wch: 25 }, // নাম
			{ wch: 10 }, // রোল
			{ wch: 15 }, // বিভাগ
			{ wch: 15 }, // শ্রেণী
			{ wch: 20 }, // পরীক্ষা
			{ wch: 15 }, // সম্মিলিত নম্বর
			{ wch: 18 }, // পরীক্ষার তারিখ
			{ wch: 18 }, // ফলাফল তারিখ
		];
		ws["!cols"] = colWidths;

		// Add worksheet to workbook
		XLSX.utils.book_append_sheet(wb, ws, "ফলাফলসমূহ");

		// Generate filename with current date
		const currentDate = new Date().toISOString().split("T")[0];
		const filename = `ফলাফলসমূহ_${currentDate}.xlsx`;

		// Save file
		XLSX.writeFile(wb, filename);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-medium text-gray-900 dark:text-white">
					ফলাফল পরিচালনা
				</h2>
				<div className="flex gap-2">
					<Button
						onClick={() => setShowAddForm(true)}
						className="bg-green-600 hover:bg-green-700"
					>
						+ নতুন ফলাফল যোগ করুন
					</Button>
					<Button onClick={exportToExcel} variant="outline">
						📊 এক্সেলে এক্সপোর্ট
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
				<h3 className="text-md font-medium mb-4 text-gray-900 dark:text-white">
					ফিল্টার
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					<div className="space-y-2">
						<Label className={labelClasses}>নাম অনুসন্ধান</Label>
						<Input
							type="text"
							placeholder="ছাত্রের নাম বা রোল"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={inputClasses}
						/>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>পরীক্ষা</Label>
						<Select value={selectedTerm} onValueChange={setSelectedTerm}>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="সব পরীক্ষা" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">সব পরীক্ষা</SelectItem>
								<SelectItem value="2024-1">১ম পরীক্ষা ২০২৫</SelectItem>
								<SelectItem value="2024-2">২য় পরীক্ষা ২০২৫</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>বিভাগ</Label>
						<Select
							value={selectedDivision}
							onValueChange={setSelectedDivision}
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="সব বিভাগ" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">সব বিভাগ</SelectItem>
								<SelectItem value="A">বিভাগ ক</SelectItem>
								<SelectItem value="B">বিভাগ খ</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>শ্রেণী</Label>
						<Select value={selectedClass} onValueChange={setSelectedClass}>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="সব শ্রেণী" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">১ম শ্রেণী</SelectItem>
								<SelectItem value="2">২য় শ্রেণী</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-end">
						<Button
							onClick={() => {
								setSearchTerm("");
								setSelectedTerm("");
								setSelectedDivision("");
								setSelectedClass("");
							}}
							variant="outline"
						>
							ক্লিয়ার ফিল্টার
						</Button>
					</div>
				</div>
			</div>

			{/* Results Table */}
			<div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									ছাত্র
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									রোল
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									বিভাগ/শ্রেণী
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									পরীক্ষা
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									নম্বর
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									অ্যাকশন
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{filteredResults.map((result) => (
								<tr
									key={result._id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{result.name}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
										{result.roll}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
										{result.division} / {result.class}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
										{result.term}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
										{result.totalMarks}/100
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												className="text-blue-600 hover:text-blue-800"
											>
												👁️ দেখুন
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="text-green-600 hover:text-green-800"
												onClick={() => handleEdit(result)}
											>
												✏️ এডিট
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="text-red-600 hover:text-red-800"
												onClick={() => handleDelete(result._id)}
											>
												🗑️ মুছুন
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Add/Edit Form Modal */}
			{showAddForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-medium">
								{editingId ? "ফলাফল সম্পাদনা করুন" : "নতুন ফলাফল যোগ করুন"}
							</h3>
							<button
								onClick={() => setShowAddForm(false)}
								className="text-gray-500 hover:text-gray-700 text-2xl"
							>
								✕
							</button>
						</div>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSave();
							}}
							className="space-y-6"
						>
							{/* Student Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className={labelClasses}>ছাত্রের নাম *</Label>
									<Input
										type="text"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										className={inputClasses}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>রোল নম্বর *</Label>
									<Input
										type="text"
										value={formData.roll}
										onChange={(e) =>
											setFormData({ ...formData, roll: e.target.value })
										}
										className={inputClasses}
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label className={labelClasses}>বিভাগ *</Label>
									<Select
										value={formData.division}
										onValueChange={(value) =>
											setFormData({ ...formData, division: value })
										}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="বিভাগ নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="A">বিভাগ ক</SelectItem>
											<SelectItem value="B">বিভাগ খ</SelectItem>
											<SelectItem value="C">বিভাগ গ</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>শ্রেণী *</Label>
									<Select
										value={formData.class}
										onValueChange={(value) =>
											setFormData({ ...formData, class: value })
										}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1">১ম শ্রেণী</SelectItem>
											<SelectItem value="2">২য় শ্রেণী</SelectItem>
											<SelectItem value="3">৩য় শ্রেণী</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>পরীক্ষা *</Label>
									<Select
										value={formData.term}
										onValueChange={(value) =>
											setFormData({ ...formData, term: value })
										}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="2024-1">১ম পরীক্ষা ২০২৫</SelectItem>
											<SelectItem value="2024-2">২য় পরীক্ষা ২০২৫</SelectItem>
											<SelectItem value="2025-1">১ম পরীক্ষা ২০২৬</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Exam Dates */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className={labelClasses}>পরীক্ষার তারিখ</Label>
									<Input
										type="text"
										value={formData.examDate}
										onChange={(e) =>
											setFormData({ ...formData, examDate: e.target.value })
										}
										className={inputClasses}
										placeholder="উদাহরণ: ২৪ জানুয়ারি ২০২৫"
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>ফলাফল প্রকাশের তারিখ</Label>
									<Input
										type="text"
										value={formData.resultDate}
										onChange={(e) =>
											setFormData({ ...formData, resultDate: e.target.value })
										}
										className={inputClasses}
										placeholder="উদাহরণ: ২৪ ফেব্রুয়ারি ২০২৫"
									/>
								</div>
							</div>

							{/* Subjects */}
							<div>
								<h4 className="text-lg font-medium mb-4">বিষয়ভিত্তিক নম্বর</h4>
								<div className="space-y-4">
									{formData.subjects.map((subject, index) => (
										<div
											key={index}
											className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
										>
											<div className="space-y-2">
												<Label className={labelClasses}>বিষয়</Label>
												<Input
													type="text"
													value={subject.name}
													onChange={(e) => {
														const updatedSubjects = [...formData.subjects];
														updatedSubjects[index].name = e.target.value;
														setFormData({
															...formData,
															subjects: updatedSubjects,
														});
													}}
													className={inputClasses}
												/>
											</div>
											<div className="space-y-2">
												<Label className={labelClasses}>প্রাপ্ত নম্বর</Label>
												<Input
													type="number"
													min="0"
													max={subject.total}
													value={subject.marks}
													onChange={(e) =>
														updateSubjectMark(index, e.target.value)
													}
													className={inputClasses}
												/>
											</div>
											<div className="space-y-2">
												<Label className={labelClasses}>মোট নম্বর</Label>
												<Input
													type="number"
													value={subject.total}
													onChange={(e) => {
														const updatedSubjects = [...formData.subjects];
														updatedSubjects[index].total = Number(
															e.target.value
														);
														setFormData({
															...formData,
															subjects: updatedSubjects,
														});
													}}
													className={inputClasses}
												/>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Total Marks Display */}
							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<div className="text-lg font-medium">
									সম্মিলিত নম্বর:{" "}
									{formData.subjects.reduce((sum, subj) => sum + subj.marks, 0)}
									/500
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 pt-4">
								<Button
									type="submit"
									className="bg-green-600 hover:bg-green-700"
								>
									{editingId ? "আপডেট করুন" : "সেভ করুন"}
								</Button>
								<Button
									type="button"
									onClick={() => setShowAddForm(false)}
									variant="outline"
								>
									বাতিল
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

function ResultsAnalyticsForm() {
	// Sample data for charts
	const resultsByTermData = [
		{ term: "১ম পরীক্ষা ২০২৫", total: 45, passed: 42, failed: 3 },
		{ term: "২য় পরীক্ষা ২০২৫", total: 48, passed: 45, failed: 3 },
		{ term: "৩য় পরীক্ষা ২০২৫", total: 52, passed: 49, failed: 3 },
		{ term: "৪র্থ পরীক্ষা ২০২৫", total: 50, passed: 47, failed: 3 },
	];

	const passFailData = [
		{ name: "পাশ", value: 183, color: "#10b981" },
		{ name: "ফেল", value: 12, color: "#ef4444" },
	];

	const averageMarksData = [
		{ term: "১ম পরীক্ষা ২০২৫", average: 82.5 },
		{ term: "২য় পরীক্ষা ২০২৫", average: 84.2 },
		{ term: "৩য় পরীক্ষা ২০২৫", average: 85.8 },
		{ term: "৪র্থ পরীক্ষা ২০২৫", average: 87.1 },
	];

	const subjectPerformanceData = [
		{ subject: "কোরআন (হিফজ)", average: 92.5 },
		{ subject: "কোরআন (তাজবিদ)", average: 87.3 },
		{ subject: "ইসলামিক স্টাডিজ", average: 83.7 },
		{ subject: "আরবি ব্যাকরণ", average: 79.2 },
		{ subject: "আচরণ ও শৃঙ্খলা", average: 91.8 },
	];

	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				ফলাফল অ্যানালিটিক্স
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-blue-600">১২৫</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						মোট ফলাফল
					</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-green-600">৯৫</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">পাশ</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-yellow-600">২৫</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">ফেল</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-purple-600">৮৫%</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						গড় নম্বর
					</div>
				</div>
			</div>
			{/* Charts and detailed analytics */}
			<div className="space-y-8">
				{/* Results by Term Bar Chart */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						পরীক্ষা অনুসারে ফলাফল
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={resultsByTermData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="term" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="total" fill="#059669" name="মোট শিক্ষার্থী" />
							<Bar dataKey="passed" fill="#10b981" name="পাশ" />
							<Bar dataKey="failed" fill="#ef4444" name="ফেল" />
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Pass/Fail Distribution Pie Chart */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						পাশ/ফেল বিতরণ
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={passFailData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, percent }) =>
									`${name} ${((percent || 0) * 100).toFixed(0)}%`
								}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{passFailData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Average Marks Trend Line Chart */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						গড় নম্বরের প্রবণতা
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={averageMarksData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="term" />
							<YAxis domain={[0, 100]} />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="average"
								stroke="#059669"
								strokeWidth={2}
								name="গড় নম্বর"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Subject-wise Performance */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						বিষয়ভিত্তিক কর্মক্ষমতা
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={subjectPerformanceData} layout="horizontal">
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" domain={[0, 100]} />
							<YAxis dataKey="subject" type="category" width={120} />
							<Tooltip />
							<Legend />
							<Bar dataKey="average" fill="#3b82f6" name="গড় নম্বর" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

function ResultsCommunicationForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				যোগাযোগ এবং নোটিফিকেশন
			</h2>
			<div className="space-y-6">
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
					<h3 className="text-lg font-medium mb-4">বাল্ক SMS ফলাফল পাঠান</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>পরীক্ষা নির্বাচন করুন</Label>
							<Select>
								<SelectTrigger className={selectClasses}>
									<SelectValue placeholder="পরীক্ষা বেছে নিন" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2024-1">১ম পরীক্ষা ২০২৫</SelectItem>
									<SelectItem value="2024-2">২য় পরীক্ষা ২০২৫</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>বিভাগ/শ্রেণী (ঐচ্ছিক)</Label>
							<Input placeholder="সব বিভাগ/শ্রেণী" className={inputClasses} />
						</div>
						<Button className="bg-blue-600 hover:bg-blue-700">
							📱 ফলাফল SMS পাঠান
						</Button>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
					<h3 className="text-lg font-medium mb-4">জরুরি নোটিস</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>নোটিস টাইটেল</Label>
							<Input placeholder="নোটিসের শিরোনাম" className={inputClasses} />
						</div>
						<div className="space-y-2">
							<Label>নোটিস কনটেন্ট</Label>
							<Textarea
								rows={4}
								placeholder="নোটিসের বিস্তারিত"
								className={inputClasses}
							/>
						</div>
						<Button className="bg-red-600 hover:bg-red-700">
							🚨 নোটিস পাঠান
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Dashboard() {
	return (
		<ThemeProvider>
			<DashboardContent />
		</ThemeProvider>
	);
}

// Admission Applications Viewer Form
function AdmissionApplicationsForm() {
	const [mockApplications, setMockApplications] = useState([
		{
			id: 1,
			nameBangla: "মোহাম্মদ রহমান",
			nameEnglish: "Mohammad Rahman",
			fatherName: "আব্দুল করিম",
			motherName: "ফাতেমা খাতুন",
			presentAddress: "ধানাবাড়ি, চাঁদপুর",
			permanentAddress: "ধানাবাড়ি, চাঁদপুর",
			exMadrasa: "ধানাবাড়ি মাদরাসা",
			lastClass: "পঞ্চম শ্রেণী",
			admissionClass: "নূরানী",
			admissionDepartment: "হিফজ",
			guardianName: "আব্দুল করিম",
			guardianPhone: "+8801712-054763",
			guardianRelation: "পিতা",
			status: "পেন্ডিং",
			submittedAt: "2025-01-15",
			photo: "/api/placeholder/150/200",
		},
		{
			id: 2,
			nameBangla: "ফাতেমা আক্তার",
			nameEnglish: "Fatema Akter",
			fatherName: "মোহাম্মদ আলী",
			motherName: "রহিমা খাতুন",
			presentAddress: "চাঁদপুর সদর",
			permanentAddress: "চাঁদপুর সদর",
			exMadrasa: "চাঁদপুর মাদরাসা",
			lastClass: "চতুর্থ শ্রেণী",
			admissionClass: "প্রথম শ্রেণী",
			admissionDepartment: "আরবি",
			guardianName: "মোহাম্মদ আলী",
			guardianPhone: "+8801712-054764",
			guardianRelation: "পিতা",
			status: "অনুমোদিত",
			submittedAt: "2025-01-14",
			photo: "/api/placeholder/150/200",
		},
		{
			id: 3,
			nameBangla: "আব্দুল্লাহ আল মামুন",
			nameEnglish: "Abdullah Al Mamun",
			fatherName: "মামুনুর রশিদ",
			motherName: "সালমা বেগম",
			presentAddress: "চাঁদপুর কলেজ রোড",
			permanentAddress: "চাঁদপুর কলেজ রোড",
			exMadrasa: "কেন্দ্রীয় মাদরাসা",
			lastClass: "আলিম পরীক্ষা",
			admissionClass: "দাখিল",
			admissionDepartment: "ইসলামী শিক্ষা",
			guardianName: "মামুনুর রশিদ",
			guardianPhone: "+8801712-054765",
			guardianRelation: "পিতা",
			status: "পেন্ডিং",
			submittedAt: "2025-01-13",
			photo: "/api/placeholder/150/200",
		},
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "অনুমোদিত":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "পেন্ডিং":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "প্রত্যাখ্যাত":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const handleStatusChange = (id: number, newStatus: string) => {
		setMockApplications((apps) =>
			apps.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
		);
	};

	// Excel export function
	const exportToExcel = () => {
		// Prepare data for Excel
		const excelData = mockApplications.map((app) => ({
			আইডি: app.id,
			"নাম (বাংলা)": app.nameBangla,
			"নাম (ইংরেজি)": app.nameEnglish,
			"পিতার নাম": app.fatherName,
			"মাতার নাম": app.motherName,
			"বর্তমান ঠিকানা": app.presentAddress,
			"স্থায়ী ঠিকানা": app.permanentAddress,
			"পূর্ববর্তী মাদরাসা": app.exMadrasa,
			"শেষ শ্রেণী": app.lastClass,
			"ভর্তির শ্রেণী": app.admissionClass,
			বিভাগ: app.admissionDepartment,
			"অভিভাবকের নাম": app.guardianName,
			"অভিভাবকের ফোন": app.guardianPhone,
			সম্পর্ক: app.guardianRelation,
			স্ট্যাটাস: app.status,
			"আবেদন তারিখ": app.submittedAt,
		}));

		// Create workbook and worksheet
		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(excelData);

		// Set column widths
		const colWidths = [
			{ wch: 8 }, // আইডি
			{ wch: 20 }, // নাম (বাংলা)
			{ wch: 20 }, // নাম (ইংরেজি)
			{ wch: 15 }, // পিতার নাম
			{ wch: 15 }, // মাতার নাম
			{ wch: 25 }, // বর্তমান ঠিকানা
			{ wch: 25 }, // স্থায়ী ঠিকানা
			{ wch: 20 }, // পূর্ববর্তী মাদরাসা
			{ wch: 15 }, // শেষ শ্রেণী
			{ wch: 15 }, // ভর্তির শ্রেণী
			{ wch: 15 }, // বিভাগ
			{ wch: 18 }, // অভিভাবকের নাম
			{ wch: 15 }, // অভিভাবকের ফোন
			{ wch: 10 }, // সম্পর্ক
			{ wch: 12 }, // স্ট্যাটাস
			{ wch: 12 }, // আবেদন তারিখ
		];
		ws["!cols"] = colWidths;

		// Add worksheet to workbook
		XLSX.utils.book_append_sheet(wb, ws, "ভর্তি আবেদনসমূহ");

		// Generate filename with current date
		const currentDate = new Date().toISOString().split("T")[0];
		const filename = `ভর্তি_আবেদনসমূহ_${currentDate}.xlsx`;

		// Save file
		XLSX.writeFile(wb, filename);
	};

	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				ভর্তি আবেদনসমূহ দেখুন
			</h2>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-blue-600">১২</div>
					<div className="text-sm text-gray-600">মোট আবেদন</div>
				</div>
				<div className="bg-white p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-green-600">৮</div>
					<div className="text-sm text-gray-600">অনুমোদিত</div>
				</div>
				<div className="bg-white p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-yellow-600">৩</div>
					<div className="text-sm text-gray-600">পেন্ডিং</div>
				</div>
				<div className="bg-white p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-red-600">১</div>
					<div className="text-sm text-gray-600">প্রত্যাখ্যাত</div>
				</div>
			</div>

			{/* Applications Table */}
			<div className="bg-white shadow rounded-lg overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-medium text-gray-900">
						সাম্প্রতিক আবেদনসমূহ
					</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ছাত্র/ছাত্রী
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									শ্রেণী
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									অভিভাবক
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									স্ট্যাটাস
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									আবেদন তারিখ
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									অ্যাকশন
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{mockApplications.map((app) => (
								<tr key={app.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-10 w-10">
												<img
													className="h-10 w-10 rounded-full object-cover"
													src={app.photo}
													alt={app.nameBangla}
												/>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">
													{app.nameBangla}
												</div>
												<div className="text-sm text-gray-500">
													{app.nameEnglish}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{app.admissionClass}
										</div>
										<div className="text-sm text-gray-500">
											{app.admissionDepartment}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{app.guardianName}
										</div>
										<div className="text-sm text-gray-500">
											{app.guardianPhone}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												app.status
											)}`}
										>
											{app.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{app.submittedAt}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex flex-col sm:flex-row gap-2">
											<button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm">
												👁️ দেখুন
											</button>
											<Select
												value={app.status}
												onValueChange={(value) =>
													handleStatusChange(app.id, value)
												}
											>
												<SelectTrigger className="w-24 h-8 text-xs">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="পেন্ডিং">পেন্ডিং</SelectItem>
													<SelectItem value="অনুমোদিত">অনুমোদিত</SelectItem>
													<SelectItem value="প্রত্যাখ্যাত">
														প্রত্যাখ্যাত
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-700">
							১ থেকে ৩ পর্যন্ত দেখানো হচ্ছে (মোট ১২টি)
						</div>
						<div className="flex space-x-2">
							<button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
								পূর্ববর্তী
							</button>
							<button className="px-3 py-1 text-sm bg-green-600 text-white border border-green-600 rounded">
								১
							</button>
							<button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
								২
							</button>
							<button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
								পরবর্তী
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Export Button */}
			<div className="mt-6">
				<Button
					onClick={exportToExcel}
					className="bg-green-600 hover:bg-green-700"
				>
					📊 এক্সেলে এক্সপোর্ট করুন
				</Button>
			</div>
		</div>
	);
}

// Contact Page Forms
function ContactInfoForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				যোগাযোগ পেজ - যোগাযোগ তথ্য সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Hero Section */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">হিরো সেকশন</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className={labelClasses}>শিরোনাম</Label>
							<Input
								type="text"
								defaultValue="আমাদের সাথে যোগাযোগ করুন"
								className={inputClasses}
							/>
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>সাবটাইটেল</Label>
							<Input
								type="text"
								defaultValue="মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসা"
								className={inputClasses}
							/>
						</div>
					</div>
				</div>

				{/* Contact Info Cards */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						যোগাযোগ তথ্য কার্ডস
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[
							{
								title: "আমাদের ঠিকানা",
								details: "ধানাবাড়ি, চাঁদপুর, বাংলাদেশ",
								color: "text-red-600",
							},
							{
								title: "ফোন নম্বর",
								details: "+৮৮০১৭১২-০৫৪৭৬৩",
								color: "text-blue-600",
							},
							{
								title: "ইমেইল",
								details: "nesarahmd763@gmail.com",
								color: "text-green-600",
							},
							{
								title: "অফিস সময়",
								details: "সোম - শুক্র: ৯:০০ AM - ৫:০০ PM",
								color: "text-yellow-600",
							},
						].map((info, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<div className="space-y-2">
									<Label className={labelClasses}>টাইটেল</Label>
									<Input
										type="text"
										defaultValue={info.title}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>বিস্তারিত</Label>
									<Input
										type="text"
										defaultValue={info.details}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>কালার ক্লাস</Label>
									<Input
										type="text"
										defaultValue={info.color}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Departments */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						বিভাগীয় তথ্য
					</h3>
					<div className="space-y-4">
						{[
							{
								name: "ভর্তি বিভাগ",
								phone: "+৮৮০১৭১২-০৫৪৭৬৩",
								email: "admission@markazut.com",
							},
							{
								name: "শিক্ষা বিভাগ",
								phone: "+৮৮০১৭१२-०५४७६३",
								email: "academics@markazut.com",
							},
							{
								name: "প্রশাসনিক বিভাগ",
								phone: "+৮৮০১৭१२-०५४७६३",
								email: "admin@markazut.com",
							},
						].map((dept, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>বিভাগ নাম</Label>
										<Input
											type="text"
											defaultValue={dept.name}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ফোন</Label>
										<Input
											type="text"
											defaultValue={dept.phone}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ইমেইল</Label>
										<Input
											type="text"
											defaultValue={dept.email}
											className={inputClasses}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

function ContactForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				যোগাযোগ পেজ - যোগাযোগ ফর্ম এবং FAQ সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Contact Form Fields */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						যোগাযোগ ফর্ম
					</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className={labelClasses}>ফর্ম টাইটেল</Label>
							<Input
								type="text"
								defaultValue="বার্তা পাঠান"
								className={inputClasses}
							/>
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>সাকসেস মেসেজ</Label>
							<Textarea
								rows={2}
								defaultValue="✓ আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
								className={inputClasses}
							/>
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>বাটন টেক্সট</Label>
							<Input
								type="text"
								defaultValue="বার্তা পাঠান"
								className={inputClasses}
							/>
						</div>
					</div>
				</div>

				{/* FAQ Section */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">FAQ সেকশন</h3>
					<div className="space-y-4">
						{[
							{
								q: "আমরা কখন উপলব্ধ?",
								a: "সোমবার থেকে শুক্রবার সকাল ৯:০০ টা থেকে সন্ধ্যা ৫:০০ টা পর্যন্ত। শনি ও রবিবার বন্ধ।",
							},
							{
								q: "জরুরি যোগাযোগের জন্য?",
								a: "জরুরি বিষয়ের জন্য সরাসরি আমাদের ফোন নম্বরে কল করুন: +৮৮০১৭१२-०५४७६३",
							},
							{
								q: "আমরা কত দ্রুত সাড়া দিই?",
								a: "সাধারণত ২৪ ঘন্টার মধ্যে আমরা আপনার সাথে যোগাযোগ করি।",
							},
							{
								q: "অনলাইন চ্যাট সুবিধা?",
								a: "হ্যাঁ, ইমেইল বা ফেসবুকের মাধ্যমে আপনি আমাদের সাথে লাইভ চ্যাট করতে পারেন।",
							},
						].map((faq, idx) => (
							<div key={idx} className="p-4 border rounded-md space-y-4">
								<div className="space-y-2">
									<Label className={labelClasses}>প্রশ্ন</Label>
									<Input
										type="text"
										defaultValue={faq.q}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>উত্তর</Label>
									<Textarea
										rows={2}
										defaultValue={faq.a}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// About Page Content Form
function AboutContentForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				আমাদের সম্পর্কে পেজ - মূল কনটেন্ট সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Mission & Vision */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						মিশন ও ভিশন
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

				{/* History */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						প্রতিষ্ঠানের ইতিহাস
					</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>ইতিহাস টাইটেল</Label>
							<Input type="text" defaultValue="প্রতিষ্ঠানের ইতিহাস" />
						</div>
						<div className="space-y-2">
							<Label>ইতিহাস প্যারাগ্রাফ ১</Label>
							<Textarea
								rows={2}
								defaultValue="মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসা ২০০৮ সালে প্রতিষ্ঠিত হয় চাঁদপুর জেলার ধানাবাড়িতে। শুরুতে এটি একটি ছোট্ট হিফজ প্রতিষ্ঠান ছিল।"
							/>
						</div>
						<div className="space-y-2">
							<Label>ইতিহাস প্যারাগ্রাফ ২</Label>
							<Textarea
								rows={2}
								defaultValue="দীর্ঘ প্রচেষ্টা এবং নিষ্ঠার মাধ্যমে আজ এটি একটি সুপ্রতিষ্ঠিত শিক্ষা প্রতিষ্ঠানে পরিণত হয়েছে।"
							/>
						</div>
						<div className="space-y-2">
							<Label>ইতিহাস প্যারাগ্রাফ ৩</Label>
							<Textarea
								rows={2}
								defaultValue="আমরা নূরানী থেকে শুরু করে আলিম পর্যন্ত সম্পূর্ণ শিক্ষা কার্যক্রম পরিচালনা করছি।"
							/>
						</div>
					</div>
				</div>

				{/* Statistics */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">অর্জনসমূহ</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[1, 2, 3, 4].map((item) => (
							<div key={item} className="p-4 border rounded-md space-y-4">
								<div className="space-y-2">
									<Label>সংখ্যা</Label>
									<Input
										type="text"
										defaultValue={
											item === 1
												? "১৫+"
												: item === 2
												? "২০০০+"
												: item === 3
												? "৭০+"
												: "৫০০+"
										}
									/>
								</div>
								<div className="space-y-2">
									<Label>লেবেল</Label>
									<Input
										type="text"
										defaultValue={
											item === 1
												? "বছরের অভিজ্ঞতা"
												: item === 2
												? "সফল স্নাতক"
												: item === 3
												? "শিক্ষক ও কর্মচারী"
												: "বর্তমান শিক্ষার্থী"
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Programs */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						শিক্ষা কর্মসূচি
					</h3>
					<div className="space-y-4">
						{[1, 2, 3, 4].map((program) => (
							<div key={program} className="p-4 border rounded-md space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>প্রোগ্রাম নাম</Label>
										<Input
											type="text"
											defaultValue={
												program === 1
													? "নূরানী প্রোগ্রাম"
													: program === 2
													? "হিফজ প্রোগ্রাম"
													: program === 3
													? "দাখিল পাঠ্যক্রম"
													: "আলিম পাঠ্যক্রম"
											}
										/>
									</div>
									<div className="space-y-2">
										<Label>সময়কাল</Label>
										<Input
											type="text"
											defaultValue={
												program === 1
													? "৩ বছর"
													: program === 2
													? "২-৩ বছর"
													: program === 3
													? "৩ বছর"
													: "২ বছর"
											}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label>বর্ণনা</Label>
									<Textarea
										rows={2}
										defaultValue={
											program === 1
												? "কুরআন পড়ার মৌলিক প্রশিক্ষণ এবং আরবি ভাষার প্রাথমিক শিক্ষা।"
												: program === 2
												? "সম্পূর্ণ কুরআন হিফজ করার জন্য নিবিড় প্রোগ্রাম।"
												: program === 3
												? "ইসলামী শিক্ষা এবং আধুনিক জ্ঞানের সমন্বিত পাঠ্যক্রম।"
												: "উচ্চ পর্যায়ের ইসলামী শিক্ষা এবং গবেষণা।"
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Features Section Title */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						বৈশিষ্ট্য সেকশন
					</h3>
					<div className="space-y-2">
						<Label>সেকশন টাইটেল</Label>
						<Input type="text" defaultValue="আমাদের বৈশিষ্ট্য" />
					</div>
				</div>

				{/* Values */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">মূল্যবোধ</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[1, 2, 3, 4].map((value) => (
							<div key={value} className="p-4 border rounded-md space-y-4">
								<div className="space-y-2">
									<Label>টাইটেল</Label>
									<Input
										type="text"
										defaultValue={
											value === 1
												? "সততা"
												: value === 2
												? "মানসম্মত শিক্ষা"
												: value === 3
												? "অন্তর্ভুক্তিমূলক পরিবেশ"
												: "উদ্ভাবন"
										}
									/>
								</div>
								<div className="space-y-2">
									<Label>বর্ণনা</Label>
									<Textarea
										rows={2}
										defaultValue={
											value === 1
												? "আমরা সকল কাজে সততা এবং স্বচ্ছতা বজায় রাখি।"
												: value === 2
												? "উচ্চমানের শিক্ষা প্রদান করা আমাদের প্রথম অগ্রাধিকার।"
												: value === 3
												? "সকল শিক্ষার্থীর জন্য সমান সুযোগ নিশ্চিত করি।"
												: "শিক্ষায় নতুন পদ্ধতি এবং প্রযুক্তি ব্যবহার করি।"
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Facilities */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">সুবিধাসমূহ</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[1, 2, 3, 4, 5, 6].map((facility) => (
							<div key={facility} className="p-4 border rounded-md space-y-4">
								<div className="space-y-2">
									<Label>সুবিধা টাইটেল</Label>
									<Input
										type="text"
										defaultValue={
											facility === 1
												? "আধুনিক ক্লাসরুম"
												: facility === 2
												? "ডিজিটাল লাইব্রেরি"
												: facility === 3
												? "হোস্টেল সুবিধা"
												: facility === 4
												? "খেলার মাঠ"
												: facility === 5
												? "মেডিকেল সেবা"
												: "পরামর্শ সেবা"
										}
									/>
								</div>
								<div className="space-y-2">
									<Label>বর্ণনা</Label>
									<Input
										type="text"
										defaultValue={
											facility === 1
												? "উন্নত প্রযুক্তি সম্পন্ন শিক্ষা কক্ষ"
												: facility === 2
												? "বিস্তৃত ইসলামী জ্ঞানের ভাণ্ডার"
												: facility === 3
												? "নিরাপদ আবাসিক ব্যবস্থা"
												: facility === 4
												? "স্বাস্থ্য ও ফিটনেস কর্মসূচি"
												: facility === 5
												? "২৪ ঘন্টা স্বাস্থ্য সেবা"
												: "শিক্ষার্থী উন্নয়ন পরামর্শ"
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Call to Action */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						কল টু অ্যাকশন
					</h3>
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

// About Page Features Form
function AboutFeaturesForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				আমাদের সম্পর্কে পেজ - বৈশিষ্ট্যসমূহ সম্পাদনা
			</h2>
			<form className="space-y-6">
				{/* Features */}
				<div>
					<h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
						বৈশিষ্ট্যসমূহ
					</h3>
					<div className="space-y-6">
						{[1, 2, 3, 4, 5, 6].map((feature) => (
							<div key={feature} className="p-4 border rounded-md space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>আইকন</Label>
										<Select
											defaultValue={
												feature === 1
													? "BookOpen"
													: feature === 2
													? "Users"
													: feature === 3
													? "Heart"
													: feature === 4
													? "Award"
													: feature === 5
													? "Target"
													: "Lightbulb"
											}
										>
											<SelectTrigger className={selectClasses}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="BookOpen">BookOpen</SelectItem>
												<SelectItem value="Users">Users</SelectItem>
												<SelectItem value="Heart">Heart</SelectItem>
												<SelectItem value="Award">Award</SelectItem>
												<SelectItem value="Target">Target</SelectItem>
												<SelectItem value="Lightbulb">Lightbulb</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>কালার ক্লাস</Label>
										<Select
											defaultValue={
												feature === 1
													? "text-blue-600"
													: feature === 2
													? "text-green-600"
													: feature === 3
													? "text-red-600"
													: feature === 4
													? "text-yellow-600"
													: feature === 5
													? "text-purple-600"
													: "text-orange-600"
											}
										>
											<SelectTrigger className={selectClasses}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="text-blue-600">
													text-blue-600
												</SelectItem>
												<SelectItem value="text-green-600">
													text-green-600
												</SelectItem>
												<SelectItem value="text-red-600">
													text-red-600
												</SelectItem>
												<SelectItem value="text-yellow-600">
													text-yellow-600
												</SelectItem>
												<SelectItem value="text-purple-600">
													text-purple-600
												</SelectItem>
												<SelectItem value="text-orange-600">
													text-orange-600
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
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
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				প্রতিষ্ঠাতার বাণী সম্পাদনা
			</h2>
			<form className="space-y-6">
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

				<Button type="submit">সেভ করুন</Button>
			</form>
		</div>
	);
}

// Testimonial Section Form
function TestimonialForm() {
	return (
		<div>
			<h2 className="text-lg font-medium text-gray-900 mb-6">
				অভিভাবকদের মতামত সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-2">
					<Label>সেকশন টাইটেল</Label>
					<Input
						type="text"
						defaultValue="আমাদের অভিভাবকদের আমাদের সম্পর্কে যা বলেন"
					/>
				</div>

				<div className="space-y-2">
					<Label>সাবটাইটেল</Label>
					<Input
						type="text"
						defaultValue="আমাদের মূল্যবান অভিভাবকদের মতামত এবং অভিজ্ঞতা জানুন"
					/>
				</div>

				{/* Testimonial Items */}
				<div>
					<h3 className="text-md font-medium text-gray-700 mb-4">
						টেস্টিমোনিয়ালস
					</h3>
					{[1, 2].map((item) => (
						<div key={item} className="mb-6 p-4 border rounded-md">
							<h4 className="font-medium mb-4">টেস্টিমোনিয়াল {item}</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>নাম</Label>
									<Input
										type="text"
										defaultValue={item === 1 ? "আতাউর রহমান" : "রাহুলান হোসাইন"}
									/>
								</div>
								<div className="space-y-2">
									<Label>লোকেশন</Label>
									<Input type="text" defaultValue="গাজীপুর" />
								</div>
							</div>
							<div className="mt-4 space-y-2">
								<Label>টেক্সট</Label>
								<Textarea
									rows={3}
									defaultValue={
										item === 1
											? "মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসায় আমার সন্তানকে ভর্তি করে আমরা অত্যন্ত সন্তুষ্ট..."
											: "মারকাজুত তারফিজ ইউনোয়ানানাল মাদ্রাসার শিক্ষা পদ্ধতি অসাধারণ..."
									}
								/>
							</div>
							<div className="mt-4 space-y-2">
								<Label>ইমেজ</Label>
								<Input type="file" accept="image/*" />
							</div>
						</div>
					))}
				</div>

				<Button type="submit">সেভ করুন</Button>
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
