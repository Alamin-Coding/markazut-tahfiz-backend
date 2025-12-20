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
import * as XLSX from "xlsx";
import { inputClasses, labelClasses, selectClasses } from "./Constants";

export interface ResultType {
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

export default function ResultsManageForm() {
	const [results, setResults] = useState<ResultType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [filteredResults, setFilteredResults] = useState(results);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTerm, setSelectedTerm] = useState("all");
	const [selectedDivision, setSelectedDivision] = useState("all");
	const [selectedClass, setSelectedClass] = useState("all");
	const [showAddForm, setShowAddForm] = useState(false);
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
	const [examDateValue, setExamDateValue] = useState<Date | undefined>(
		undefined
	);
	const [resultDateValue, setResultDateValue] = useState<Date | undefined>(
		undefined
	);

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
			!(examDateValue || formData.examDate) ||
			!(resultDateValue || formData.resultDate)
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
			examDate: examDateValue ? examDateValue.toISOString() : formData.examDate,
			resultDate: resultDateValue
				? resultDateValue.toISOString()
				: formData.resultDate,
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
		setExamDateValue(undefined);
		setResultDateValue(undefined);
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
		const parsedExam = new Date(result.examDate);
		setExamDateValue(isNaN(parsedExam.getTime()) ? undefined : parsedExam);
		const parsedResult = new Date(result.resultDate);
		setResultDateValue(
			isNaN(parsedResult.getTime()) ? undefined : parsedResult
		);
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
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-medium text-gray-900 dark:text-white">
					ফলাফল পরিচালনা
				</h2>
				<div className="flex gap-2">
					<Button
						onClick={() => {
							setEditingId(null);
							resetForm();
							setShowAddForm(true);
						}}
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
			<div className="mb-6 p-4 border rounded-lg bg-white dark:bg-gray-800">
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
								setSelectedTerm("all");
								setSelectedDivision("all");
								setSelectedClass("all");
							}}
							variant="outline"
						>
							ক্লিয়ার ফিল্টার
						</Button>
					</div>
				</div>
			</div>

			{/* Results Table */}
			<div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border">
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
										{result.totalMarks}/500
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex gap-2">
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
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								{editingId ? "ফলাফল সম্পাদনা করুন" : "নতুন ফলাফল যোগ করুন"}
							</h3>
							<button
								onClick={() => setShowAddForm(false)}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
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
									<DatePicker
										date={examDateValue}
										onSelect={(date) => {
											setExamDateValue(date || undefined);
											setFormData({
												...formData,
												examDate: date ? date.toISOString() : "",
											});
										}}
										placeholder="তারিখ নির্বাচন করুন"
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>ফলাফল প্রকাশের তারিখ</Label>
									<DatePicker
										date={resultDateValue}
										onSelect={(date) => {
											setResultDateValue(date || undefined);
											setFormData({
												...formData,
												resultDate: date ? date.toISOString() : "",
											});
										}}
										placeholder="তারিখ নির্বাচন করুন"
									/>
								</div>
							</div>

							{/* Subjects */}
							<div>
								<h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
									বিষয়ভিত্তিক নম্বর
								</h4>
								<div className="space-y-4">
									{formData.subjects.map((subject, index) => (
										<div
											key={index}
											className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg dark:border-gray-700"
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
								<div className="text-lg font-medium text-gray-900 dark:text-white">
									সম্মিলিত নম্বর:{" "}
									{formData.subjects.reduce((sum, subj) => sum + subj.marks, 0)}
									/500
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 pt-4 border-t dark:border-gray-700">
								<Button
									type="submit"
									className="flex-1 bg-green-600 hover:bg-green-700 h-11"
								>
									{editingId ? "আপডেট করুন" : "সেভ করুন"}
								</Button>
								<Button
									type="button"
									onClick={() => setShowAddForm(false)}
									variant="outline"
									className="flex-1 h-11"
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
