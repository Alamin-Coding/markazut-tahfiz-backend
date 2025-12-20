"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface IDepartmentPageData {
	header: {
		title: string;
		subtitle1: string;
		subtitle2: string;
	};
	intro: {
		title: string;
		description: string;
	};
	departments: Array<{
		name: string;
		description: string;
		icon: string;
		color: string;
		details: string;
		features: string[];
		targetAudience: string;
	}>;
	stats: {
		title: string;
		items: Array<{
			count: string;
			label: string;
		}>;
	};
	features: Array<{
		title: string;
		icon: string;
		items: string[];
	}>;
	cta: {
		title: string;
		description: string;
		buttonText: string;
	};
}

const defaultData: IDepartmentPageData = {
	header: {
		title: "আমাদের বিভাগসমূহ",
		subtitle1: "মারকাজুত তাহফীজ ইউটিবোয়ানানাল মাদরাসা",
		subtitle2: "উন্নত শিক্ষা ও ইসলামিক জ্ঞানের কেন্দ্র",
	},
	intro: {
		title: "আমাদের শিক্ষামূলক বিভাগ",
		description:
			"আমরা শিক্ষার্থীদের বিভিন্ন স্তর এবং আগ্রহ অনুযায়ী বিশেষায়িত শিক্ষা প্রদান করি।",
	},
	departments: [
		{
			name: "কিতাব বিভাগ",
			description: "উচ্চ মানের ইসলামিক শিক্ষা প্রদান করা হয়",
			icon: "📚",
			color: "from-blue-500 to-blue-600",
			details:
				"এই বিভাগে কোরআন, হাদিস এবং ইসলামিক জ্ঞানের উপর গভীর শিক্ষা প্রদান করা হয়। দাওরায়ে হাদিস পর্যন্ত পাঠদান করা হয়।",
			features: [
				"অভিজ্ঞ মুহাদ্দিস দ্বারা পাঠদান",
				"সমৃদ্ধ কুতুবখানা ও লাইব্রেরি",
				"গবেষণামূলক শিক্ষা পদ্ধতি",
				"মাসিক সেমিনার ও বিতর্ক প্রতিযোগিতা",
			],
			targetAudience:
				"যারা আলিম হয়ে দ্বীনের খেদমত করতে চায় এবং ইসলামিক স্কলার হিসেবে নিজেকে গড়ে তুলতে চায়।",
		},
		{
			name: "মক্তব বিভাগ",
			description: "প্রাথমিক স্তরের শিক্ষার্থীদের জন্য",
			icon: "🏫",
			color: "from-green-500 to-green-600",
			details:
				"শুরুআতী বয়সের শিশুদের কোরআন এবং মৌলিক ইসলামিক শিক্ষা প্রদান করা হয়। নূরানী পদ্ধতিতে অত্যন্ত যগুলোর সাথে পাঠদান।",
			features: [
				"নূরানী পদ্ধতিতে কুরআন শিক্ষা",
				"তাজবীদ ও মাখরাজ প্রশিক্ষণ",
				"আদব-আখলাক ও ওযু-নামাজ শিক্ষা",
				"সুন্দর হাতের লেখা অনুশীলন",
			],
			targetAudience:
				"৪ থেকে ৮ বছর বয়সী শিশু যারা সহীহ শুদ্ধভাবে কুরআন মাজীদ শিখতে শুরু করতে চায়।",
		},
		{
			name: "মক্তব (বালিকা)",
			description: "বালিকা শিক্ষার্থীদের জন্য আলাদা বিভাগ",
			icon: "👧",
			color: "from-pink-500 to-pink-600",
			details:
				"বালিকা শিক্ষার্থীদের জন্য বিশেষভাবে পরিচালিত মক্তব বিভাগ। সম্পূর্ণ পর্দার সাথে পাঠদান করা হয়।",
			features: [
				"সার্বক্ষণিক মহিলা শিক্ষিকা",
				"সম্পূর্ণ পর্দানশীন পরিবেশ",
				"নিরাপদ ও ঘরোয়া পরিবেশ",
				"দ্বীনি বুনিয়াদী শিক্ষা",
			],
			targetAudience:
				"শিশু ও কিশোরী বালিকাদের জন্য যারা নিরাপদ পরিবেশে দ্বীনি শিক্ষা গ্রহণ করতে চায়।",
		},
		{
			name: "হিফয বিভাগ",
			description: "কোরআন সংরক্ষণকারী প্রোগ্রাম",
			icon: "✨",
			color: "from-purple-500 to-purple-600",
			details:
				"কোরআন মুখস্থ করার জন্য বিশেষায়িত প্রশিক্ষণ প্রদান করা হয়। আন্তর্জাতিক মানের হাফেজ গড়ার লক্ষ্যে নিবিড় পরিচর্যা।",
			features: [
				"আন্তর্জাতিক মানের হাফেজ শিক্ষক",
				"তিলাওয়াত ও তাজবীদ মশক",
				"৩ বছরে হিফজ সম্পন্ন করার পরিকল্পনা",
				"২৪ ঘন্টা নিবিড় তত্ত্বাবধান",
			],
			targetAudience:
				"মেধাবী ছাত্ররা যারা মহান আল্লাহর পবিত্র কুরআন সিনায় ধারণ করে হাফেজে কুরআন হতে চায়।",
		},
		{
			name: "হিফয (বালিকা)",
			description: "বালিকা হিফয শিক্ষার্থীদের জন্য",
			icon: "💎",
			color: "from-rose-500 to-rose-600",
			details:
				"বালিকা শিক্ষার্থীদের জন্য কোরআন হিফয প্রোগ্রাম। সম্পূর্ণ আলাদা ক্যাম্পাসে মহিলা হাফেজাদের তত্ত্বাবধানে পরিচালিত।",
			features: [
				"মহিলা হাফেজা দ্বারা পাঠদান",
				"পৃথক ও সুরক্ষিত আবাসন",
				"হিফজের পাশাপাশি মাসয়ালা শিক্ষা",
				"মানসম্মত খাবার ও চিকিৎসা",
			],
			targetAudience:
				"যেসব বালিকারা হাফেজা হতে চায় এবং দ্বীনের আলোয় জীবন গড়তে চায়।",
		},
		{
			name: "জেনারেল (১ম - ৫ম)",
			description: "সাধারণ শিক্ষা কর্মসূচি",
			icon: "🎓",
			color: "from-amber-500 to-amber-600",
			details:
				"প্রথম থেকে পঞ্চম শ্রেণীর সাধারণ শিক্ষা কর্মসূচি পরিচালিত হয়। মাদরাসা শিক্ষার পাশাপাশি আধুনিক স্কুল শিক্ষা।",
			features: [
				"সরকারি সিলেবাস অনুসরণ",
				"অভিজ্ঞ স্কুল শিক্ষক",
				"কম্পিউটার ও ইংরেজি শিক্ষা",
				"মেধাবীদের জন্য বিশেষ বৃত্তি",
			],
			targetAudience:
				"যারা দ্বীনি শিক্ষার পাশাপাশি জাগতিক শিক্ষায় সমানভাবে দক্ষ হতে চায়।",
		},
	],
	stats: {
		title: "আমাদের প্রতিষ্ঠানের পরিসংখ্যান",
		items: [
			{ count: "৫০+", label: "অভিজ্ঞ শিক্ষক" },
			{ count: "১০০০+", label: "শিক্ষার্থী" },
			{ count: "৬+", label: "বিভাগ" },
			{ count: "২৫+", label: "বছরের অভিজ্ঞতা" },
		],
	},
	features: [
		{
			title: "আমাদের শেখার পদ্ধতি",
			icon: "BookOpen",
			items: [
				"ঐতিহ্যবাহী ও আধুনিক শিক্ষা পদ্ধতির সমন্বয়",
				"ব্যক্তিগত মনোযোগ এবং পরিচর্যা",
				"নিয়মিত মূল্যায়ন এবং অগ্রগতি ট্র্যাকিং",
				"নৈতিক ও আধ্যাত্মিক উন্নয়নে ফোকাস",
			],
		},
		{
			title: "প্রশিক্ষণ কর্মসূচি",
			icon: "Users",
			items: [
				"কোরআন তিলাওয়াত এবং তাজবিদ",
				"ইসলামিক অধ্যয়ন এবং হাদিস",
				"আরবি ভাষা শিক্ষা",
				"সাধারণ একাডেমিক বিষয়",
			],
		},
	],
	cta: {
		title: "আপনার সন্তানকে ভর্তি করান",
		description: "আমাদের যেকোনো বিভাগে এখনই যোগাযোগ করুন",
		buttonText: "যোগাযোগ করুন",
	},
};

