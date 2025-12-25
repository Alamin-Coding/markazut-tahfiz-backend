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

interface StudentAddFormProps {
	onSuccess?: () => void;
}

export default function StudentAddForm({ onSuccess }: StudentAddFormProps) {
	const [loading, setLoading] = useState(false);
	const [admissionDate, setAdmissionDate] = useState<Date | undefined>(
		undefined
	);
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [selectedClass, setSelectedClass] = useState("");
	const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
	const [selectedDivision, setSelectedDivision] = useState("");

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

	const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		setLoading(true);
		try {
			const formData = new FormData(form);
			const payload = Object.fromEntries(formData.entries());
			payload.admissionDate = admissionDate
				? admissionDate.toISOString()
				: new Date().toISOString();

			// Manually add class and division from state
			payload.class = selectedClass;
			payload.department = selectedDivision;
			payload.roll = formData.get("roll")?.toString() || ""; // Ensure string

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
				setSelectedClass("");
				setSelectedDivision("");
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
						<Label className={labelClasses}>শ্রেণী *</Label>
						<Select
							name="class"
							value={selectedClass}
							onValueChange={(val) => {
								setSelectedClass(val);
								setSelectedDivision("");
								const conf = classConfigs.find((c) => c.className === val);
								setAvailableDivisions(conf ? conf.divisions : []);
							}}
							required
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="শ্রেণী বেছে নিন" />
							</SelectTrigger>
							<SelectContent>
								{classConfigs.map((c) => (
									<SelectItem key={c._id} value={c.className}>
										{c.className}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>বিভাগ *</Label>
						<Select
							name="department"
							value={selectedDivision}
							onValueChange={setSelectedDivision}
							required
							disabled={!selectedClass}
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="বিভাগ বেছে নিন" />
							</SelectTrigger>
							<SelectContent>
								{availableDivisions.map((d) => (
									<SelectItem key={d} value={d}>
										{d}
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
					<Label className={labelClasses}>ভর্তির তারিখ</Label>
					<DatePicker
						date={admissionDate}
						onSelect={setAdmissionDate}
						placeholder="তারিখ বাছাই করুন"
						className="w-full"
					/>
				</div>
				<Button type="submit" disabled={loading} className="w-full">
					{loading ? "সংরক্ষণ হচ্ছে..." : "শিক্ষার্থী যোগ করুন"}
				</Button>
			</form>
		</div>
	);
}
