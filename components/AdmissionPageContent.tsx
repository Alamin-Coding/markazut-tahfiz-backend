"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

interface IAdmissionPageData {
	header: {
		title: string;
		subtitle: string;
	};
	infoCards: Array<{
		icon: string;
		title: string;
		subtitle: string;
	}>;
	schedule: {
		online: {
			title: string;
			start: string;
			end: string;
			status: string;
		};
		exam: {
			title: string;
			date: string;
			time: string;
			location: string;
		};
	};
	classes: Array<{
		department: string;
		class: string;
		duration: string;
		fees: string;
		capacity: string;
	}>;
	requirements: string[];
	faq: Array<{
		q: string;
		a: string;
	}>;
	cta: {
		title: string;
		address: string;
		phone: string;
		email: string;
		buttonText: string;
	};
}

const defaultData: IAdmissionPageData = {
	header: {
		title: "ভর্তি তথ্য ও নির্দেশিকা",
		subtitle: "মারকাজুত তাহফিজ ইন্সটিটিউশনাল মাদরাসায় স্বাগতম",
	},
	infoCards: [
		{
			icon: "BookOpen",
			title: "শ্রেণী সমূহ",
			subtitle: "নূরানী থেকে আলিম পর্যন্ত",
		},
		{ icon: "DollarSign", title: "বার্ষিক ফি", subtitle: "২,০০০ - ৫,০০০ টাকা" },
		{
			icon: "Users",
			title: "প্রতি ক্লাসে ধারণক্ষমতা",
			subtitle: "৫০ - ৭৫ জন শিক্ষার্থী",
		},
		{ icon: "Clock", title: "শিক্ষা সময়কাল", subtitle: "২ - ১০ বছর" },
	],
	schedule: {
		online: {
			title: "অনলাইন আবেদন",
			start: "০১ জানুয়ারি",
			end: "৩০ জুন",
			status: "চলমান",
		},
		exam: {
			title: "প্রবেশ পরীক্ষা",
			date: "জুলাই-আগস্ট",
			time: "সকাল ৯:০০ টা",
			location: "প্রধান ক্যাম্পাস",
		},
	},
	classes: [
		{
			department: "হিফজ",
			class: "নূরানী",
			duration: "৩ বছর",
			fees: "৩,০০০ টাকা",
			capacity: "৬০ জন",
		},
		{
			department: "কিতাব",
			class: "প্রথম শ্রেণী",
			duration: "১০ বছর",
			fees: "২,০০০ টাকা",
			capacity: "৫০ জন",
		},
	],
	requirements: [
		"জন্ম নিবন্ধন সার্টিফিকেট",
		"একাডেমিক রেকর্ড (যদি থাকে)",
		"স্বাস্থ্য পরীক্ষার রিপোর্ট",
		"অভিভাবকের পরিচয়পত্র (এনআইডি)",
		"পাসপোর্ট সাইজ ছবি",
	],
	faq: [{ q: "ভর্তির জন্য বয়সের সীমা কত?", a: "নূরানীতে ৫-৭ বছর..." }],
	cta: {
		title: "আমাদের সাথে যোগাযোগ করুন",
		address: "মিরপুর ১০, ঢাকা",
		phone: "+৮৮০১৭१२-०५४७६३",
		email: "tahfizmirpur@gmail.com",
		buttonText: "এখনই আবেদন করুন",
	},
};

