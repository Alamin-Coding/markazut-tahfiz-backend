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
import { EditIcon, TrashIcon, Upload } from "lucide-react";
import Image from "next/image";

export default function StudentContent() {
	const [students, setStudents] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedDept, setSelectedDept] = useState("all");
	const [selectedClass, setSelectedClass] = useState("all");
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [availableClasses, setAvailableClasses] = useState<string[]>([]);
	const [editingItem, setEditingItem] = useState<any>(null);
	const [editImageFile, setEditImageFile] = useState<File | null>(null);
	const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
	const [itemToDelete, setItemToDelete] = useState<string | null>(null);
	const [admissionDate, setAdmissionDate] = useState<Date | undefined>(
		undefined,
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

			const res = await fetch(`/api/students?all=true&${params.toString()}`);
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

	const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		if (file) {
			setEditImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditImagePreview(reader.result as string | null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!editingItem) return;
		setLoading(true);
		try {
			const formData = new FormData(e.currentTarget);
			const dataObj = Object.fromEntries(formData.entries());

			// Structure the payload for nested feePlan
			const payload: any = {
				...dataObj,
				feePlan: {
					monthlyAmount: Number(dataObj.monthlyAmount) || 0,
				},
			};

			if (editImageFile) {
				const uploadFormData = new FormData();
				uploadFormData.append("files", editImageFile);
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
								value={selectedDept}
								onValueChange={(val) => {
									setSelectedDept(val);
									setSelectedClass("all");
									const conf = classConfigs.find((c) => c.department === val);
									setAvailableClasses(conf ? conf.classes : []);
								}}
							>
								<SelectTrigger className={selectClasses}>
									<SelectValue placeholder="বিভাগ" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">সব বিভাগ</SelectItem>
									{classConfigs.map((c) => (
										<SelectItem key={c._id} value={c.department}>
											{c.department}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="w-full md:w-40">
							<Select value={selectedClass} onValueChange={setSelectedClass}>
								<SelectTrigger className={selectClasses}>
									<SelectValue placeholder="শ্রেণী" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">সব শ্রেণী</SelectItem>
									{availableClasses.map((cl) => (
										<SelectItem key={cl} value={cl}>
											{cl}
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
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									ছবি
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									নাম
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									বিভাগ/শ্রেণী
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									অভিভাবক
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ভর্তির তারিখ
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ফোন
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									বেতন
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									অবস্থা
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
									<td className="px-4 py-3 whitespace-nowrap text-center">
										{student.image ? (
											<Image
												src={student.image}
												alt={student.name || "Student"}
												width={40}
												height={40}
												className="w-10 h-10 rounded-full object-cover mx-auto border border-gray-200 dark:border-gray-700 bg-gray-100"
											/>
										) : (
											<Image
												src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=random`}
												alt={student.name || "Student"}
												width={40}
												height={40}
												className="w-10 h-10 rounded-full object-cover mx-auto border border-gray-200 dark:border-gray-700"
											/>
										)}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{student.name}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{student.department} / {student.class}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{student.guardianName || "N/A"}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{student.admissionDate ?
											format(new Date(student.admissionDate), "dd MMM yyyy")
										:	"N/A"}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{student.guardianPhone}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-emerald-600 dark:text-emerald-400 font-medium">
										৳{student.feePlan?.monthlyAmount || 0}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm">
										<span
											className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
												student.status === "active" ?
													"bg-green-100 text-green-700"
												: student.status === "inactive" ?
													"bg-red-100 text-red-700"
												: student.status === "passed" ?
													"bg-blue-100 text-blue-700"
												:	"bg-gray-100 text-gray-700"
											}`}
										>
											{student.status || "active"}
										</span>
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-right">
										<div className="flex justify-end gap-3">
											<button
												onClick={() => {
													setEditingItem(student);
													setEditImagePreview(student.image || null);
													setEditImageFile(null);
												}}
												className="text-blue-500 hover:text-blue-700 cursor-pointer"
												title="Edit"
											>
												<EditIcon />
											</button>
											<button
												onClick={() => setItemToDelete(student._id)}
												className="text-red-500 hover:text-red-700 cursor-pointer"
												title="Delete"
											>
												<TrashIcon />
											</button>
										</div>
									</td>
								</tr>
							))}
							{students.length === 0 && !loading && (
								<tr>
									<td
										colSpan={10}
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
								<div className="col-span-2">
									<Label className={labelClasses}>অভিভাবকের নাম</Label>
									<Input
										name="guardianName"
										defaultValue={editingItem.guardianName}
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
									<Label className={labelClasses}>মাসিক বেতন</Label>
									<Input
										name="monthlyAmount"
										type="number"
										defaultValue={editingItem.feePlan?.monthlyAmount || 0}
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
								<div className="col-span-2">
									<Label className={labelClasses}>অবস্থা (Status)</Label>
									<Select
										name="status"
										defaultValue={editingItem.status || "active"}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="অবস্থা নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">Active (সক্রিয়)</SelectItem>
											<SelectItem value="inactive">
												Inactive (অসক্রিয়)
											</SelectItem>
											<SelectItem value="passed">Passed (পাশ করেছে)</SelectItem>
											<SelectItem value="left">Left (ছেড়ে চলে গেছে)</SelectItem>
										</SelectContent>
									</Select>
								</div>
								
								<div className="col-span-2 grid grid-cols-[1fr_auto] gap-6 items-center mt-2 border-t dark:border-gray-700 pt-4">
									<div>
										<Label className={labelClasses}>শিক্ষার্থীর ছবি পরিবর্তন করুন</Label>
										<label className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-600 transition bg-gray-50 dark:bg-gray-900 mt-2">
											<div className="flex flex-col items-center">
												<Upload className="w-5 h-5 text-gray-400 mb-1" />
												<span className="text-xs text-gray-600 dark:text-gray-400">
													নতুন ছবি নির্বাচন করুন
												</span>
											</div>
											<input
												type="file"
												accept="image/*"
												onChange={handleEditImageChange}
												className="hidden"
											/>
										</label>
									</div>
									<div className="flex items-center justify-center pt-5">
										{editImagePreview ? (
											<div className="border border-emerald-600 rounded overflow-hidden">
												<Image
													src={editImagePreview}
													alt="Preview"
													width={64}
													height={64}
													className="w-16 h-16 object-cover"
												/>
											</div>
										) : (
											<div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center rounded border dark:border-gray-600 text-[10px] text-gray-400">
												<span>ছবি</span>
												<span>নেই</span>
											</div>
										)}
									</div>
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
