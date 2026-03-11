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
import { toast } from "sonner";
import {
	Rocket,
	FileSpreadsheet,
	Plus,
	Pencil,
	Trash2,
	Ban,
} from "lucide-react";

export interface ResultType {
	_id: string;
	name: string;
	roll: string | number;
	department: string;
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
	status: "draft" | "published";
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
	const [selectedDepartment, setSelectedDepartment] = useState("all");
	const [selectedClass, setSelectedClass] = useState("all");
	const [selectedYear, setSelectedYear] = useState("all");
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [subjectConfigs, setSubjectConfigs] = useState<any[]>([]);
	const [availableClasses, setAvailableClasses] = useState<any[]>([]);
	const [formAvailableClasses, setFormAvailableClasses] = useState<string[]>(
		[],
	);
	const [formAvailableExams, setFormAvailableExams] = useState<string[]>([]);
	const [availableExams, setAvailableExams] = useState<any[]>([]);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showNameSuggestions, setShowNameSuggestions] = useState(false);
	const [showRollSuggestions, setShowRollSuggestions] = useState(false);
	const [studentsLoading, setStudentsLoading] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		roll: "",
		department: "",
		class: "",
		term: "",
		examYear: new Date().getFullYear().toString(),
		studentId: "",
		examDate: "",
		resultDate: "",
		principal: "মুফতী ইকরাম হুসাইন খসরু",
		subjects: [],
		status: "draft" as "draft" | "published",
	});
	const [examDateValue, setExamDateValue] = useState<Date | undefined>(
		undefined,
	);
	const [resultDateValue, setResultDateValue] = useState<Date | undefined>(
		undefined,
	);

	// Fetch results and students on component mount
	useEffect(() => {
		fetchResults();
		fetchStudents();
		fetchClassConfigs();
		fetchSubjectConfigs();
	}, []);

	const fetchSubjectConfigs = async () => {
		try {
			const res = await fetch("/api/subject-config");
			const json = await res.json();
			if (json.success) setSubjectConfigs(json.data);
		} catch (err) {
			console.error("Error fetching subject configs:", err);
		}
	};

	const getSubjectsForClass = (department: string, cls: string): any[] => {
		const config = subjectConfigs.find(
			(c) => c.department === department && c.class === cls
		);
		if (config && config.subjects?.length > 0) {
			return config.subjects.map((s: any) => ({ name: s.name, marks: 0, total: s.total || 100 }));
		}
		// Fallback defaults if no specific configuration
		return [
			{ name: "কোরআনুল কারিম", marks: 0, total: 100 },
			{ name: "তাজবিদ", marks: 0, total: 100 },
			{ name: "দোয়া / মাসআলা-মাসায়েল", marks: 0, total: 100 },
			{ name: "বাংলা / ব্যাকরণ", marks: 0, total: 100 },
			{ name: "গণিত", marks: 0, total: 100 },
			{ name: "ইংরেজী / গ্রামার", marks: 0, total: 100 },
			{ name: "ছবি আঁকি", marks: 0, total: 100 },
			{ name: "সাধারণ জ্ঞান", marks: 0, total: 100 },
			{ name: "পরিবেশ পরিচিতি", marks: 0, total: 100 },
		];
	};

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
			setStudentsLoading(true);
			const response = await fetch("/api/students?all=true");
			const result = await response.json();
			if (result.success) {
				console.log("Students loaded:", result.data?.length);
				setStudents(result.data || []);
			} else {
				console.error("Failed to load students:", result.message);
			}
		} catch (error) {
			console.error("Error fetching students:", error);
		} finally {
			setStudentsLoading(false);
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
			toast.error("অন্তত একটি বিষয় থাকা আবশ্যক");
			return;
		}
		const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
		setFormData({ ...formData, subjects: updatedSubjects });
	};

	const handleAutoFill = (searchVal: string, type: "name" | "roll") => {
		const student = students.find((s) =>
			type === "name" ?
				s.name === searchVal
			:	s.roll === searchVal || s.studentId === searchVal,
		);

		if (student) {
			setFormData((prev) => {
				const newData = {
					...prev,
					name: student.name,
					roll: student.roll || "",
					studentId: student.studentId || "",
					class: student.class,
					department: student.department,
					subjects: getSubjectsForClass(student.department, student.class),
				};
				// Update classes for the select box
				const conf = classConfigs.find(
					(c) => c.department === student.department,
				);
				setFormAvailableClasses(conf ? conf.classes : []);
				setFormAvailableExams(conf ? conf.exams || [] : []);
				return newData;
			});
		}
	};

	const handleSave = async () => {
		if (
			!formData.name ||
			!formData.roll ||
			!formData.studentId ||
			!formData.department ||
			!formData.class ||
			!formData.term ||
			!(examDateValue || formData.examDate) ||
			!(resultDateValue || formData.resultDate)
		) {
			toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন");
			return;
		}

		const totalMarks = formData.subjects.reduce(
			(sum, subj) => sum + subj.marks,
			0,
		);

		const payload = {
			name: formData.name,
			roll: formData.roll,
			studentId: formData.studentId,
			department: formData.department,
			class: formData.class,
			term: formData.term,
			examYear: formData.examYear,
			totalMarks,
			subjects: formData.subjects,
			examDate: examDateValue ? examDateValue.toISOString() : formData.examDate,
			resultDate:
				resultDateValue ? resultDateValue.toISOString() : formData.resultDate,
			principal: formData.principal,
			status: formData.status,
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
				toast.success(editingId ? "ফলাফল আপডেট হয়েছে" : "ফলাফল যোগ হয়েছে");
				fetchResults(); // Refresh the list
				setShowAddForm(false);
				setEditingId(null);
				resetForm();
			} else {
				toast.error(result.message || "Failed to save result");
			}
		} catch (error) {
			console.error("Error saving result:", error);
			toast.error("Failed to save result");
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			roll: "",
			department: "",
			class: "",
			term: "",
			examYear: new Date().getFullYear().toString(),
			studentId: "",
			examDate: "",
			resultDate: "",
			principal: "মুফতী ইকরাম হুসাইন খসরু",
			subjects: getSubjectsForClass("", ""),
			status: "draft",
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
					result.roll.toString().includes(searchTerm),
			);
		}

		if (selectedTerm !== "all") {
			filtered = filtered.filter((result) => result.term === selectedTerm);
		}

		if (selectedDepartment !== "all") {
			filtered = filtered.filter(
				(result) => result.department === selectedDepartment,
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
		selectedDepartment,
		selectedClass,
		selectedYear,
	]);

	const handleEdit = (result: any) => {
		setEditingId(result._id);
		setFormData({
			name: result.name,
			roll: result.roll,
			department: result.department,
			class: result.class,
			term: result.term,
			examYear: result.examYear || new Date().getFullYear().toString(),
			studentId: result.studentId || "",
			examDate: result.examDate,
			resultDate: result.resultDate,
			principal: result.principal,
			subjects: result.subjects,
			status: result.status || "draft",
		});
		const parsedExam = new Date(result.examDate);
		setExamDateValue(isNaN(parsedExam.getTime()) ? undefined : parsedExam);
		const parsedResult = new Date(result.resultDate);
		setResultDateValue(
			isNaN(parsedResult.getTime()) ? undefined : parsedResult,
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
					toast.success("ফলাফল মুছে ফেলা হয়েছে");
					fetchResults(); // Refresh the list
				} else {
					toast.error(result.message || "Failed to delete result");
				}
			} catch (error) {
				console.error("Error deleting result:", error);
				toast.error("Failed to delete result");
			}
		}
	};

	const handlePublish = async (
		id: string,
		currentStatus: "draft" | "published",
	) => {
		const newStatus = currentStatus === "published" ? "draft" : "published";
		try {
			const response = await fetch(`/api/result/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});
			const result = await response.json();
			if (result.success) {
				toast.success(
					`ফলাফল ${newStatus === "published" ? "পাবলিশড" : "ড্রাফট"} করা হয়েছে`,
				);
				fetchResults();
			} else {
				toast.error(result.message || "Failed to update status");
			}
		} catch (error) {
			console.error("Error updating status:", error);
			toast.error("Failed to update status");
		}
	};

	const handlePublishAll = async () => {
		const draftResults = filteredResults.filter(
			(r) => r.status === "draft" || !r.status,
		);
		if (draftResults.length === 0) {
			toast.info("পাবলিশ করার মতো কোনো ড্রাফট ফলাফল নেই");
			return;
		}

		if (
			confirm(
				`আপনি কি নিশ্চিত যে ${draftResults.length} টি ফলাফল একসাথে পাবলিশ করতে চান?`,
			)
		) {
			setLoading(true);
			try {
				let successCount = 0;
				for (const result of draftResults) {
					const response = await fetch(`/api/result/${result._id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ status: "published" }),
					});
					const resData = await response.json();
					if (resData.success) successCount++;
				}
				toast.success(`${successCount} টি ফলাফল সফলভাবে পাবলিশ করা হয়েছে`);
				fetchResults();
			} catch (error) {
				console.error("Error bulk publishing:", error);
				toast.error("ফলাফল পাবলিশ করতে সমস্যা হয়েছে");
			} finally {
				setLoading(false);
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
			বিভাগ: result.department,
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
				<div className="flex gap-2 flex-wrap">
					<Button
						onClick={handlePublishAll}
						className="bg-blue-600 hover:bg-blue-700 font-medium"
					>
						<Rocket className="w-4 h-4 mr-2" />
						সব পাবলিশ করুন
					</Button>
					<Button
						onClick={() => {
							setEditingId(null);
							resetForm();
							setShowAddForm(true);
						}}
						className="bg-green-600 hover:bg-green-700 font-medium"
					>
						<Plus className="w-5 h-5 mr-2" />
						নতুন ফলাফল যোগ করুন
					</Button>
					<Button
						onClick={exportToExcel}
						variant="outline"
						className="font-medium"
					>
						<FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
						এক্সেলে এক্সপোর্ট
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
								{availableExams.map((t) => (
									<SelectItem key={t} value={t}>
										{t}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className={labelClasses}>বিভাগ</Label>
						<Select
							value={selectedDepartment}
							onValueChange={(val) => {
								setSelectedDepartment(val);
								setSelectedClass("all");
								setSelectedTerm("all");
								const conf = classConfigs.find((c) => c.department === val);
								setAvailableClasses(conf ? conf.classes : []);
								setAvailableExams(conf ? conf.exams || [] : []);
							}}
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="সব বিভাগ" />
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
					<div className="space-y-2">
						<Label className={labelClasses}>শ্রেণী</Label>
						<Select value={selectedClass} onValueChange={setSelectedClass}>
							<SelectTrigger className={selectClasses}>
								<SelectValue placeholder="সব শ্রেণী" />
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
								setSelectedDepartment("all");
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
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									স্ট্যাটাস
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
										{result.class} / {result.department}
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
									<td className="px-4 py-3 whitespace-nowrap text-center text-sm">
										<span
											className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
												result.status === "published" ?
													"bg-green-100 text-green-700"
												:	"bg-orange-100 text-orange-700"
											}`}
										>
											{result.status === "published" ? "Published" : "Draft"}
										</span>
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-sm text-right">
										<div className="flex justify-end gap-3 text-xl items-center">
											<button
												onClick={() =>
													handlePublish(
														result._id,
														result.status as "draft" | "published",
													)
												}
												className={`cursor-pointer ${result.status === "published" ? "text-orange-500 hover:text-orange-700" : "text-green-500 hover:text-green-700"}`}
												title={
													result.status === "published" ?
														"Unpublish (Draft)"
													:	"Publish"
												}
											>
												{result.status === "published" ?
													<Ban className="w-5 h-5" />
												:	<Rocket className="w-5 h-5" />}
											</button>
											<button
												onClick={() => handleEdit(result)}
												className="cursor-pointer text-blue-500 hover:text-blue-700"
												title="Edit"
											>
												<Pencil className="w-4 h-4" />
											</button>
											<button
												onClick={() => handleDelete(result._id)}
												className="cursor-pointer text-red-500 hover:text-red-700"
												title="Delete"
											>
												<Trash2 className="w-4 h-4" />
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
								<div className="space-y-2 relative">
									<Label className={labelClasses}>ছাত্রের নাম *</Label>
									<Input
										type="text"
										value={formData.name}
										onFocus={() => {
											setShowNameSuggestions(true);
											if (students.length === 0 && !studentsLoading)
												fetchStudents();
										}}
										onBlur={() =>
											setTimeout(() => setShowNameSuggestions(false), 200)
										}
										onChange={(e) => {
											const val = e.target.value;
											setFormData({ ...formData, name: val });
											handleAutoFill(val, "name");
											setShowNameSuggestions(true);
										}}
										className={inputClasses}
										placeholder="ছাত্রের নাম লিখুন..."
										required
										autoComplete="off"
									/>
									{showNameSuggestions && formData.name.length > 0 && (
										<ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto mt-1 top-full">
											{studentsLoading ?
												<li className="px-4 py-3 text-sm text-gray-500 text-center italic flex items-center justify-center">
													<span className="animate-spin mr-2">⌛</span> লোড
													হচ্ছে...
												</li>
											:	<>
													{students
														.filter((s) => {
															const normalizedSearch = formData.name
																.replace(/\s+/g, " ")
																.trim()
																.toLowerCase();
															const normalizedName = (s.name || "")
																.replace(/\s+/g, " ")
																.trim()
																.toLowerCase();
															return normalizedName.includes(normalizedSearch);
														})
														.map((s) => (
															<li
																key={s._id}
																className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-0"
																onClick={() => {
																	setFormData({ ...formData, name: s.name });
																	handleAutoFill(s.name, "name");
																	setShowNameSuggestions(false);
																}}
															>
																<span className="font-medium">{s.name}</span>
																{s.roll && (
																	<span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
																		রোল: {s.roll}
																	</span>
																)}
																{/* Show inactive status if applicable */}
																{s.status && s.status !== "active" && (
																	<span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1 rounded">
																		{s.status === "inactive" ?
																			"Inactive"
																		:	s.status}
																	</span>
																)}
															</li>
														))}
													{students.filter((s) => {
														const normalizedSearch = formData.name
															.replace(/\s+/g, " ")
															.trim()
															.toLowerCase();
														const normalizedName = (s.name || "")
															.replace(/\s+/g, " ")
															.trim()
															.toLowerCase();
														return normalizedName.includes(normalizedSearch);
													}).length === 0 && (
														<li className="px-4 py-3 text-sm text-gray-500 text-center italic">
															কোনো নাম পাওয়া যায়নি
														</li>
													)}
												</>
											}
										</ul>
									)}
								</div>
								<div className="space-y-2 relative">
									<Label className={labelClasses}>রোল নম্বর *</Label>
									<Input
										type="text"
										value={formData.roll}
										onFocus={() => {
											setShowRollSuggestions(true);
											if (students.length === 0 && !studentsLoading)
												fetchStudents();
										}}
										onBlur={() =>
											setTimeout(() => setShowRollSuggestions(false), 200)
										}
										onChange={(e) => {
											const val = e.target.value;
											setFormData({ ...formData, roll: val });
											handleAutoFill(val, "roll");
											setShowRollSuggestions(true);
										}}
										className={inputClasses}
										placeholder="রোল নম্বর লিখুন..."
										required
										autoComplete="off"
									/>
									{showRollSuggestions && formData.roll.length > 0 && (
										<ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto mt-1 top-full">
											{studentsLoading ?
												<li className="px-4 py-3 text-sm text-gray-500 text-center italic flex items-center justify-center">
													<span className="animate-spin mr-2">⌛</span> লোড
													হচ্ছে...
												</li>
											:	<>
													{students
														.filter((s) => {
															const normalizedSearch = formData.roll
																.toString()
																.trim();
															const normalizedRoll = (s.roll || "")
																.toString()
																.trim();
															return normalizedRoll.includes(normalizedSearch);
														})
														.map((s) => (
															<li
																key={s._id}
																className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-0"
																onClick={() => {
																	setFormData({ ...formData, roll: s.roll });
																	handleAutoFill(s.roll, "roll");
																	setShowRollSuggestions(false);
																}}
															>
																<span className="font-medium">{s.roll}</span>
																{s.name && (
																	<span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
																		নাম: {s.name}
																	</span>
																)}
																{!s.isActive && (
																	<span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1 rounded">
																		Inactive
																	</span>
																)}
															</li>
														))}
													{students.filter((s) => {
														const normalizedSearch = formData.roll
															.toString()
															.trim();
														const normalizedRoll = (s.roll || "")
															.toString()
															.trim();
														return normalizedRoll.includes(normalizedSearch);
													}).length === 0 && (
														<li className="px-4 py-3 text-sm text-gray-500 text-center italic">
															কোনো রোল পাওয়া যায়নি
														</li>
													)}
												</>
											}
										</ul>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label className={labelClasses}>বিভাগ *</Label>
									<Select
										value={formData.department}
										onValueChange={(value) => {
											const conf = classConfigs.find(
												(c: any) => c.department === value,
											);
											setFormAvailableClasses(conf ? conf.classes : []);
											setFormAvailableExams(conf ? conf.exams || [] : []);
											setFormData({
												...formData,
												department: value,
												class: "",
												term: "",
												subjects: getSubjectsForClass(value, ""),
											});
										}}
									>
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
								<div className="space-y-2">
									<Label className={labelClasses}>শ্রেণী *</Label>
									<Select
										value={formData.class}
										onValueChange={(value) =>
											setFormData({
												...formData,
												class: value,
												subjects: getSubjectsForClass(formData.department, value),
											})
										}
										disabled={!formData.department}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											{formAvailableClasses.map((cl: any) => (
												<SelectItem key={cl} value={cl}>
													{cl}
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
										disabled={!formData.department}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											{formAvailableExams.map((t) => (
												<SelectItem key={t} value={t}>
													{t}
												</SelectItem>
											))}
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
										className="text-green-600 border-green-600 hover:bg-green-50 flex items-center gap-1"
									>
										<Plus className="w-4 h-4" /> নতুন বিষয় যোগ করুন
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
															e.target.value,
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
													size="icon"
													onClick={() => removeSubject(index)}
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

							<div className="space-y-4 pt-2">
								<Label className={labelClasses}>ফলাফলের অবস্থা</Label>
								<Select
									value={formData.status}
									onValueChange={(value: "draft" | "published") =>
										setFormData({ ...formData, status: value })
									}
								>
									<SelectTrigger className={selectClasses}>
										<SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="draft">Draft (ড্রাফট)</SelectItem>
										<SelectItem value="published">
											Published (পাবলিশড)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Total Marks Display */}
							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
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
