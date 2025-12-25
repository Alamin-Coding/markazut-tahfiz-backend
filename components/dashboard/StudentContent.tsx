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
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { labelClasses, inputClasses, selectClasses } from "./Constants";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StudentContent() {
	const [students, setStudents] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedDept, setSelectedDept] = useState("all");
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
	const [editingItem, setEditingItem] = useState<any>(null);
	const [itemToDelete, setItemToDelete] = useState<string | null>(null);
	const [admissionDate, setAdmissionDate] = useState<Date | undefined>(
		undefined
	);

	useEffect(() => {
		fetchStudents();
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

	const fetchStudents = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			if (search) params.append("search", search);
			if (selectedClass !== "all") params.append("class", selectedClass);
			if (selectedDept !== "all") params.append("department", selectedDept);

			const res = await fetch(`/api/students?${params.toString()}`);
			const data = await res.json();
			if (data.success) setStudents(data.data);
		} catch (err) {
			toast.error("শিক্ষার্থী তালিকা লোড করতে ব্যর্থ হয়েছে");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStudents();
	}, [search, selectedClass, selectedDept]);
	const handleDelete = async () => {
		if (!itemToDelete) return;
		setLoading(true);
		try {
			const res = await fetch(`/api/students/${itemToDelete}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success) {
				toast.success("শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে");
				fetchStudents();
			} else {
				toast.error(data.message);
			}
		} catch (err) {
			toast.error("মুছে ফেলা ব্যর্থ হয়েছে");
		} finally {
			setLoading(false);
			setItemToDelete(null);
		}
	};

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!editingItem) return;
		setLoading(true);
		try {
			const formData = new FormData(e.currentTarget);
			const payload = Object.fromEntries(formData.entries());

			const res = await fetch(`/api/students/${editingItem._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (data.success) {
				toast.success("তথ্য আপডেট করা হয়েছে");
				setEditingItem(null);
				fetchStudents();
			} else {
				toast.error(data.message);
			}
		} catch (err) {
			toast.error("আপডেট ব্যর্থ হয়েছে");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						শিক্ষার্থী তালিকা
					</h3>
					<div className="flex flex-wrap gap-2 w-full md:w-auto">
						<div className="w-full md:w-40">
							<Select
								value={selectedClass}
								onValueChange={(val) => {
									setSelectedClass(val);
									setSelectedDept("all");
									const conf = classConfigs.find((c) => c.className === val);
									setAvailableDivisions(conf ? conf.divisions : []);
								}}
							>
								<SelectTrigger className={selectClasses}>
									<SelectValue placeholder="শ্রেণী" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">সব শ্রেণী</SelectItem>
									{classConfigs.map((c) => (
										<SelectItem key={c._id} value={c.className}>
											{c.className}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="w-full md:w-40">
							<Select value={selectedDept} onValueChange={setSelectedDept}>
								<SelectTrigger className={selectClasses}>
									<SelectValue placeholder="বিভাগ" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">সব বিভাগ</SelectItem>
									{availableDivisions.map((d) => (
										<SelectItem key={d} value={d}>
											{d}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1 md:max-w-xs">
							<Input
								placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className={inputClasses}
							/>
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-900">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									আইডি
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									রোল
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									নাম
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									বিভাগ/শ্রেণী
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ফোন
								</th>
								<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									অ্যাকশন
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{students.map((student) => (
								<tr
									key={student._id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
								>
									<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-emerald-600 dark:text-emerald-400">
										{student.studentId}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{student.roll}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{student.name}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{student.department} / {student.class}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{student.guardianPhone}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-right">
										<div className="flex justify-end gap-2">
											<button
												onClick={() => setEditingItem(student)}
												className="text-blue-500 hover:text-blue-700"
												title="Edit"
											>
												✎
											</button>
											<button
												onClick={() => setItemToDelete(student._id)}
												className="text-red-500 hover:text-red-700"
												title="Delete"
											>
												🗑
											</button>
										</div>
									</td>
								</tr>
							))}
							{students.length === 0 && !loading && (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-10 text-center text-gray-500"
									>
										কোনো শিক্ষার্থী পাওয়া যায়নি
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Edit Student Modal */}
			{editingItem && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 w-full max-w-lg overflow-hidden">
						<div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
							<h3 className="font-bold text-gray-900 dark:text-white">
								শিক্ষার্থীর তথ্য হালনাগাদ
							</h3>
							<button
								onClick={() => setEditingItem(null)}
								className="text-gray-500 hover:text-gray-700 text-2xl"
							>
								×
							</button>
						</div>
						<form onSubmit={handleUpdate} className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2">
									<Label className={labelClasses}>শিক্ষার্থীর নাম</Label>
									<Input
										name="name"
										defaultValue={editingItem.name}
										required
										className={inputClasses}
									/>
								</div>
								<div>
									<Label className={labelClasses}>আইডি</Label>
									<Input
										name="studentId"
										defaultValue={editingItem.studentId}
										required
										className={inputClasses}
									/>
								</div>
								<div>
									<Label className={labelClasses}>রোল</Label>
									<Input
										name="roll"
										defaultValue={editingItem.roll}
										required
										className={inputClasses}
									/>
								</div>
								<div>
									<Label className={labelClasses}>ফোন</Label>
									<Input
										name="guardianPhone"
										defaultValue={editingItem.guardianPhone}
										required
										className={inputClasses}
									/>
								</div>
								<div>
									<Label className={labelClasses}>বিভাগ</Label>
									<Input
										name="department"
										defaultValue={editingItem.department}
										required
										className={inputClasses}
									/>
								</div>
								<div>
									<Label className={labelClasses}>শ্রেণী</Label>
									<Input
										name="class"
										defaultValue={editingItem.class}
										required
										className={inputClasses}
									/>
								</div>
							</div>
							<div className="flex gap-3 pt-4">
								<Button type="submit" disabled={loading} className="flex-1">
									সংরক্ষণ করুন
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setEditingItem(null)}
									className="flex-1"
								>
									বাতিল
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation */}
			<AlertDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
						<AlertDialogDescription>
							শিক্ষার্থীর এই তথ্যটি স্থায়ীভাবে মুছে ফেলা হবে।
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>বাতিল</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-500 hover:bg-red-600"
						>
							মুছে ফেলুন
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