export default function AdmissionPageContent() {
	const [data, setData] = useState<IAdmissionPageData>(defaultData);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const res = await fetch("/api/admission-page");
			const json = await res.json();
			if (json.success && json.data) {
				// Merge with default to ensure all fields exist
				const merged = { ...defaultData, ...json.data };
				// Ensure complex nested objects/arrays exist
				merged.schedule = {
					...defaultData.schedule,
					...(json.data.schedule || {}),
				};
				merged.infoCards = json.data.infoCards?.length
					? json.data.infoCards
					: defaultData.infoCards;
				merged.classes = json.data.classes?.length
					? json.data.classes
					: defaultData.classes;
				merged.requirements = json.data.requirements?.length
					? json.data.requirements
					: defaultData.requirements;
				merged.faq = json.data.faq?.length ? json.data.faq : defaultData.faq;

				setData(merged);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const res = await fetch("/api/admission-page", {
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
		section: keyof IAdmissionPageData,
		field: string | null,
		value: any,
		index: number | null = null,
		subfield: string | null = null
	) => {
		setData((prev: any) => {
			const newData = { ...prev };

			if (index !== null && Array.isArray(newData[section])) {
				// Array update
				const arr = [...newData[section]];
				if (subfield) {
					arr[index] = { ...arr[index], [subfield]: value };
				} else {
					arr[index] = value;
				}
				newData[section] = arr;
			} else if (section === "schedule" && field) {
				// Nested schedule update
				newData.schedule = {
					...newData.schedule,
					[field]: { ...newData.schedule[field], [subfield as string]: value },
				};
			} else if (field) {
				// Object update
				newData[section] = { ...newData[section], [field]: value };
			}
			return newData;
		});
	};

	const addArrayItem = (section: keyof IAdmissionPageData, item: any) => {
		setData((prev: any) => ({
			...prev,
			[section]: [...prev[section], item],
		}));
	};

	const removeArrayItem = (
		section: keyof IAdmissionPageData,
		index: number
	) => {
		setData((prev: any) => ({
			...prev,
			[section]: prev[section].filter((_: any, i: number) => i !== index),
		}));
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
				<h1 className="text-2xl font-bold text-gray-800">ভর্তি পেজ এডিটর</h1>
				<Button
					onClick={handleSave}
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
				<h2 className="text-xl font-semibold border-b pb-2">হেডার</h2>
				<div className="space-y-2">
					<Label>টাইটেল</Label>
					<Input
						value={data.header.title}
						onChange={(e) => update("header", "title", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>সাবটাইটেল</Label>
					<Input
						value={data.header.subtitle}
						onChange={(e) => update("header", "subtitle", e.target.value)}
					/>
				</div>
			</div>

			{/* Info Cards */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					ইনফো কার্ডস (৪টি)
				</h2>
				<div className="grid md:grid-cols-2 gap-4">
					{data.infoCards.map((card, i) => (
						<div key={i} className="border p-4 rounded-md space-y-2 bg-gray-50">
							<h4 className="font-medium text-sm text-gray-500">
								কার্ড {i + 1} ({card.icon})
							</h4>
							<div className="space-y-1">
								<Label>টাইটেল</Label>
								<Input
									value={card.title}
									onChange={(e) =>
										update("infoCards", null, e.target.value, i, "title")
									}
								/>
							</div>
							<div className="space-y-1">
								<Label>সাবটাইটেল (ভ্যালু)</Label>
								<Input
									value={card.subtitle}
									onChange={(e) =>
										update("infoCards", null, e.target.value, i, "subtitle")
									}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Schedule */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">ভর্তি সময়সূচী</h2>
				<div className="grid md:grid-cols-2 gap-6">
					{/* Online */}
					<div className="border p-4 rounded-md space-y-3">
						<h3 className="font-medium text-blue-600">অনলাইন আবেদন</h3>
						<div className="space-y-2">
							<Label>শুরু</Label>
							<Input
								value={data.schedule.online.start}
								onChange={(e) =>
									update("schedule", "online", e.target.value, null, "start")
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>শেষ</Label>
							<Input
								value={data.schedule.online.end}
								onChange={(e) =>
									update("schedule", "online", e.target.value, null, "end")
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>স্ট্যাটাস</Label>
							<Input
								value={data.schedule.online.status}
								onChange={(e) =>
									update("schedule", "online", e.target.value, null, "status")
								}
							/>
						</div>
					</div>
					{/* Exam */}
					<div className="border p-4 rounded-md space-y-3">
						<h3 className="font-medium text-green-600">প্রবেশ পরীক্ষা</h3>
						<div className="space-y-2">
							<Label>তারিখ</Label>
							<Input
								value={data.schedule.exam.date}
								onChange={(e) =>
									update("schedule", "exam", e.target.value, null, "date")
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>সময়</Label>
							<Input
								value={data.schedule.exam.time}
								onChange={(e) =>
									update("schedule", "exam", e.target.value, null, "time")
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>স্থান</Label>
							<Input
								value={data.schedule.exam.location}
								onChange={(e) =>
									update("schedule", "exam", e.target.value, null, "location")
								}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Classes Table */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					শ্রেণী ও ফি তালিকা
				</h2>
				<div className="space-y-4">
					{data.classes.map((cls, i) => (
						<div key={i} className="flex gap-4 items-end border-b pb-4">
							<div className="flex-1 space-y-1">
								<Label>বিভাগ</Label>
								<Input
									value={cls.department}
									onChange={(e) =>
										update("classes", null, e.target.value, i, "department")
									}
								/>
							</div>
							<div className="flex-1 space-y-1">
								<Label>শ্রেণী</Label>
								<Input
									value={cls.class}
									onChange={(e) =>
										update("classes", null, e.target.value, i, "class")
									}
								/>
							</div>
							<div className="flex-1 space-y-1">
								<Label>মেয়াদ</Label>
								<Input
									value={cls.duration}
									onChange={(e) =>
										update("classes", null, e.target.value, i, "duration")
									}
								/>
							</div>
							<div className="flex-1 space-y-1">
								<Label>বার্ষিক ফি</Label>
								<Input
									value={cls.fees}
									onChange={(e) =>
										update("classes", null, e.target.value, i, "fees")
									}
								/>
							</div>
							<div className="flex-1 space-y-1">
								<Label>ধারণক্ষমতা</Label>
								<Input
									value={cls.capacity}
									onChange={(e) =>
										update("classes", null, e.target.value, i, "capacity")
									}
								/>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="text-red-500 mb-1"
								onClick={() => removeArrayItem("classes", i)}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={() =>
						addArrayItem("classes", {
							department: "",
							class: "নতুন শ্রেণী",
							duration: "",
							fees: "",
							capacity: "",
						})
					}
				>
					<Plus className="w-4 h-4 mr-2" /> শ্রেণী যোগ করুন
				</Button>
			</div>

			{/* Requirements */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					প্রয়োজনীয় ডকুমেন্টস
				</h2>
				<div className="space-y-2">
					{data.requirements.map((req, i) => (
						<div key={i} className="flex gap-2">
							<Input
								value={req}
								onChange={(e) =>
									update("requirements", null, e.target.value, i)
								}
							/>
							<Button
								variant="ghost"
								size="icon"
								className="text-red-500"
								onClick={() => removeArrayItem("requirements", i)}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={() => addArrayItem("requirements", "")}
				>
					<Plus className="w-4 h-4 mr-2" /> ডকুমেন্ট যোগ করুন
				</Button>
			</div>

			{/* FAQ */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					FAQ (প্রশ্ন ও উত্তর)
				</h2>
				<div className="space-y-4">
					{data.faq.map((item, i) => (
						<div
							key={i}
							className="border p-4 rounded-md space-y-2 relative bg-gray-50"
						>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2 text-red-500"
								onClick={() => removeArrayItem("faq", i)}
							>
								<Trash2 className="w-3 h-3" />
							</Button>
							<div className="space-y-1">
								<Label>প্রশ্ন</Label>
								<Input
									value={item.q}
									onChange={(e) => update("faq", null, e.target.value, i, "q")}
									className="font-semibold"
								/>
							</div>
							<div className="space-y-1">
								<Label>উত্তর</Label>
								<Textarea
									value={item.a}
									onChange={(e) => update("faq", null, e.target.value, i, "a")}
									rows={2}
								/>
							</div>
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={() =>
						addArrayItem("faq", { q: "নতুন প্রশ্ন?", a: "উত্তর লিখুন" })
					}
				>
					<Plus className="w-4 h-4 mr-2" /> প্রশ্ন যোগ করুন
				</Button>
			</div>

			{/* CTA / Contact */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					ফুটার / যোগাযোগ (CTA)
				</h2>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>সেকশন টাইটেল</Label>
						<Input
							value={data.cta.title}
							onChange={(e) => update("cta", "title", e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label>বাটন টেক্সট</Label>
						<Input
							value={data.cta.buttonText}
							onChange={(e) => update("cta", "buttonText", e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label>ঠিকানা</Label>
						<Input
							value={data.cta.address}
							onChange={(e) => update("cta", "address", e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label>ফোন</Label>
						<Input
							value={data.cta.phone}
							onChange={(e) => update("cta", "phone", e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label>ইমেইল</Label>
						<Input
							value={data.cta.email}
							onChange={(e) => update("cta", "email", e.target.value)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
