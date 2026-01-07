"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
	Loader2,
	Plus,
	Trash2,
	Save,
	MapPin,
	Phone,
	Mail,
	Clock,
} from "lucide-react";

interface IContactPageData {
	header: {
		title: string;
		subtitle: string;
	};
	contactInfo: Array<{
		icon: string;
		title: string;
		details: string;
		color: string;
	}>;
	mapUrl: string;
	departments: Array<{
		name: string;
		phone: string;
		email: string;
	}>;
	quickInfo: {
		title: string;
		description: string;
		socials: {
			facebook: string;
			twitter: string;
			linkedin: string;
		};
	};
}

const defaultData: IContactPageData = {
	header: {
		title: "আমাদের সাথে যোগাযোগ করুন",
		subtitle: "মারকাজুত তাহফিজ ইন্সটিটিউশনাল মাদরাসা",
	},
	contactInfo: [
		{
			icon: "MapPin",
			title: "আমাদের ঠিকানা",
			details: "মিরপুর ১০, ঢাকা",
			color: "text-red-600",
		},
		{
			icon: "Phone",
			title: "ফোন নম্বর",
			details: "+৮৮০১৭१२-०५४७६३",
			color: "text-blue-600",
		},
		{
			icon: "Mail",
			title: "ইমেইল",
			details: "tahfizmirpur@gmail.com",
			color: "text-green-600",
		},
		{
			icon: "Clock",
			title: "অফিস সময়",
			details: "সোম - শুক্র: ৯:০০ AM - ৫:০০ PM",
			color: "text-yellow-600",
		},
	],
	mapUrl: "https://www.google.com/maps/embed?pb=...",
	departments: [
		{ name: "ভর্তি বিভাগ", phone: "+৮৮০১৭...", email: "admission@..." },
		{ name: "শিক্ষা বিভাগ", phone: "+৮৮০১৭...", email: "academics@..." },
	],
	quickInfo: {
		title: "আমরা সবসময় আপনার সেবায় প্রস্তুত",
		description:
			"আপনার যেকোনো প্রশ্ন, পরামর্শ বা অভিযোগের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা ২৪ ঘন্টার মধ্যে আপনার জবাব দেব।",
		socials: { facebook: "#", twitter: "#", linkedin: "#" },
	},
};