export default function DepartmentsContent() {
	const [data, setData] = useState<IDepartmentPageData>(defaultData);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const res = await fetch("/api/departments");
			const json = await res.json();
			if (json.success && json.data && Object.keys(json.data).length > 0) {
				const mergedData = { ...defaultData, ...json.data };
				// Ensure arrays
				mergedData.departments = mergedData.departments || [];
				mergedData.stats = mergedData.stats || { title: "", items: [] };
				mergedData.features = mergedData.features || [];
				setData(mergedData);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		setSaving(true);
		try {
			const res = await fetch("/api/departments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const json = await res.json();
			if (json.success) {
				toast.success("Changes saved successfully");
			} else {
				toast.error(json.message || "Failed to save");
			}
		} catch (error) {
			toast.error("Error saving data");
		} finally {
			setSaving(false);
		}
	};

	const update = (
		section: keyof IDepartmentPageData,
		field: string | null,
		value: any,
		index: number | null = null,
		subfield: string | null = null
	) => {
		setData((prev) => {
			const newData = { ...prev };
			const sectionData = newData[section] as any;

			if (index !== null) {
				// Handling array updates
				if (field && Array.isArray(sectionData[field])) {
					// Nested array update (e.g., feature items)
					const arr = [...sectionData[field]];
					arr[index] = value; // Direct value update for string array
					(newData as any)[section] = { ...sectionData, [field]: arr };
				} else if (Array.isArray(sectionData)) {
					// Direct array of objects update (e.g., departments list)
					const arr = [...sectionData];
					if (subfield) {
						arr[index] = { ...arr[index], [subfield]: value };
					} else {
						arr[index] = value;
					}
					(newData as any)[section] = arr;
				} else if (section === "stats" && field === "items") {
					// Special case for stats items
					const arr = [...sectionData.items];
					if (subfield) {
						arr[index] = { ...arr[index], [subfield]: value };
					}
					(newData as any).stats = { ...sectionData, items: arr };
				} else if (section === "features" && subfield === "items") {
					// Special handling for features items array
					const features = [...newData.features];
					const feature = { ...features[index] };
					// value would be the whole items array or specific item?
					// Let's assume we handle inner item update differently or pass the whole array
					// Here complexity increases. Let's make a specific handler for feature items if needed.
				}
			} else if (field) {
				// Object field update
				(newData as any)[section] = {
					...(newData as any)[section],
					[field]: value,
				};
			}
			return newData;
		});
	};

	// Helper for features items
	const updateFeatureItem = (
		featureIndex: number,
		itemIndex: number,
		value: string
	) => {
		setData((prev) => {
			const newFeatures = [...prev.features];
			const newItems = [...newFeatures[featureIndex].items];
			newItems[itemIndex] = value;
			newFeatures[featureIndex] = {
				...newFeatures[featureIndex],
				items: newItems,
			};
			return { ...prev, features: newFeatures };
		});
	};

	const addFeatureItem = (featureIndex: number) => {
		setData((prev) => {
			const newFeatures = [...prev.features];
			newFeatures[featureIndex] = {
				...newFeatures[featureIndex],
				items: [...newFeatures[featureIndex].items, "নতুন পয়েন্ট"],
			};
			return { ...prev, features: newFeatures };
		});
	};

	const removeFeatureItem = (featureIndex: number, itemIndex: number) => {
		setData((prev) => {
			const newFeatures = [...prev.features];
			newFeatures[featureIndex] = {
				...newFeatures[featureIndex],
				items: newFeatures[featureIndex].items.filter(
					(_, i) => i !== itemIndex
				),
			};
			return { ...prev, features: newFeatures };
		});
	};

	const addArrayItem = (
		section: keyof IDepartmentPageData,
		item: any,
		subKey?: string
	) => {
		setData((prev) => {
			if (section === "stats") {
				return {
					...prev,
					stats: {
						...prev.stats,
						items: [...prev.stats.items, item],
					},
				};
			}
			if (Array.isArray(prev[section])) {
				return {
					...prev,
					[section]: [...(prev[section] as any[]), item],
				};
			}
			return prev;
		});
	};

	const removeArrayItem = (
		section: keyof IDepartmentPageData,
		index: number,
		subKey?: string
	) => {
		setData((prev) => {
			if (section === "stats") {
				return {
					...prev,
					stats: {
						...prev.stats,
						items: prev.stats.items.filter((_, i) => i !== index),
					},
				};
			}
			if (Array.isArray(prev[section])) {
				return {
					...prev,
					[section]: (prev[section] as any[]).filter((_, i) => i !== index),
				};
			}
			return prev;
		});
	};

	if (loading)
		return (
			<div className="flex justify-center p-8">
				<Loader2 className="animate-spin w-8 h-8 text-green-600" />
			</div>
		);

	return (
		<div className="space-y-8 pb-10">
			<div className="flex justify-between items-center bg-white p-4 sticky top-0 z-10 shadow-sm rounded-md">
				<h1 className="text-2xl font-bold text-gray-800">
					বিভাগসমূহ পেজ এডিটর
				</h1>
				<Button
					onClick={() => handleSave()}
					disabled={saving}
					className="bg-green-600 hover:bg-green-700 text-white"
				>
					{saving ? (
						<Loader2 className="animate-spin w-4 h-4 mr-2" />
					) : (
						<Save className="w-4 h-4 mr-2" />
					)}
					সেভ করুন
				</Button>
			</div>

			{/* Header */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">হেডার সেকশন</h2>
				<div className="space-y-2">
					<Label>টাইটেল</Label>
					<Input
						value={data.header.title}
						onChange={(e) => update("header", "title", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>সাবটাইটেল ১</Label>
					<Input
						value={data.header.subtitle1}
						onChange={(e) => update("header", "subtitle1", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>সাবটাইটেল ২</Label>
					<Input
						value={data.header.subtitle2}
						onChange={(e) => update("header", "subtitle2", e.target.value)}
					/>
				</div>
			</div>

			{/* Intro */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">ইন্ট্রো সেকশন</h2>
				<div className="space-y-2">
					<Label>টাইটেল</Label>
					<Input
						value={data.intro.title}
						onChange={(e) => update("intro", "title", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>বর্ণনা</Label>
					<Textarea
						value={data.intro.description}
						onChange={(e) => update("intro", "description", e.target.value)}
					/>
				</div>
			</div>

			{/* Departments */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">বিভাগ তালিকা</h2>
				<div className="grid md:grid-cols-2 gap-4">
					{data.departments.map((dept, i) => (
						<div
							key={i}
							className="border p-4 rounded-md space-y-3 relative bg-gray-50"
						>
							<Button
								variant="destructive"
								size="icon"
								className="absolute top-2 right-2 h-6 w-6"
								onClick={() => removeArrayItem("departments", i)}
							>
								<Trash2 className="w-3 h-3" />
							</Button>
							<div className="space-y-2">
								<Label>নাম</Label>
								<Input
									value={dept.name}
									onChange={(e) =>
										update("departments", null, e.target.value, i, "name")
									}
									className="font-bold"
								/>
							</div>
							<div className="grid grid-cols-[1fr_auto] gap-2">
								<div className="space-y-2">
									<Label>আইকন (ইমোজি) Press (win + .) or (cmd + .)</Label>
									<Input
										value={dept.icon}
										onChange={(e) =>
											update("departments", null, e.target.value, i, "icon")
										}
									/>
								</div>
								<div className="space-y-2">
									<Label>কালার থিম</Label>
									<Select
										value={dept.color}
										onValueChange={(val) =>
											update("departments", null, val, i, "color")
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Theme" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="card-blue">Blue</SelectItem>
											<SelectItem value="card-green">Green</SelectItem>
											<SelectItem value="card-pink">Pink</SelectItem>
											<SelectItem value="card-purple">Purple</SelectItem>
											<SelectItem value="card-rose">Rose</SelectItem>
											<SelectItem value="card-amber">Amber</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-2">
								<Label>সংক্ষিপ্ত বর্ণনা</Label>
								<Input
									value={dept.description}
									onChange={(e) =>
										update(
											"departments",
											null,
											e.target.value,
											i,
											"description"
										)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>বিস্তারিত</Label>
								<Textarea
									value={dept.details}
									onChange={(e) =>
										update("departments", null, e.target.value, i, "details")
									}
									rows={2}
								/>
							</div>
							<div className="space-y-2">
								<Label>কাদের জন্য (Target Audience)</Label>
								<Textarea
									value={dept.targetAudience}
									onChange={(e) =>
										update(
											"departments",
											null,
											e.target.value,
											i,
											"targetAudience"
										)
									}
									rows={2}
								/>
							</div>
							<div className="space-y-2">
								<Label>বৈশিষ্ট্যসমূহ (Features) - কমা দিয়ে আলাদা করুন</Label>
								<Textarea
									value={dept.features ? dept.features.join(", ") : ""}
									onChange={(e) =>
										update(
											"departments",
											null,
											e.target.value.split(",").map((s) => s.trim()),
											i,
											"features"
										)
									}
									placeholder="দক্ষ শিক্ষক, আধুনিক উপকরণ, নিয়মিত ক্লাস"
									rows={2}
								/>
							</div>
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={() =>
						addArrayItem("departments", {
							name: "",
							description: "",
							icon: "📚",
							color: "from-blue-500 to-blue-600",
							details: "",
						})
					}
				>
					<Plus className="w-4 h-4 mr-2" /> বিভাগ যোগ করুন
				</Button>
			</div>

			{/* Statistics */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">পরিসংখ্যান</h2>
				<div className="space-y-2 mb-4">
					<Label>সেকশন টাইটেল</Label>
					<Input
						value={data.stats.title}
						onChange={(e) => update("stats", "title", e.target.value)}
					/>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{data.stats.items.map((item, i) => (
						<div
							key={i}
							className="border p-4 rounded-md space-y-2 relative text-center"
						>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-0 right-0 h-5 w-5 text-red-500"
								onClick={() => removeArrayItem("stats", i)}
							>
								<Trash2 className="w-3 h-3" />
							</Button>
							<Label>সংখ্যা (৫০+)</Label>
							<Input
								className="text-center font-bold"
								value={item.count}
								onChange={(e) =>
									update("stats", null, e.target.value, i, "count")
								}
							/>
							<Label>লেবেল</Label>
							<Input
								className="text-center text-sm"
								value={item.label}
								onChange={(e) =>
									update("stats", null, e.target.value, i, "label")
								}
							/>
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={() => addArrayItem("stats", { count: "00+", label: "নতুন" })}
				>
					<Plus className="w-4 h-4 mr-2" /> পরিসংখ্যান যোগ করুন
				</Button>
			</div>

			{/* Features / Learning Methods */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					বৈশিষ্ট্য ও কর্মসূচি
				</h2>
				<div className="grid md:grid-cols-2 gap-6">
					{data.features.map((feature, i) => (
						<div
							key={i}
							className="border p-4 rounded-md space-y-4 bg-gray-50 relative"
						>
							<Button
								variant="destructive"
								size="icon"
								className="absolute top-2 right-2 h-6 w-6"
								onClick={() => removeArrayItem("features", i)}
							>
								<Trash2 className="w-3 h-3" />
							</Button>
							<div className="space-y-2">
								<Label>ব্লক টাইটেল</Label>
								<Input
									value={feature.title}
									onChange={(e) =>
										update("features", null, e.target.value, i, "title")
									}
									className="font-bold"
								/>
							</div>
							<div className="space-y-2">
								<Label>আইকন টাইপ</Label>
								<Select
									value={feature.icon}
									onValueChange={(val) =>
										update("features", null, val, i, "icon")
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Icon" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="BookOpen">BookOpen (বই)</SelectItem>
										<SelectItem value="Users">Users (ব্যবহারকারী)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>পয়েন্টসমূহ</Label>
								<div className="space-y-2">
									{feature.items.map((item, idx) => (
										<div key={idx} className="flex gap-2">
											<Input
												value={item}
												onChange={(e) =>
													updateFeatureItem(i, idx, e.target.value)
												}
												className="h-8 text-sm"
											/>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-red-500"
												onClick={() => removeFeatureItem(i, idx)}
											>
												<Trash2 className="w-3 h-3" />
											</Button>
										</div>
									))}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => addFeatureItem(i)}
									className="w-full text-xs"
								>
									<Plus className="w-3 h-3 mr-1" /> পয়েন্ট যোগ করুন
								</Button>
							</div>
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={() =>
						addArrayItem("features", {
							title: "নতুন সেকশন",
							icon: "BookOpen",
							items: ["পয়েন্ট ১"],
						})
					}
				>
					<Plus className="w-4 h-4 mr-2" /> সেকশন যোগ করুন
				</Button>
			</div>

			{/* CTA */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">কল টু অ্যাকশন</h2>
				<div className="space-y-2">
					<Label>টাইটেল</Label>
					<Input
						value={data.cta.title}
						onChange={(e) => update("cta", "title", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>বর্ণনা</Label>
					<Textarea
						value={data.cta.description}
						onChange={(e) => update("cta", "description", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>বাটন টেক্সট</Label>
					<Input
						value={data.cta.buttonText}
						onChange={(e) => update("cta", "buttonText", e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}
