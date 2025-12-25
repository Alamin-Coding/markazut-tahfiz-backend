"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { Download, Search } from "lucide-react";
import * as XLSX from "xlsx";
import StudentAddForm from "@/components/dashboard/StudentAddForm";
import IncomeAddForm from "@/components/dashboard/IncomeAddForm";
import ExpenseAddForm from "@/components/dashboard/ExpenseAddForm";

type Student = {
	_id: string;
	name: string;
	class: string;
	section?: string;
	guardianPhone: string;
	feePlan?: { monthlyAmount?: number };
};

type Admission = {
	_id: string;
	name: string;
	class: string;
	phone: string;
	status: string;
	createdAt: string;
};

const inputClass = "w-full";

async function jsonFetch(url: string, options?: RequestInit) {
	const res = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options?.headers || {}),
		},
	});
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data?.message || "Request failed");
	}
	return data;
}

export default function ControlDashboardPage() {
	const tabs = [
		{ id: "students", label: "ছাত্র ও ফি" },
		{ id: "finance", label: "আয়/ব্যয়" },
		{ id: "settings", label: "সেটিংস/শ্রেণী" },
		{ id: "sms", label: "বাল্ক SMS" },
	];

	const [activeTab, setActiveTab] = useState<string>("students");
	const [students, setStudents] = useState<Student[]>([]);
	const [admissions, setAdmissions] = useState<Admission[]>([]);
	const [paymentSummary, setPaymentSummary] = useState<any>(null);
	const [payments, setPayments] = useState<any[]>([]);
	const [paymentSearch, setPaymentSearch] = useState("");
	const [paymentSearchDate, setPaymentSearchDate] = useState<Date | undefined>(
		undefined
	);
	const [paymentSortOrder, setPaymentSortOrder] = useState<"asc" | "desc">(
		"desc"
	);
	const [paymentPage, setPaymentPage] = useState(1);
	const [paymentLimit, setPaymentLimit] = useState(10);
	const [financeSummary, setFinanceSummary] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState<string | null>(null);
	const [studentAdmissionDate, setStudentAdmissionDate] = useState<
		Date | undefined
	>(undefined);
	const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
	const [paymentMonthDate, setPaymentMonthDate] = useState<Date | undefined>(
		undefined
	);
	const [financeViewMode, setFinanceViewMode] = useState<"month" | "year">(
		"month"
	);
	const [financeDateFrom, setFinanceDateFrom] = useState<Date | undefined>(
		undefined
	);
	const [financeDateTo, setFinanceDateTo] = useState<Date | undefined>(
		undefined
	);

	// Class Management State
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [newClassName, setNewClassName] = useState("");
	const [newDivisions, setNewDivisions] = useState("");
	const [editingClassId, setEditingClassId] = useState<string | null>(null);

	useEffect(() => {
		refreshStudents();
		refreshPaymentSummary();
		refreshPayments();
		refreshFinanceSummary();
		refreshAdmissions();
		refreshClassConfigs();
	}, []);

	const refreshClassConfigs = async () => {
		try {
			const res = await jsonFetch("/api/class-config");
			setClassConfigs(res.data || []);
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const handleSaveClass = async () => {
		try {
			if (!newClassName) throw new Error("শ্রেণীর নাম দিন");
			const divisionsArr = newDivisions
				.split(",")
				.map((d) => d.trim())
				.filter((d) => d);
			await jsonFetch("/api/class-config", {
				method: "POST",
				body: JSON.stringify({
					id: editingClassId,
					className: newClassName,
					divisions: divisionsArr,
				}),
			});
			setNewClassName("");
			setNewDivisions("");
			setEditingClassId(null);
			refreshClassConfigs();
			setToast("শ্রেণী সফলভাবে সংরক্ষিত হয়েছে");
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const handleDeleteClass = async (id: string) => {
		if (!confirm("আপনি কি নিশ্চিতভাবে এই শ্রেণীটি মুছতে চান?")) return;
		try {
			await jsonFetch(`/api/class-config?id=${id}`, { method: "DELETE" });
			refreshClassConfigs();
			setToast("শ্রেণী মুছে ফেলা হয়েছে");
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const startEditClass = (conf: any) => {
		setEditingClassId(conf._id);
		setNewClassName(conf.className);
		setNewDivisions(conf.divisions.join(", "));
	};

	const refreshStudents = async () => {
		try {
			const res = await jsonFetch("/api/students");
			setStudents(res.data || []);
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const refreshAdmissions = async () => {
		try {
			const res = await jsonFetch("/api/admission");
			setAdmissions(res.data || []);
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const refreshPaymentSummary = async () => {
		try {
			const res = await jsonFetch("/api/payment/summary?groupBy=month");
			setPaymentSummary(res.data);
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const refreshPayments = async () => {
		try {
			const res = await jsonFetch("/api/payment");
			setPayments(res.data || []);
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const filteredPayments = useMemo(() => {
		return payments
			.filter((p) => {
				const searchLower = paymentSearch.toLowerCase();
				const matchesSearch =
					p.student?.name?.toLowerCase().includes(searchLower) ||
					p.student?.studentId?.toLowerCase().includes(searchLower);

				const matchesDate = paymentSearchDate
					? format(new Date(p.paidAt), "dd-MM-yyyy") ===
					  format(paymentSearchDate, "dd-MM-yyyy")
					: true;

				return matchesSearch && matchesDate;
			})
			.sort((a, b) => {
				const dateA = new Date(a.paidAt).getTime();
				const dateB = new Date(b.paidAt).getTime();
				return paymentSortOrder === "asc" ? dateA - dateB : dateB - dateA;
			});
	}, [payments, paymentSearch, paymentSearchDate, paymentSortOrder]);

	const startIndex = (paymentPage - 1) * paymentLimit;
	const paginatedPayments = useMemo(() => {
		return filteredPayments.slice(startIndex, startIndex + paymentLimit);
	}, [filteredPayments, startIndex, paymentLimit]);

	const refreshFinanceSummary = async (
		groupBy: "month" | "year" = "month",
		from?: Date,
		to?: Date
	) => {
		try {
			const params = new URLSearchParams({ groupBy });
			if (from) params.append("from", from.toISOString());
			if (to) params.append("to", to.toISOString());
			const res = await jsonFetch(`/api/finance/summary?${params.toString()}`);
			setFinanceSummary(res.data);
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const handleStudentCreate = async (formData: FormData) => {
		setLoading(true);
		setToast(null);
		try {
			const payload: any = Object.fromEntries(formData.entries());
			if (studentAdmissionDate) {
				payload.admissionDate = studentAdmissionDate.toISOString();
			}
			if (payload.monthlyAmount) {
				payload.feePlan = { monthlyAmount: Number(payload.monthlyAmount) };
			}
			await jsonFetch("/api/students", {
				method: "POST",
				body: JSON.stringify(payload),
			});
			setToast("ছাত্র যোগ হয়েছে");
			await refreshStudents();
		} catch (err: any) {
			setToast(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handlePaymentCreate = async (formData: FormData) => {
		setLoading(true);
		setToast(null);
		try {
			const payload = Object.fromEntries(formData.entries());
			const monthOf =
				paymentMonthDate != null
					? format(paymentMonthDate, "yyyy-MM")
					: payload.monthOf;
			await jsonFetch("/api/payment", {
				method: "POST",
				body: JSON.stringify({
					studentId: payload.studentId,
					amount: Number(payload.amount),
					monthOf,
					paidAt: paymentDate ? paymentDate.toISOString() : payload.paidAt,
					method: payload.method,
					reference: payload.reference,
					notes: payload.notes,
				}),
			});
			setToast("পেমেন্ট সংরক্ষণ হয়েছে");
			await refreshPaymentSummary();
		} catch (err: any) {
			setToast(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleAdmissionStatus = async (id: string, status: string) => {
		setLoading(true);
		setToast(null);
		try {
			await jsonFetch(`/api/admission/${id}`, {
				method: "PUT",
				body: JSON.stringify({ status }),
			});
			setToast("অ্যাডমিশন স্ট্যাটাস আপডেট হয়েছে");
			await refreshAdmissions();
		} catch (err: any) {
			setToast(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleBulkSms = async (formData: FormData) => {
		setLoading(true);
		setToast(null);
		try {
			const payload = Object.fromEntries(formData.entries());
			const numbers = (payload.numbers as string)
				.split(",")
				.map((n) => n.trim())
				.filter(Boolean);
			await jsonFetch("/api/notifications/sms/bulk", {
				method: "POST",
				body: JSON.stringify({
					numbers,
					message: payload.message,
					title: payload.title,
				}),
			});
			setToast("Bulk SMS queue হয়েছে");
		} catch (err: any) {
			setToast(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDownloadPDF = async () => {
		try {
			// Dynamically import jsPDF
			const { default: jsPDF } = await import("jspdf");
			await import("jspdf-autotable");

			const doc = new jsPDF() as any;

			// Title
			doc.setFontSize(18);
			doc.text("Ay-Byay Sarangsho (Income-Expense Summary)", 14, 20);

			// Date range info
			doc.setFontSize(10);
			let yPos = 30;
			if (financeDateFrom || financeDateTo) {
				const fromStr = financeDateFrom
					? format(financeDateFrom, "dd/MM/yyyy")
					: "N/A";
				const toStr = financeDateTo
					? format(financeDateTo, "dd/MM/yyyy")
					: "N/A";
				doc.text(`Date Range: ${fromStr} - ${toStr}`, 14, yPos);
				yPos += 7;
			}
			doc.text(
				`View Mode: ${financeViewMode === "month" ? "Monthly" : "Yearly"}`,
				14,
				yPos
			);
			yPos += 10;

			// Overall Summary
			doc.setFontSize(14);
			doc.text("Overall Summary", 14, yPos);
			yPos += 7;

			const overallData = [
				["Total Income", `${financeSummary?.overall?.income?.total ?? 0} Tk`],
				["Total Expense", `${financeSummary?.overall?.expense?.total ?? 0} Tk`],
				["Net Balance", `${financeSummary?.overall?.net ?? 0} Tk`],
			];

			doc.autoTable({
				startY: yPos,
				head: [["Description", "Amount"]],
				body: overallData,
				theme: "grid",
			});

			yPos = doc.lastAutoTable.finalY + 10;

			// Monthly/Yearly Breakdown
			doc.setFontSize(14);
			doc.text(
				financeViewMode === "month" ? "Monthly Breakdown" : "Yearly Breakdown",
				14,
				yPos
			);
			yPos += 7;

			const incomeData = financeSummary?.incomeSummary || [];
			const expenseData = financeSummary?.expenseSummary || [];

			const breakdownData = incomeData.map((item: any) => {
				const exp = expenseData.find(
					(e: any) =>
						(e._id.month || e._id.year) === (item._id.month || item._id.year)
				) || { total: 0 };
				return [
					item._id.month || item._id.year,
					`${item.total} Tk`,
					`${exp.total} Tk`,
					`${item.total - (exp.total || 0)} Tk`,
				];
			});

			doc.autoTable({
				startY: yPos,
				head: [["Period", "Income", "Expense", "Net"]],
				body: breakdownData,
				theme: "striped",
			});

			// Save PDF
			const fileName = `Income-Expense-Summary-${format(
				new Date(),
				"yyyy-MM-dd"
			)}.pdf`;
			doc.save(fileName);
			setToast("PDF ডাউনলোড সফল হয়েছে");
		} catch (err: any) {
			setToast("PDF ডাউনলোড ব্যর্থ: " + err.message);
		}
	};

	const handleApplyFinanceFilter = () => {
		refreshFinanceSummary(financeViewMode, financeDateFrom, financeDateTo);
	};

	const monthSummary = useMemo(
		() => paymentSummary?.summary || [],
		[paymentSummary]
	);
	const financeIncome = useMemo(
		() => financeSummary?.incomeSummary || [],
		[financeSummary]
	);
	const financeExpense = useMemo(
		() => financeSummary?.expenseSummary || [],
		[financeSummary]
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-gray-900">
					ড্যাশবোর্ড কন্ট্রোল
				</h1>
				{toast && <span className="text-sm text-green-600">{toast}</span>}
			</div>

			<div className="space-y-4">
				<nav
					className="flex space-x-1 bg-gray-50 p-1 rounded-lg overflow-x-auto"
					aria-label="Tabs"
				>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"px-3 py-2 text-sm font-medium rounded-md transition-colors",
								activeTab === tab.id
									? "bg-white shadow text-green-700 border border-green-200"
									: "text-gray-600 hover:bg-white"
							)}
						>
							{tab.label}
						</button>
					))}
				</nav>

				{activeTab === "students" && (
					<>
						<StudentAddForm onSuccess={refreshStudents} />

						<Card>
							<CardHeader>
								<CardTitle>ফি পেমেন্ট</CardTitle>
							</CardHeader>
							<CardContent>
								<form
									className="grid grid-cols-1 md:grid-cols-2 gap-4"
									onSubmit={(e) => {
										e.preventDefault();
										handlePaymentCreate(new FormData(e.currentTarget));
									}}
								>
									<div>
										<Label>ছাত্র</Label>
										<select
											name="studentId"
											required
											className={cn("border rounded-md p-2 w-full", inputClass)}
										>
											<option value="">একজন নির্বাচন করুন</option>
											{students.map((s) => (
												<option key={s._id} value={s._id}>
													{s.name} ({s.class}
													{s.section ? `-${s.section}` : ""})
												</option>
											))}
										</select>
									</div>
									<div>
										<Label>পরিমাণ</Label>
										<Input
											name="amount"
											type="number"
											step="0.01"
											required
											className={inputClass}
										/>
									</div>
									<div>
										<Label>মাস (YYYY-MM)</Label>
										<div className="space-y-2">
											<DatePicker
												date={paymentMonthDate}
												onSelect={(date) =>
													setPaymentMonthDate(date || undefined)
												}
												placeholder="মাস নির্বাচন করুন"
												className="w-full"
											/>
											<input
												type="hidden"
												name="monthOf"
												value={
													paymentMonthDate
														? format(paymentMonthDate, "yyyy-MM")
														: ""
												}
											/>
										</div>
									</div>
									<div>
										<Label>পেমেন্ট তারিখ</Label>
										<div className="space-y-2">
											<DatePicker
												date={paymentDate}
												onSelect={setPaymentDate}
												placeholder="তারিখ বাছাই করুন"
												className="w-full"
											/>
											<input
												type="hidden"
												name="paidAt"
												value={paymentDate ? paymentDate.toISOString() : ""}
											/>
										</div>
									</div>
									<div>
										<Label>মেথড</Label>
										<select
											name="method"
											defaultValue="cash"
											className={cn("border rounded-md p-2 w-full", inputClass)}
										>
											<option value="cash">Cash</option>
											<option value="bkash">bKash</option>
											<option value="nagad">Nagad</option>
											<option value="card">Card</option>
											<option value="bank">Bank</option>
											<option value="other">Other</option>
										</select>
									</div>
									<div>
										<Label>রেফারেন্স</Label>
										<Input name="reference" className={inputClass} />
									</div>
									<div className="md:col-span-2">
										<Label>নোট</Label>
										<Textarea name="notes" rows={2} />
									</div>
									<div className="md:col-span-2">
										<Button type="submit" disabled={loading}>
											{loading ? "সংরক্ষণ হচ্ছে..." : "পেমেন্ট যোগ করুন"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle>মাসভিত্তিক ফি সারাংশ</CardTitle>
								<div className="flex items-center gap-2">
									<div className="flex items-center px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 overflow-hidden max-w-xs transition-all focus-within:ring-2 focus-within:ring-blue-500">
										<Search className="w-4 h-4 text-gray-400 mr-2" />
										<input
											type="text"
											placeholder="নাম বা আইডি..."
											value={paymentSearch}
											onChange={(e) => setPaymentSearch(e.target.value)}
											className="outline-none bg-transparent text-gray-900 dark:text-white text-sm w-32 focus:w-48 transition-all"
										/>
									</div>
									<DatePicker
										date={paymentSearchDate}
										onSelect={setPaymentSearchDate}
										placeholder="তারিখ"
										className="w-32"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setPaymentSortOrder(
												paymentSortOrder === "asc" ? "desc" : "asc"
											)
										}
										className="h-9 w-9 p-0"
										title={
											paymentSortOrder === "asc" ? "Ascending" : "Descending"
										}
									>
										{paymentSortOrder === "asc" ? "↑" : "↓"}
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											const exportData = payments.map((p) => ({
												"Student ID": p.student?.studentId || "",
												Name: p.student?.name || "",
												Class: p.student?.class || "",
												Amount: p.amount,
												Month: p.monthOf,
												Date: p.paidAt
													? format(new Date(p.paidAt), "dd-MM-yyyy")
													: "",
												Method: p.method,
											}));
											const wb = XLSX.utils.book_new();
											const ws = XLSX.utils.json_to_sheet(exportData);
											XLSX.utils.book_append_sheet(wb, ws, "Payments");
											XLSX.writeFile(wb, "Payment_Summary.xlsx");
										}}
										className="h-9 px-3 gap-2"
									>
										<Download className="w-4 h-4" />
										Export
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-sm mb-4 text-gray-500">
									মোট: {paymentSummary?.overall?.total ?? 0} Tk (
									{paymentSummary?.overall?.count ?? 0} টি পেমেন্ট)
								</div>
								<div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
									<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
										<thead className="bg-gray-50 dark:bg-gray-900">
											<tr>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
													আইডি
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
													নাম
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
													শ্রেণী
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
													টাকা
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
													মাস
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
													তারিখ
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
													মাধ্যম
												</th>
											</tr>
										</thead>
										<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
											{(() => {
												if (paginatedPayments.length === 0) {
													return (
														<tr>
															<td
																colSpan={7}
																className="px-4 py-8 text-center text-gray-500"
															>
																কোন পেমেন্ট ডাটা পাওয়া যায়নি
															</td>
														</tr>
													);
												}

												return paginatedPayments.map((p) => (
													<tr
														key={p._id}
														className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
													>
														<td className="px-4 py-3 text-sm font-medium text-blue-600">
															{p.student?.studentId}
														</td>
														<td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
															{p.student?.name}
														</td>
														<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
															{p.student?.class}
														</td>
														<td className="px-4 py-3 text-sm font-bold text-green-600">
															{p.amount} Tk
														</td>
														<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
															{p.monthOf}
														</td>
														<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
															{p.paidAt
																? format(new Date(p.paidAt), "dd-MM-yyyy")
																: "-"}
														</td>
														<td className="px-4 py-3 text-sm">
															<span
																className={`px-2 py-0.5 rounded-full text-[11px] font-medium uppercase ${
																	p.method === "cash"
																		? "bg-orange-100 text-orange-700"
																		: p.method === "bkash"
																		? "bg-pink-100 text-pink-700"
																		: "bg-blue-100 text-blue-700"
																}`}
															>
																{p.method}
															</span>
														</td>
													</tr>
												));
											})()}
										</tbody>
									</table>
								</div>

								{/* Pagination Controls */}
								{filteredPayments.length > paymentLimit && (
									<div className="flex items-center justify-between mt-4 px-2">
										<p className="text-sm text-gray-500">
											Showing {startIndex + 1} to{" "}
											{Math.min(
												startIndex + paymentLimit,
												filteredPayments.length
											)}{" "}
											of {filteredPayments.length} entries
										</p>
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setPaymentPage((p) => Math.max(1, p - 1))
												}
												disabled={paymentPage === 1}
											>
												Previous
											</Button>
											<span className="text-sm font-medium">
												Page {paymentPage}
											</span>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setPaymentPage((p) => p + 1)}
												disabled={
													startIndex + paymentLimit >= filteredPayments.length
												}
											>
												Next
											</Button>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</>
				)}

				{activeTab === "finance" && (
					<>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<IncomeAddForm onSuccess={refreshFinanceSummary} />
							<ExpenseAddForm onSuccess={refreshFinanceSummary} />
						</div>

						<Card>
							<CardHeader>
								<CardTitle>মাসভিত্তিক আয়-ব্যয় সারাংশ</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-sm">
									মোট আয়: {financeSummary?.overall?.income?.total ?? 0} | মোট
									ব্যয়: {financeSummary?.overall?.expense?.total ?? 0} | নিট:{" "}
									<span className="font-semibold text-gray-800">
										{financeSummary?.overall?.net ?? 0}
									</span>
								</div>
							</CardContent>
						</Card>
					</>
				)}

				{activeTab === "settings" && (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>
									{editingClassId ? "শ্রেণী সম্পাদনা" : "নতুন শ্রেণী যোগ করুন"}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
									<div className="space-y-2">
										<Label>শ্রেণীর নাম</Label>
										<Input
											placeholder="যেমন: ১ম শ্রেণী"
											value={newClassName}
											onChange={(e) => setNewClassName(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label>বিভাগসমূহ (কমা দিয়ে লিখুন)</Label>
										<Input
											placeholder="যেমন: ক, খ, গ"
											value={newDivisions}
											onChange={(e) => setNewDivisions(e.target.value)}
										/>
									</div>
									<div className="flex gap-2">
										<Button onClick={handleSaveClass}>
											{editingClassId ? "আপডেট করুন" : "যোগ করুন"}
										</Button>
										{editingClassId && (
											<Button
												variant="outline"
												onClick={() => {
													setEditingClassId(null);
													setNewClassName("");
													setNewDivisions("");
												}}
											>
												বাতিল
											</Button>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>বিদ্যমান শ্রেণীসমূহ</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead>
											<tr>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													শ্রেণীর নাম
												</th>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													বিভাগসমূহ
												</th>
												<th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
													অ্যাকশন
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{classConfigs.map((conf: any) => (
												<tr key={conf._id}>
													<td className="px-4 py-2 text-sm">
														{conf.className}
													</td>
													<td className="px-4 py-2 text-sm">
														{conf.divisions.join(", ")}
													</td>
													<td className="px-4 py-2 text-sm text-right space-x-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => startEditClass(conf)}
														>
															সম্পাদনা
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="text-red-600"
															onClick={() => handleDeleteClass(conf._id)}
														>
															মুছুন
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{activeTab === "sms" && (
					<Card>
						<CardHeader>
							<CardTitle>বাল্ক SMS</CardTitle>
						</CardHeader>
						<CardContent>
							<form
								className="space-y-3"
								onSubmit={(e) => {
									e.preventDefault();
									handleBulkSms(new FormData(e.currentTarget));
								}}
							>
								<div>
									<Label>শিরোনাম</Label>
									<Input name="title" placeholder="Notification title" />
								</div>
								<div>
									<Label>ফোন নম্বর (কমা-সেপারেটেড)</Label>
									<Textarea
										name="numbers"
										rows={2}
										placeholder="017xxxxxxxx, 018xxxxxxxx"
										required
									/>
								</div>
								<div>
									<Label>মেসেজ</Label>
									<Textarea name="message" rows={3} required />
								</div>
								<Button type="submit" disabled={loading}>
									{loading ? "কিউ হচ্ছে..." : "SMS পাঠান"}
								</Button>
							</form>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
