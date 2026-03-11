"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { labelClasses, inputClasses, selectClasses } from "./Constants";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";

interface StudentAddFormProps {
	onSuccess?: () => void;
}

export default function StudentAddForm({ onSuccess }: StudentAddFormProps) {
	const [loading, setLoading] = useState(false);
	const [admissionDate, setAdmissionDate] = useState<Date | undefined>(
		undefined,
	);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [availableClasses, setAvailableClasses] = useState<string[]>([]);
	const [selectedClass, setSelectedClass] = useState("");

	useEffect(() => {
		fetchClassConfigs();
	}, []);

	const fetchClassConfigs = async () => {
		try {
			const res = await fetch("/api/class-config");
			const data = await res.json();
			if (data.success) setClassConfigs(data.data);
		} catch (err) {
			console.error("Failed to load configs");
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string | null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		setLoading(true);
		try {
			const formData = new FormData(form);
			const payload = Object.fromEntries(formData.entries());
			payload.admissionDate =
				admissionDate ? admissionDate.toISOString() : new Date().toISOString();

			// Manually add class and department from state
			payload.department = selectedDepartment;
			payload.class = selectedClass;
			payload.roll = formData.get("roll")?.toString() || "";

			// Handle nested feePlan
			payload.feePlan = {
				monthlyAmount: Number(formData.get("monthlyAmount")) || 0,
			};

			if (imageFile) {
				const uploadFormData = new FormData();
				uploadFormData.append("files", imageFile);
				uploadFormData.append("folder", "students");

				const uploadRes = await fetch("/api/upload", {
					method: "POST",
					body: uploadFormData,
				});

				const uploadResult = await uploadRes.json();
				if (uploadResult.success && uploadResult.data?.length > 0) {
					payload.image = uploadResult.data[0].url;
				} else {
					throw new Error("ছবি আপলোড করতে ব্যর্থ হয়েছে");
				}
			}

			const res = await fetch("/api/students", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			let data;
			try {
				data = await res.json();
			} catch (parseErr) {
				console.error("JSON Parse Error:", parseErr);
				if (!res.ok) {
					throw new Error(`Server error: ${res.status}`);
				}
				throw new Error("Invalid response from server");
			}

			if (res.ok && data.success) {
				toast.success("শিক্ষার্থী সফলভাবে যুক্ত হয়েছে");
				form.reset();
				setAdmissionDate(undefined);
				setSelectedDepartment("");
				setSelectedClass("");
				setImageFile(null);
				setImagePreview(null);
				if (onSuccess) onSuccess();
			} else {
				toast.error(data.message || "শিক্ষার্থী যুক্ত করতে ব্যর্থ হয়েছে");
			}
		} catch (err: any) {
			console.error("Student creation error:", err);
			toast.error(err.message || "শিক্ষার্থী যুক্ত করতে ব্যর্থ হয়েছে");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 h-fit">
			<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
				নতুন শিক্ষার্থী যোগ করুন
			</h3>
			<form onSubmit={handleCreate} className="space-y-4">
				<div>
					<Label className={labelClasses}>শিক্ষার্থীর নাম</Label>
					<Input
						name="name"
						required
						className={inputClasses}
						placeholder="পুরো নাম লিখুন"
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className={labelClasses}>শিক্ষার্থী আইডি</Label>
						<Input
							name="studentId"
							required
							className={inputClasses}
							placeholder="MT-2024-001"
						/>
					</div>
					<div>
						<Label className={labelClasses}>রোল</Label>
						<Input
							name="roll"
							required
							className={inputClasses}
							placeholder="উদা: 01"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className={labelClasses}>বিভাগ *</Label>
						<Select
							name="department"
							value={selectedDepartment}
							onValueChange={(val) => {
								setSelectedDepartment(val);
								setSelectedClass("");
								const conf = classConfigs.find((c) => c.department === val);
								setAvailableClasses(conf ? conf.classes : []);
							}}
							required
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="বিভাগ বেছে নিন" />
							</SelectTrigger>
							<SelectContent>
								{classConfigs.map((c) => (
									<SelectItem key={c._id} value={c.department}>
										{c.department}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>শ্রেণী *</Label>
						<Select
							name="class"
							value={selectedClass}
							onValueChange={setSelectedClass}
							required
							disabled={!selectedDepartment}
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="শ্রেণী বেছে নিন" />
							</SelectTrigger>
							<SelectContent>
								{availableClasses.map((cl) => (
									<SelectItem key={cl} value={cl}>
										{cl}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div>
					<Label className={labelClasses}>অভিভাবকের নাম</Label>
					<Input
						name="guardianName"
						className={inputClasses}
						placeholder="পিতার নাম"
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className={labelClasses}>অভিভাবকের ফোন</Label>
						<Input
							name="guardianPhone"
							required
							className={inputClasses}
							placeholder="উদা: 017xxxxxxxx"
						/>
					</div>
					<div>
						<Label className={labelClasses}>মাসিক বেতন</Label>
						<Input
							name="monthlyAmount"
							type="number"
							className={inputClasses}
							placeholder="বেতন লিখুন"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className={labelClasses}>অবস্থা (Status)</Label>
						<Select name="status" defaultValue="active">
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="অবস্থা নির্বাচন করুন" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">Active (সক্রিয়)</SelectItem>
								<SelectItem value="inactive">Inactive (অসক্রিয়)</SelectItem>
								<SelectItem value="passed">Passed (পাশ করেছে)</SelectItem>
								<SelectItem value="left">Left (ছেড়ে চলে গেছে)</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className={labelClasses}>ভর্তির তারিখ</Label>
						<DatePicker
							date={admissionDate}
							onSelect={setAdmissionDate}
							placeholder="তারিখ বাছাই করুন"
							className="w-full"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4 items-center">
					<div>
						<Label className={labelClasses}>শিক্ষার্থীর ছবি</Label>
						<label className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-600 transition bg-gray-50 dark:bg-gray-900 mt-2">
							<div className="flex flex-col items-center">
								<Upload className="w-6 h-6 text-gray-400 mb-1" />
								<span className="text-xs text-gray-600 dark:text-gray-400">
									ছবি নির্বাচন করুন
								</span>
							</div>
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
						</label>
					</div>
					{imagePreview && (
						<div className="flex items-center justify-center pt-6">
							<div className="border border-emerald-600 rounded overflow-hidden">
								<Image
									src={imagePreview}
									alt="Preview"
									width={80}
									height={80}
									className="w-20 h-20 object-cover"
								/>
							</div>
						</div>
					)}
				</div>
				<Button type="submit" disabled={loading} className="w-full">
					{loading ? "সংরক্ষণ হচ্ছে..." : "শিক্ষার্থী যোগ করুন"}
				</Button>
			</form>
		</div>
	);
}
