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
		{ id: "sms", label: "বাল্ক SMS" },
	];

	const [activeTab, setActiveTab] = useState<string>("students");
	const [students, setStudents] = useState<Student[]>([]);
	const [admissions, setAdmissions] = useState<Admission[]>([]);
	const [paymentSummary, setPaymentSummary] = useState<any>(null);
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
	const [incomeDate, setIncomeDate] = useState<Date | undefined>(undefined);
	const [expenseDate, setExpenseDate] = useState<Date | undefined>(undefined);
	const [financeViewMode, setFinanceViewMode] = useState<"month" | "year">(
		"month"
	);
	const [financeDateFrom, setFinanceDateFrom] = useState<Date | undefined>(
		undefined
	);
	const [financeDateTo, setFinanceDateTo] = useState<Date | undefined>(
		undefined
	);

	useEffect(() => {
		refreshStudents();
		refreshPaymentSummary();
		refreshFinanceSummary();
		refreshAdmissions();
	}, []);

	const refreshStudents = async () => {
		try {
			const res = await jsonFetch("/api/student");
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
			await jsonFetch("/api/student", {
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

	const handleIncomeCreate = async (formData: FormData) => {
		setLoading(true);
		setToast(null);
		try {
			const payload = Object.fromEntries(formData.entries());
			await jsonFetch("/api/finance/income", {
				method: "POST",
				body: JSON.stringify({
					source: payload.source,
					amount: Number(payload.amount),
					date: incomeDate ? incomeDate.toISOString() : payload.date,
					category: payload.category,
					notes: payload.notes,
				}),
			});
			setToast("আয় যোগ হয়েছে");
			await refreshFinanceSummary();
		} catch (err: any) {
			setToast(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleExpenseCreate = async (formData: FormData) => {
		setLoading(true);
		setToast(null);
		try {
			const payload = Object.fromEntries(formData.entries());
			await jsonFetch("/api/finance/expense", {
				method: "POST",
				body: JSON.stringify({
					category: payload.category,
					amount: Number(payload.amount),
					date: expenseDate ? expenseDate.toISOString() : payload.date,
					payee: payload.payee,
					notes: payload.notes,
				}),
			});
			setToast("ব্যয় যোগ হয়েছে");
			await refreshFinanceSummary();
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
						<Card>
							<CardHeader>
								<CardTitle>নতুন ছাত্র</CardTitle>
							</CardHeader>
							<CardContent>
								<form
									className="grid grid-cols-1 md:grid-cols-2 gap-4"
									onSubmit={(e) => {
										e.preventDefault();
										handleStudentCreate(new FormData(e.currentTarget));
									}}
								>
									<div>
										<Label>নাম</Label>
										<Input name="name" required className={inputClass} />
									</div>
									<div>
										<Label>ইমেইল</Label>
										<Input name="email" type="email" className={inputClass} />
									</div>
									<div>
										<Label>অভিভাবকের নাম</Label>
										<Input name="guardianName" className={inputClass} />
									</div>
									<div>
										<Label>অভিভাবকের ফোন</Label>
										<Input
											name="guardianPhone"
											required
											className={inputClass}
										/>
									</div>
									<div>
										<Label>ক্লাস</Label>
										<Input name="class" required className={inputClass} />
									</div>
									<div>
										<Label>সেকশন</Label>
										<Input name="section" className={inputClass} />
									</div>
									<div>
										<Label>ভর্তি তারিখ</Label>
										<div className="space-y-2">
											<DatePicker
												date={studentAdmissionDate}
												onSelect={setStudentAdmissionDate}
												placeholder="ভর্তি তারিখ নির্বাচন করুন"
												className="w-full"
											/>
											<input
												type="hidden"
												name="admissionDate"
												value={
													studentAdmissionDate
														? studentAdmissionDate.toISOString()
														: ""
												}
											/>
										</div>
									</div>
									<div>
										<Label>স্ট্যাটাস</Label>
										<select
											name="status"
											defaultValue="active"
											className={cn("border rounded-md p-2 w-full", inputClass)}
										>
											<option value="active">Active</option>
											<option value="inactive">Inactive</option>
											<option value="passed">Passed</option>
											<option value="left">Left</option>
										</select>
									</div>
									<div>
										<Label>মাসিক ফি</Label>
										<Input
											name="monthlyAmount"
											type="number"
											className={inputClass}
										/>
									</div>
									<div className="md:col-span-2">
										<Button type="submit" disabled={loading}>
											{loading ? "সংরক্ষণ হচ্ছে..." : "ছাত্র যোগ করুন"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>

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
							<CardHeader>
								<CardTitle>মাসভিত্তিক ফি সারাংশ</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-sm">
									মোট: {paymentSummary?.overall?.total ?? 0} Tk (
									{paymentSummary?.overall?.count ?? 0} টি পেমেন্ট)
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									{monthSummary.map((item: any) => (
										<div
											key={item._id.month || item._id.year}
											className="border rounded-md p-3"
										>
											<div className="font-medium">
												{item._id.month || item._id.year}
											</div>
											<div className="text-sm text-gray-600">
												মোট: {item.total}
											</div>
											<div className="text-xs text-gray-500">
												লেনদেন: {item.count}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</>
				)}

				{activeTab === "finance" && (
					<>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>আয় যোগ করুন</CardTitle>
								</CardHeader>
								<CardContent>
									<form
										className="space-y-3"
										onSubmit={(e) => {
											e.preventDefault();
											handleIncomeCreate(new FormData(e.currentTarget));
										}}
									>
										<div>
											<Label>সূত্র</Label>
											<Input name="source" required />
										</div>
										<div>
											<Label>পরিমাণ</Label>
											<Input name="amount" type="number" required />
										</div>
										<div>
											<Label>তারিখ</Label>
											<div className="space-y-2">
												<DatePicker
													date={incomeDate}
													onSelect={setIncomeDate}
													placeholder="তারিখ বাছাই করুন"
													className="w-full"
												/>
												<input
													type="hidden"
													name="date"
													value={incomeDate ? incomeDate.toISOString() : ""}
												/>
											</div>
										</div>
										<div>
											<Label>ক্যাটাগরি</Label>
											<Input name="category" placeholder="general" />
										</div>
										<div>
											<Label>নোট</Label>
											<Textarea name="notes" rows={2} />
										</div>
										<Button type="submit" disabled={loading}>
											{loading ? "সংরক্ষণ হচ্ছে..." : "আয় যোগ করুন"}
										</Button>
									</form>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>ব্যয় যোগ করুন</CardTitle>
								</CardHeader>
								<CardContent>
									<form
										className="space-y-3"
										onSubmit={(e) => {
											e.preventDefault();
											handleExpenseCreate(new FormData(e.currentTarget));
										}}
									>
										<div>
											<Label>ক্যাটাগরি</Label>
											<Input name="category" required />
										</div>
										<div>
											<Label>পরিমাণ</Label>
											<Input name="amount" type="number" required />
										</div>
										<div>
											<Label>তারিখ</Label>
											<div className="space-y-2">
												<DatePicker
													date={expenseDate}
													onSelect={setExpenseDate}
													placeholder="তারিখ বাছাই করুন"
													className="w-full"
												/>
												<input
													type="hidden"
													name="date"
													value={expenseDate ? expenseDate.toISOString() : ""}
												/>
											</div>
										</div>
										<div>
											<Label>প্রাপক</Label>
											<Input name="payee" />
										</div>
										<div>
											<Label>নোট</Label>
											<Textarea name="notes" rows={2} />
										</div>
										<Button type="submit" disabled={loading}>
											{loading ? "সংরক্ষণ হচ্ছে..." : "ব্যয় যোগ করুন"}
										</Button>
									</form>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>মাসভিত্তিক আয়-ব্যয় সারাংশ</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-sm">
									মোট আয়: {financeSummary?.overall?.income?.total ?? 0} | মোট
									ব্যয়: {financeSummary?.overall?.expense?.total ?? 0} | নিট:{" "}
									{financeSummary?.overall?.net ?? 0}
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
									{financeIncome.map((item: any) => {
										const exp = financeExpense.find(
											(e: any) => e._id.month === item._id.month
										) || { total: 0 };
										return (
											<div
												key={item._id.month || item._id.year}
												className="border rounded-md p-3"
											>
												<div className="font-medium">
													{item._id.month || item._id.year}
												</div>
												<div className="text-sm text-green-700">
													আয়: {item.total}
												</div>
												<div className="text-sm text-red-700">
													ব্যয়: {exp.total}
												</div>
												<div className="text-sm font-semibold">
													নিট: {item.total - (exp.total || 0)}
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</>
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