export default function ContactPageContent() {
	const [data, setData] = useState<IContactPageData>(defaultData);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const res = await fetch("/api/contact-page");
			const json = await res.json();
			if (json.success && json.data) {
				const merged = { ...defaultData, ...json.data };
				merged.contactInfo = json.data.contactInfo?.length
					? json.data.contactInfo
					: defaultData.contactInfo;
				merged.departments = json.data.departments?.length
					? json.data.departments
					: defaultData.departments;
				// Ensure quickInfo structure exists if not in DB
				merged.quickInfo = {
					...defaultData.quickInfo,
					...(json.data.quickInfo || {}),
				};
				merged.quickInfo.socials = {
					...defaultData.quickInfo.socials,
					...(json.data.quickInfo?.socials || {}),
				};

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
			const res = await fetch("/api/contact-page", {
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
		section: keyof IContactPageData,
		field: string | null,
		value: any,
		index: number | null = null,
		subfield: string | null = null
	) => {
		setData((prev: any) => {
			const newData = { ...prev };

			if (index !== null && Array.isArray(newData[section])) {
				const arr = [...newData[section]];
				if (subfield) {
					arr[index] = { ...arr[index], [subfield]: value };
				} else {
					arr[index] = value;
				}
				newData[section] = arr;
			} else if (field) {
				if (section === "header") {
					newData.header = { ...newData.header, [field]: value };
				} else if (section === "quickInfo") {
					if (field === "socials" && subfield) {
						newData.quickInfo = {
							...newData.quickInfo,
							socials: { ...newData.quickInfo.socials, [subfield]: value },
						};
					} else {
						newData.quickInfo = { ...newData.quickInfo, [field]: value };
					}
				} else {
					newData[section] = value;
				}
			}
			return newData;
		});
	};

	const addArrayItem = (section: keyof IContactPageData, item: any) => {
		setData((prev: any) => ({
			...prev,
			[section]: [...prev[section], item],
		}));
	};

	const removeArrayItem = (section: keyof IContactPageData, index: number) => {
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
				<h1 className="text-2xl font-bold text-gray-800">যোগাযোগ পেজ এডিটর</h1>
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

			{/* Contact Info Cards */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					যোগাযোগ তথ্য (কার্ডস)
				</h2>
				<div className="grid md:grid-cols-2 gap-4">
					{data.contactInfo.map((info, i) => (
						<div key={i} className="border p-4 rounded-md space-y-2 bg-gray-50">
							<h4 className="font-medium text-sm text-gray-500">
								কার্ড {i + 1} ({info.icon})
							</h4>
							<div className="space-y-1">
								<Label>টাইটেল</Label>
								<Input
									value={info.title}
									onChange={(e) =>
										update("contactInfo", null, e.target.value, i, "title")
									}
								/>
							</div>
							<div className="space-y-1">
								<Label>বিস্তারিত (ভ্যালু)</Label>
								<Input
									value={info.details}
									onChange={(e) =>
										update("contactInfo", null, e.target.value, i, "details")
									}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Map URL */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">গুগল ম্যাপ</h2>
				<div className="space-y-2">
					<Label>Map Embed URL (src)</Label>
					<Textarea
						value={data.mapUrl}
						onChange={(e) => update("mapUrl", "mapUrl", e.target.value)}
					/>
					<p className="text-xs text-gray-500">
						Google Maps &gt; Share &gt; Embed a map &gt; Copy HTML &gt; Extract
						the 'src' attribute value only.
					</p>
				</div>
			</div>

			{/* Quick Info (Side Text) */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">
					কুইক ইনফো (ম্যাপের পাশে)
				</h2>
				<div className="space-y-2">
					<Label>টাইটেল</Label>
					<Input
						value={data.quickInfo.title}
						onChange={(e) => update("quickInfo", "title", e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label>বিবরণ</Label>
					<Textarea
						value={data.quickInfo.description}
						onChange={(e) => update("quickInfo", "description", e.target.value)}
						rows={3}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label>Facebook Link</Label>
						<Input
							value={data.quickInfo.socials.facebook}
							onChange={(e) =>
								update("quickInfo", "socials", e.target.value, null, "facebook")
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Twitter Link</Label>
						<Input
							value={data.quickInfo.socials.twitter}
							onChange={(e) =>
								update("quickInfo", "socials", e.target.value, null, "twitter")
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>LinkedIn Link</Label>
						<Input
							value={data.quickInfo.socials.linkedin}
							onChange={(e) =>
								update("quickInfo", "socials", e.target.value, null, "linkedin")
							}
						/>
					</div>
				</div>
			</div>

			{/* Departments */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">বিভাগীয় তথ্য</h2>
				<div className="space-y-4">
					{data.departments.map((dept, i) => (
						<div key={i} className="flex gap-4 items-end border-b pb-4">
							<div className="flex-1 space-y-1">
								<Label>বিভাগ</Label>
								<Input
									value={dept.name}
									onChange={(e) =>
										update("departments", null, e.target.value, i, "name")
									}
								/>
							</div>
							<div className="flex-1 space-y-1">
								<Label>ফোন</Label>
								<Input
									value={dept.phone}
									onChange={(e) =>
										update("departments", null, e.target.value, i, "phone")
									}
								/>
							</div>
							<div className="flex-1 space-y-1">
								<Label>ইমেইল</Label>
								<Input
									value={dept.email}
									onChange={(e) =>
										update("departments", null, e.target.value, i, "email")
									}
								/>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="text-red-500 mb-1"
								onClick={() => removeArrayItem("departments", i)}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={() =>
						addArrayItem("departments", {
							name: "নতুন বিভাগ",
							phone: "",
							email: "",
						})
					}
				>
					<Plus className="w-4 h-4 mr-2" /> বিভাগ যোগ করুন
				</Button>
			</div>

			{/* FAQ Settings */}
			<div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
				<h2 className="text-xl font-semibold border-b pb-2">FAQ সেটিংস</h2>
				<div className="space-y-4">
					<div className="p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
						<p className="text-sm">
							<strong>নোট:</strong> যোগাযোগ পেজে যে প্রশ্নগুলো দেখানো হবে,
							সেগুলো
							<strong> "FAQ"</strong> ট্যাব থেকে ম্যানেজ করা হয়। সেখানে
							ক্যাটাগরি হিসেবে "যোগাযোগ" (communication) সিলেক্ট করতে হবে।
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
