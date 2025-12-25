"use client";

import React, { useState, useEffect, useMemo } from "react";
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
	examYear: string;
	studentId: string;
	principal: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export default function ResultsManageForm() {
	const [results, setResults] = useState<ResultType[]>([]);
	const [students, setStudents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [filteredResults, setFilteredResults] = useState(results);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTerm, setSelectedTerm] = useState("all");
	const [selectedDivision, setSelectedDivision] = useState("all");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedYear, setSelectedYear] = useState("all");
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [availableDivisions, setAvailableDivisions] = useState<any[]>([]);
	const [formAvailableDivisions, setFormAvailableDivisions] = useState<
		string[]
	>([]);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		roll: "",
		division: "",
		class: "",
		term: "",
		examYear: new Date().getFullYear().toString(),
		studentId: "",
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

	// Fetch results and students on component mount
	useEffect(() => {
		fetchResults();
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
		try {
			const response = await fetch("/api/students");
			const result = await response.json();
			if (result.success) {
				setStudents(result.data || []);
			}
		} catch (error) {
			console.error("Error fetching students:", error);
		}
	};
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

	const addSubject = () => {
		setFormData({
			...formData,
			subjects: [...formData.subjects, { name: "", marks: 0, total: 100 }],
		});
	};

	const removeSubject = (index: number) => {
		if (formData.subjects.length <= 1) {
			alert("অন্তত একটি বিষয় থাকা আবশ্যক");
			return;
		}
		const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
		setFormData({ ...formData, subjects: updatedSubjects });
	};

	const handleAutoFill = (searchVal: string, type: "name" | "roll") => {
		const student = students.find((s) =>
			type === "name"
				? s.name === searchVal
				: s.roll === searchVal || s.studentId === searchVal
		);

		if (student) {
			setFormData((prev) => {
				const newData = {
					...prev,
					name: student.name,
					roll: student.roll || "",
					studentId: student.studentId || "",
					class: student.class,
					division: student.department,
				};
				// Update divisions for the select box
				const conf = classConfigs.find((c) => c.className === student.class);
				setFormAvailableDivisions(conf ? conf.divisions : []);
				return newData;
			});
		}
	};

	const handleSave = async () => {
		if (
			!formData.name ||
			!formData.roll ||
			!formData.studentId ||
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
			studentId: formData.studentId,
			division: formData.division,
			class: formData.class,
			term: formData.term,
			examYear: formData.examYear,
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
			examYear: new Date().getFullYear().toString(),
			studentId: "",
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

	// Get unique student names for the name search dropdown
	const studentNames = useMemo(() => {
		const names = results.map((r) => r.name);
		return Array.from(new Set(names)).sort();
	}, [results]);

	// Get unique roll numbers and names for search suggestions
	const searchSuggestions = useMemo(() => {
		const rolls = results.map((r) => r.roll.toString());
		const names = results.map((r) => r.name);
		return Array.from(new Set([...rolls, ...names])).sort();
	}, [results]);

	// Filter results based on search and filters
	useEffect(() => {
		let filtered = results;

		if (searchTerm && searchTerm !== "all") {
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

		if (selectedYear !== "all") {
			filtered = filtered.filter((result) => result.examYear === selectedYear);
		}

		setFilteredResults(filtered);
	}, [
		results,
		searchTerm,
		selectedTerm,
		selectedDivision,
		selectedClass,
		selectedYear,
	]);

	const handleEdit = (result: any) => {
		setEditingId(result._id);
		setFormData({
			name: result.name,
			roll: result.roll,
			division: result.division,
			class: result.class,
			term: result.term,
			examYear: result.examYear || new Date().getFullYear().toString(),
			studentId: result.studentId || "",
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
			আইডি: result.studentId || "",
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
			{ wch: 15 }, // আইডি
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
						<Label className={labelClasses}>রোল/নাম অনুসন্ধান</Label>
						<Input
							list="search-suggestions"
							type="text"
							placeholder="রোল বা নাম লিখুন"
							value={searchTerm === "all" ? "" : searchTerm}
							onChange={(e) => setSearchTerm(e.target.value || "all")}
							className={inputClasses}
						/>
						<datalist id="search-suggestions">
							{searchSuggestions.map((suggestion) => (
								<option key={suggestion} value={suggestion} />
							))}
						</datalist>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>পরীক্ষা</Label>
						<Select value={selectedTerm} onValueChange={setSelectedTerm}>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="সব পরীক্ষা" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">সব পরীক্ষা</SelectItem>
								<SelectItem value="১ম পরীক্ষা ২০২৫">১ম পরীক্ষা ২০২৫</SelectItem>
								<SelectItem value="২য় পরীক্ষা ২০২৫">
									২য় পরীক্ষা ২০২৫
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>শ্রেণী</Label>
						<Select
							value={selectedClass}
							onValueChange={(val) => {
								setSelectedClass(val);
								setSelectedDivision("all");
								const conf = classConfigs.find((c) => c.className === val);
								setAvailableDivisions(conf ? conf.divisions : []);
							}}
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="সব শ্রেণী" />
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
								{availableDivisions.map((d) => (
									<SelectItem key={d} value={d}>
										{d}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>বছর</Label>
						<Input
							type="text"
							placeholder="বছর (যেমন: ২০২৫)"
							value={selectedYear === "all" ? "" : selectedYear}
							onChange={(e) => setSelectedYear(e.target.value || "all")}
							className={inputClasses}
						/>
					</div>
					<div className="flex items-end">
						<Button
							onClick={() => {
								setSearchTerm("");
								setSelectedTerm("all");
								setSelectedDivision("all");
								setSelectedClass("all");
								setSelectedYear("all");
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
						<thead className="bg-gray-50 dark:bg-gray-900">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ছাত্র
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									আইডি
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									রোল
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									শ্রেণী/বিভাগ
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									পরীক্ষা
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									বছর
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									নম্বর
								</th>
								<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									অ্যাকশন
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{filteredResults.map((result) => (
								<tr
									key={result._id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
								>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{result.name}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-emerald-600 dark:text-emerald-400">
										{result.studentId}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{result.roll}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{result.class} / {result.division}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{result.term}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{result.examYear}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
										{result.totalMarks} /{" "}
										{result.subjects.reduce((sum, s) => sum + s.total, 0)}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-right">
										<div className="flex justify-end gap-2">
											<button
												onClick={() => handleEdit(result)}
												className="text-blue-500 hover:text-blue-700"
												title="Edit"
											>
												✎
											</button>
											<button
												onClick={() => handleDelete(result._id)}
												className="text-red-500 hover:text-red-700"
												title="Delete"
											>
												🗑
											</button>
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
										list="student-names-list"
										type="text"
										value={formData.name}
										onChange={(e) => {
											const val = e.target.value;
											setFormData({ ...formData, name: val });
											handleAutoFill(val, "name");
										}}
										className={inputClasses}
										required
									/>
									<datalist id="student-names-list">
										{students.map((s) => (
											<option key={s._id} value={s.name} />
										))}
									</datalist>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>রোল নম্বর *</Label>
									<Input
										list="student-rolls-list"
										type="text"
										value={formData.roll}
										onChange={(e) => {
											const val = e.target.value;
											setFormData({ ...formData, roll: val });
											handleAutoFill(val, "roll");
										}}
										className={inputClasses}
										required
									/>
									<datalist id="student-rolls-list">
										{students.map((s) => (
											<option key={s._id} value={s.roll} />
										))}
									</datalist>
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
										disabled={!formData.class}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="বিভাগ নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											{formAvailableDivisions.map((d: any) => (
												<SelectItem key={d} value={d}>
													{d}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>শ্রেণী *</Label>
									<Select
										value={formData.class}
										onValueChange={(value) => {
											setFormData({ ...formData, class: value, division: "" });
											const conf = classConfigs.find(
												(c: any) => c.className === value
											);
											setFormAvailableDivisions(conf ? conf.divisions : []);
										}}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											{classConfigs.map((c: any) => (
												<SelectItem key={c._id} value={c.className}>
													{c.className}
												</SelectItem>
											))}
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
											<SelectItem value="১ম পরীক্ষা ২০২৫">
												১ম পরীক্ষা ২০২৫
											</SelectItem>
											<SelectItem value="২য় পরীক্ষা ২০২৫">
												২য় পরীক্ষা ২০২৫
											</SelectItem>
											<SelectItem value="১ম পরীক্ষা ২০২৬">
												১ম পরীক্ষা ২০২৬
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>পরীক্ষার বছর *</Label>
									<Input
										type="text"
										placeholder="যেমন: ২০২৫"
										value={formData.examYear}
										onChange={(e) =>
											setFormData({ ...formData, examYear: e.target.value })
										}
										className={inputClasses}
									/>
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
								<div className="flex justify-between items-center mb-4">
									<h4 className="text-lg font-medium text-gray-900 dark:text-white">
										বিষয়ভিত্তিক নম্বর
									</h4>
									<Button
										type="button"
										onClick={addSubject}
										variant="outline"
										size="sm"
										className="text-green-600 border-green-600 hover:bg-green-50"
									>
										+ নতুন বিষয় যোগ করুন
									</Button>
								</div>
								<div className="space-y-4">
									{formData.subjects.map((subject, index) => (
										<div
											key={index}
											className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg dark:border-gray-700"
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
													placeholder="বিষয়ের নাম"
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
											<div className="flex items-end justify-center pb-1">
												<Button
													type="button"
													variant="ghost"
													onClick={() => removeSubject(index)}
													className="text-red-500 hover:text-red-700 hover:bg-red-50"
													title="মুছে ফেলুন"
												>
													🗑️
												</Button>
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
									/
									{formData.subjects.reduce((sum, subj) => sum + subj.total, 0)}
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
