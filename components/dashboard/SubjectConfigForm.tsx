"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { inputClasses, labelClasses, selectClasses } from "./Constants";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

export function SubjectConfigForm() {
	const [configs, setConfigs] = useState<any[]>([]);
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(false);

	// Form state
	const [editingId, setEditingId] = useState<string | null>(null);
	const [department, setDepartment] = useState("");
	const [cls, setCls] = useState("");
	const [availableClasses, setAvailableClasses] = useState<string[]>([]);
	const [subjects, setSubjects] = useState<{ name: string; total: number }[]>([
		{ name: "", total: 100 },
	]);

	useEffect(() => {
		fetchConfigs();
		fetchClassConfigs();
	}, []);

	const fetchConfigs = async () => {
		try {
			const res = await fetch("/api/subject-config");
			const json = await res.json();
			if (json.success) setConfigs(json.data);
		} catch (err) {
			console.error(err);
			toast.error("বিষয়াবলি লোড করতে ব্যর্থ হয়েছে");
		}
	};

	const fetchClassConfigs = async () => {
		try {
			const res = await fetch("/api/class-config");
			const json = await res.json();
			if (json.success) setClassConfigs(json.data);
		} catch (err) {
			console.error(err);
		}
	};

	const addSubjectLine = () => {
		setSubjects([...subjects, { name: "", total: 100 }]);
	};

	const removeSubjectLine = (index: number) => {
		if (subjects.length <= 1) {
			toast.error("অন্তত একটি বিষয় থাকা আবশ্যক");
			return;
		}
		setSubjects(subjects.filter((_, i) => i !== index));
	};

	const handleDepartmentChange = (val: string) => {
		setDepartment(val);
		setCls("");
		const conf = classConfigs.find((c) => c.department === val);
		setAvailableClasses(conf ? conf.classes : []);
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!department || !cls) {
			toast.error("বিভাগ এবং শ্রেণী নির্বাচন করুন");
			return;
		}

		// Filter out empty subjects
		const validSubjects = subjects.filter((s) => s.name.trim() !== "");
		if (validSubjects.length === 0) {
			toast.error("অন্তত একটি বিষয় যুক্ত করুন");
			return;
		}

		setLoading(true);
		try {
			const payload = {
				id: editingId,
				department,
				class: cls,
				subjects: validSubjects,
			};

			const res = await fetch("/api/subject-config", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();

			if (json.success) {
				toast.success(
					editingId ? "আপডেট করা হয়েছে" : "নতুন সেটিং সংরক্ষণ করা হয়েছে",
				);
				fetchConfigs();
				setShowForm(false);
				resetForm();
			} else {
				toast.error(json.message || "সংরক্ষণ করতে ব্যর্থ হয়েছে");
			}
		} catch (err) {
			console.error(err);
			toast.error("সার্ভারে সমস্যা হয়েছে");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (config: any) => {
		setEditingId(config._id);
		setDepartment(config.department);
		const conf = classConfigs.find((c) => c.department === config.department);
		setAvailableClasses(conf ? conf.classes : []);
		setCls(config.class);
		setSubjects(config.subjects);
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("আপনি কি নিশ্চিত যে এটি মুছতে চান?")) return;
		try {
			const res = await fetch(`/api/subject-config?id=${id}`, {
				method: "DELETE",
			});
			const json = await res.json();
			if (json.success) {
				toast.success("সফলভাবে মোছা হয়েছে");
				fetchConfigs();
			} else {
				toast.error(json.message || "মুছতে ব্যর্থ হয়েছে");
			}
		} catch (err) {
			console.error(err);
			toast.error("সার্ভার সমস্যা");
		}
	};

	const resetForm = () => {
		setEditingId(null);
		setDepartment("");
		setCls("");
		setSubjects([{ name: "", total: 100 }]);
		setAvailableClasses([]);
	};

	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white">
					বিভাগ ও শ্রেণী ভিত্তিক বিষয়াবলি
				</h2>
				{!showForm && (
					<Button
						onClick={() => setShowForm(true)}
						className="bg-green-600 hover:bg-green-700 font-medium"
					>
						<Plus className="w-5 h-5 mr-2" />
						নতুন কনফিগারেশন যোগ করুন
					</Button>
				)}
			</div>

			{showForm && (
				<div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 relative">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b-2 border-green-500 inline-block">
							{editingId ? "কনফিগারেশন সম্পাদনা করুন" : "নতুন কনফিগারেশন তৈরি করুন"}
						</h3>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setShowForm(false);
								resetForm();
							}}
						>
							বাতিল করুন
						</Button>
					</div>

					<form onSubmit={handleSave} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Department */}
							<div className="space-y-2">
								<Label className={labelClasses}>বিভাগ *</Label>
								<Select value={department} onValueChange={handleDepartmentChange}>
									<SelectTrigger className={selectClasses}>
										<SelectValue placeholder="বিভাগ নির্বাচন করুন" />
									</SelectTrigger>
									<SelectContent>
										{classConfigs.map((c: any) => (
											<SelectItem key={c._id} value={c.department}>
												{c.department}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Class */}
							<div className="space-y-2">
								<Label className={labelClasses}>শ্রেণী *</Label>
								<Select
									value={cls}
									onValueChange={setCls}
									disabled={!department}
								>
									<SelectTrigger className={selectClasses}>
										<SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
									</SelectTrigger>
									<SelectContent>
										{availableClasses.map((cl: string) => (
											<SelectItem key={cl} value={cl}>
												{cl}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Subjects */}
						<div className="mt-8 border-t dark:border-gray-700 pt-6">
							<div className="flex justify-between items-center mb-4">
								<Label className="text-base font-semibold text-gray-900 dark:text-white">
									বিষয়সমূহ
								</Label>
								<Button
									type="button"
									onClick={addSubjectLine}
									variant="outline"
									size="sm"
									className="text-green-600 border-green-600 hover:bg-green-50 flex items-center gap-1"
								>
									<Plus className="w-4 h-4" /> নতুন বিষয় যোগ করুন
								</Button>
							</div>

							<div className="space-y-4">
								{subjects.map((sub, index) => (
									<div
										key={index}
										className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
									>
										<div className="space-y-2 md:col-span-7">
											<Label className={labelClasses}>বিষয়ের নাম</Label>
											<Input
												type="text"
												value={sub.name}
												onChange={(e) => {
													const newSubList = [...subjects];
													newSubList[index].name = e.target.value;
													setSubjects(newSubList);
												}}
												placeholder="যেমন: কোরআনুল কারিম"
												className={inputClasses}
												required
											/>
										</div>
										<div className="space-y-2 md:col-span-4">
											<Label className={labelClasses}>মোট নম্বর</Label>
											<Input
												type="number"
												value={sub.total}
												onChange={(e) => {
													const newSubList = [...subjects];
													newSubList[index].total = Number(e.target.value);
													setSubjects(newSubList);
												}}
												className={inputClasses}
												min={1}
												required
											/>
										</div>
										<div className="md:col-span-1 flex justify-center pb-1">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => removeSubjectLine(index)}
												className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10"
												title="মুছে ফেলুন"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="flex justify-end pt-4">
							<Button
								type="submit"
								disabled={loading}
								className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
							>
								{loading ? "সংরক্ষণ করা হচ্ছে..." : "সংরক্ষণ করুন"}
							</Button>
						</div>
					</form>
				</div>
			)}

			{/* List view */}
			{!showForm && (
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
									<th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
										বিভাগ
									</th>
									<th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
										শ্রেণী
									</th>
									<th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
										মোট বিষয়
									</th>
									<th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
										অ্যাকশন
									</th>
								</tr>
							</thead>
							<tbody>
								{configs.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
										>
											কোনো কনফিগারেশন যোগ করা হয়নি
										</td>
									</tr>
								) : (
									configs.map((config) => (
										<tr
											key={config._id}
											className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
										>
											<td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
												{config.department}
											</td>
											<td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
												{config.class}
											</td>
											<td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
												<span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2.5 py-1 rounded-full text-xs font-semibold">
													{config.subjects.length} টি বিষয়
												</span>
											</td>
											<td className="px-6 py-4 text-right">
												<div className="flex justify-end gap-3 text-xl items-center">
													<button
														onClick={() => handleEdit(config)}
														className="text-blue-500 hover:text-blue-700 cursor-pointer"
														title="সম্পাদনা করুন"
													>
														<Pencil className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDelete(config._id)}
														className="text-red-500 hover:text-red-700 cursor-pointer"
														title="মুছে ফেলুন"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
