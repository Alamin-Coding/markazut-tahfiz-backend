"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download } from "lucide-react";

export default function FinanceContent() {
	const [financeSummary, setFinanceSummary] = useState<any>(null);
	const [financeViewMode, setFinanceViewMode] = useState<"month" | "year">(
		"month"
	);
	const [financeDateFrom, setFinanceDateFrom] = useState<Date | undefined>(
		undefined
	);
	const [financeDateTo, setFinanceDateTo] = useState<Date | undefined>(
		undefined
	);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState<string | null>(null);

	const [incomes, setIncomes] = useState<any[]>([]);
	const [expenses, setExpenses] = useState<any[]>([]);
	const [incomeSearch, setIncomeSearch] = useState("");
	const [expenseSearch, setExpenseSearch] = useState("");
	const [incomeSearchDate, setIncomeSearchDate] = useState<Date | undefined>(
		undefined
	);
	const [expenseSearchDate, setExpenseSearchDate] = useState<Date | undefined>(
		undefined
	);
	const [incomeSortOrder, setIncomeSortOrder] = useState<"asc" | "desc">("asc");
	const [expenseSortOrder, setExpenseSortOrder] = useState<"asc" | "desc">(
		"asc"
	);
	const [editingItem, setEditingItem] = useState<any>(null);

	const [incomePage, setIncomePage] = useState(1);
	const [expensePage, setExpensePage] = useState(1);
	const [incomeLimit, setIncomeLimit] = useState(10);
	const [expenseLimit, setExpenseLimit] = useState(10);
	const [itemToDelete, setItemToDelete] = useState<{
		type: "income" | "expense";
		id: string;
	} | null>(null);

	useEffect(() => {
		refreshFinanceSummary();
		fetchIncomes();
		fetchExpenses();
	}, [financeDateFrom, financeDateTo]);

	const fetchIncomes = async () => {
		try {
			const params = new URLSearchParams();
			if (financeDateFrom) params.append("from", financeDateFrom.toISOString());
			if (financeDateTo) params.append("to", financeDateTo.toISOString());
			const res = await fetch(`/api/finance/income?${params.toString()}`);
			const data = await res.json();
			if (data.success) setIncomes(data.data);
		} catch (err: any) {
			console.error("Fetch incomes error:", err);
		}
	};

	const fetchExpenses = async () => {
		try {
			const params = new URLSearchParams();
			if (financeDateFrom) params.append("from", financeDateFrom.toISOString());
			if (financeDateTo) params.append("to", financeDateTo.toISOString());
			const res = await fetch(`/api/finance/expense?${params.toString()}`);
			const data = await res.json();
			if (data.success) setExpenses(data.data);
		} catch (err: any) {
			console.error("Fetch expenses error:", err);
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
			const res = await fetch(`/api/finance/summary?${params.toString()}`);
			const data = await res.json();
			setFinanceSummary(data.data);
		} catch (err: any) {
			setToast(err.message);
		}
	};

	const clearIncomeFilters = () => {
		setIncomeSearch("");
		setIncomeSearchDate(undefined);
	};

	const clearExpenseFilters = () => {
		setExpenseSearch("");
		setExpenseSearchDate(undefined);
	};

	const handleItemDelete = async (type: "income" | "expense", id: string) => {
		try {
			const res = await fetch(`/api/finance/${type}/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success) {
				setToast(`${type === "income" ? "আয়" : "ব্যয়"} মুছে ফেলা হয়েছে`);
				refreshFinanceSummary(financeViewMode, financeDateFrom, financeDateTo);
				if (type === "income") fetchIncomes();
				else fetchExpenses();
			} else {
				throw new Error(data.message);
			}
		} catch (err: any) {
			setToast("মুছে ফেলা ব্যর্থ: " + err.message);
		}
	};

	const handleItemUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!editingItem) return;

		setLoading(true);
		try {
			const formData = new FormData(e.currentTarget);
			const payload = Object.fromEntries(formData.entries());

			const res = await fetch(
				`/api/finance/${editingItem.type}/${editingItem._id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...payload,
						amount: Number(payload.amount),
					}),
				}
			);
			const data = await res.json();
			if (data.success) {
				setToast(
					`${editingItem.type === "income" ? "আয়" : "ব্যয়"} আপডেট সফল হয়েছে`
				);
				setEditingItem(null);
				refreshFinanceSummary(financeViewMode, financeDateFrom, financeDateTo);
				if (editingItem.type === "income") fetchIncomes();
				else fetchExpenses();
			} else {
				throw new Error(data.message);
			}
		} catch (err: any) {
			setToast("আপডেট ব্যর্থ: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	const exportToExcel = async (type: "income" | "expense", data: any[]) => {
		try {
			const { utils, writeFile } = await import("xlsx");
			const worksheet = utils.json_to_sheet(data);
			const workbook = utils.book_new();
			utils.book_append_sheet(
				workbook,
				worksheet,
				type === "income" ? "Incomes" : "Expenses"
			);
			writeFile(
				workbook,
				`${type}-report-${format(new Date(), "yyyy-MM-dd")}.xlsx`
			);
			setToast("Excel এক্সপোর্ট সফল হয়েছে");
		} catch (err: any) {
			setToast("Excel এক্সপোর্ট ব্যর্থ");
		}
	};

	const handleDownloadPDF = async () => {
		try {
			const { default: jsPDF } = await import("jspdf");
			const { default: autoTable } = await import("jspdf-autotable");

			const doc = new jsPDF();

			doc.setFontSize(18);
			doc.text("Ay-Byay Sarangsho (Income-Expense Summary)", 14, 20);

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

			doc.setFontSize(14);
			doc.text("Overall Summary", 14, yPos);
			yPos += 7;

			const overallData = [
				["Total Income", `${financeSummary?.overall?.income?.total ?? 0} Tk`],
				["Total Expense", `${financeSummary?.overall?.expense?.total ?? 0} Tk`],
				["Net Balance", `${financeSummary?.overall?.net ?? 0} Tk`],
			];

			autoTable(doc, {
				startY: yPos,
				head: [["Description", "Amount"]],
				body: overallData,
				theme: "grid",
			});

			yPos = (doc as any).lastAutoTable.finalY + 10;

			doc.setFontSize(14);
			doc.text(
				financeViewMode === "month" ? "Monthly Breakdown" : "Yearly Breakdown",
				14,
				yPos
			);
			yPos += 7;

			const incomeData = financeSummary?.incomeSummary || [];
			const expenseData = financeSummary?.expenseSummary || [];

			// Get all unique periods from both income and expense
			const periods = Array.from(
				new Set([
					...incomeData.map((i: any) => i._id.month || i._id.year),
					...expenseData.map((e: any) => e._id.month || e._id.year),
				])
			).sort() as string[];

			const breakdownData = periods.map((period) => {
				const inc = incomeData.find(
					(i: any) => (i._id.month || i._id.year) === period
				) || { total: 0 };
				const exp = expenseData.find(
					(e: any) => (e._id.month || e._id.year) === period
				) || { total: 0 };
				return [
					period,
					`${inc.total} Tk`,
					`${exp.total} Tk`,
					`${inc.total - exp.total} Tk`,
				];
			});

			autoTable(doc, {
				startY: yPos,
				head: [["Period", "Income", "Expense", "Net"]],
				body: breakdownData,
				theme: "striped",
			});

			const fileName = `Income-Expense-Summary-${format(
				new Date(),
				"yyyy-MM-dd"
			)}.pdf`;
			doc.save(fileName);
			setToast("PDF ডাউনলোড সফল হয়েছে");
		} catch (err: any) {
			console.error("PDF Download Error:", err);
			setToast("PDF ডাউনলোড ব্যর্থ: " + (err.message || "Unknown error"));
		}
	};

	const handleApplyFinanceFilter = () => {
		refreshFinanceSummary(financeViewMode, financeDateFrom, financeDateTo);
	};

	const financeIncome = financeSummary?.incomeSummary || [];
	const financeExpense = financeSummary?.expenseSummary || [];

	return (
		<div className="space-y-6">
			{toast && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
					{toast}
					<button
						className="absolute top-0 right-0 px-4 py-3"
						onClick={() => setToast(null)}
					>
						×
					</button>
				</div>
			)}

			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
				<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
					আয়-ব্যয় সারাংশ ফিল্টার
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<Label className={labelClasses}>ভিউ মোড</Label>
						<Select
							value={financeViewMode}
							onValueChange={(value: "month" | "year") =>
								setFinanceViewMode(value)
							}
						>
							<SelectTrigger className={selectClasses}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="month">মাসিক</SelectItem>
								<SelectItem value="year">বার্ষিক</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className={labelClasses}>শুরুর তারিখ</Label>
						<DatePicker
							date={financeDateFrom}
							onSelect={setFinanceDateFrom}
							placeholder="শুরুর তারিখ"
							className="w-full"
						/>
					</div>
					<div>
						<Label className={labelClasses}>শেষ তারিখ</Label>
						<DatePicker
							date={financeDateTo}
							onSelect={setFinanceDateTo}
							placeholder="শেষ তারিখ"
							className="w-full"
						/>
					</div>
					<div className="flex items-end">
						<Button onClick={handleApplyFinanceFilter} className="w-full h-11">
							ফিল্টার প্রয়োগ করুন
						</Button>
					</div>
				</div>
			</div>

			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
				<div className="flex justify-between items-center mb-4">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							{financeViewMode === "month" ? "মাসভিত্তিক" : "বার্ষিক"} আয়-ব্যয়
							সারাংশ
						</h3>
						{(financeDateFrom || financeDateTo) && (
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								{financeDateFrom
									? format(financeDateFrom, "dd/MM/yyyy")
									: "শুরু"}{" "}
								থেকে{" "}
								{financeDateTo ? format(financeDateTo, "dd/MM/yyyy") : "শেষ"}
							</p>
						)}
					</div>
					<Button
						onClick={handleDownloadPDF}
						variant="outline"
						size="sm"
						className="h-10"
					>
						PDF ডাউনলোড করুন
					</Button>
				</div>
				<div className="space-y-3">
					<div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border dark:border-gray-700">
						মোট আয়:{" "}
						<span className="font-bold text-green-600 dark:text-green-400">
							{financeSummary?.overall?.income?.total ?? 0} Tk
						</span>{" "}
						| মোট ব্যয়:{" "}
						<span className="font-bold text-red-600 dark:text-red-400">
							{financeSummary?.overall?.expense?.total ?? 0} Tk
						</span>{" "}
						| নিট:{" "}
						<span className="font-bold text-blue-600 dark:text-blue-400">
							{financeSummary?.overall?.net ?? 0} Tk
						</span>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{(() => {
							// Get all periods
							const allPeriods = Array.from(
								new Set([
									...financeIncome.map((i: any) => i._id.month || i._id.year),
									...financeExpense.map((e: any) => e._id.month || e._id.year),
								])
							).sort() as string[];

							// Get current month in format "YYYY-MM"
							const currentDate = new Date();
							const currentMonth = format(currentDate, "yyyy-MM");
							const currentYear = format(currentDate, "yyyy");

							// Filter to show only yearly and current month
							const filteredPeriods = allPeriods.filter((period) => {
								// Show if it's a year (4 digits) or current month
								return period.length === 4 || period === currentMonth;
							});

							return filteredPeriods.map((period) => {
								const inc = financeIncome.find(
									(i: any) => (i._id.month || i._id.year) === period
								) || { total: 0 };
								const exp = financeExpense.find(
									(e: any) => (e._id.month || e._id.year) === period
								) || { total: 0 };
								const net = inc.total - exp.total;

								// Format the period display
								let displayPeriod = period;
								if (period.length === 7) {
									// YYYY-MM format
									const [year, month] = period.split("-");
									const monthNames = [
										"January",
										"February",
										"March",
										"April",
										"May",
										"June",
										"July",
										"August",
										"September",
										"October",
										"November",
										"December",
									];
									displayPeriod = `${monthNames[parseInt(month) - 1]} ${year}`;
								}

								return (
									<div
										key={period}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30 hover:shadow-md transition-shadow"
									>
										<div className="font-bold text-gray-900 dark:text-white mb-2 border-b dark:border-gray-700 pb-1 text-lg">
											{displayPeriod}{" "}
											{period === currentMonth ? (
												<span className="text-blue-600 font-light dark:text-blue-400">
													(Current Month)
												</span>
											) : (
												<span className="text-gray-600 font-light dark:text-gray-400">
													(Previous Month)
												</span>
											)}
										</div>
										<div className="flex justify-between text-sm py-1">
											<span className="text-gray-600 dark:text-gray-400">
												আয়:
											</span>
											<span className="text-green-600 dark:text-green-400 font-medium">
												{inc.total} Tk
											</span>
										</div>
										<div className="flex justify-between text-sm py-1">
											<span className="text-gray-600 dark:text-gray-400">
												ব্যয়:
											</span>
											<span className="text-red-600 dark:text-red-400 font-medium">
												{exp.total} Tk
											</span>
										</div>
										<div className="flex justify-between text-sm py-1 mt-1 border-t dark:border-gray-700 pt-2 font-bold">
											<span className="text-gray-900 dark:text-white">
												নিট:
											</span>
											<span
												className={`${
													net >= 0
														? "text-blue-600 dark:text-blue-400"
														: "text-red-600 dark:text-red-400"
												}`}
											>
												{net} Tk
											</span>
										</div>
									</div>
								);
							});
						})()}
					</div>

					{/* আয় সারাংশ */}
					<div className="overflow-x-auto p-6">
						<div className="flex gap-4 flex-wrap justify-between items-center mb-4">
							<h3 className="text-lg font-bold text-gray-900 dark:text-white">
								আয় সারাংশ
							</h3>
							<div className="flex-1 justify-end flex gap-2 items-center flex-wrap">
								<div className="flex items-center px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 overflow-hidden max-w-xs w-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 192.904 192.904"
										className="fill-gray-600 dark:fill-gray-400 mr-2 w-4 h-4"
									>
										<path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
									</svg>
									<input
										type="text"
										placeholder="আয় খুঁজুন..."
										value={incomeSearch}
										onChange={(e) => setIncomeSearch(e.target.value)}
										className="w-full outline-none bg-transparent text-gray-900 dark:text-white text-sm"
									/>
								</div>
								<DatePicker
									date={incomeSearchDate}
									onSelect={setIncomeSearchDate}
									placeholder="তারিখ দিয়ে খুঁজুন"
									className="w-48"
								/>
								<button
									type="button"
									onClick={() =>
										setIncomeSortOrder(
											incomeSortOrder === "asc" ? "desc" : "asc"
										)
									}
									className="text-slate-900 dark:text-gray-100 font-medium flex items-center px-3 py-2 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 cursor-pointer"
									title={incomeSortOrder === "asc" ? "Ascending" : "Descending"}
								>
									{incomeSortOrder === "asc" ? "↑" : "↓"}
								</button>
								<button
									type="button"
									onClick={clearIncomeFilters}
									className="text-red-600 dark:text-red-400 font-medium flex items-center px-4 py-2 rounded-md bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 cursor-pointer"
									title="রিসেট ফিল্টার"
								>
									রিসেট
								</button>
								<button
									type="button"
									onClick={() => exportToExcel("income", incomes)}
									className="text-blue-600 dark:text-gray-100 font-medium flex items-center px-4 py-2 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 overflow-hidden cursor-pointer"
								>
									<Download className="w-4 h-4 mr-2" /> Export Excel
								</button>
							</div>
						</div>

						<table className="min-w-full border border-gray-200 dark:border-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-900 whitespace-nowrap">
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Source
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Amount
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Date
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Category
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Note
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400">
										Actions
									</th>
								</tr>
							</thead>

							<tbody className="whitespace-nowrap divide-y divide-gray-200 dark:divide-gray-700">
								{(() => {
									const filtered = incomes
										.filter((i) => {
											const searchLower = incomeSearch.toLowerCase();
											const dateStr = i.date
												? format(new Date(i.date), "dd-MM-yyyy")
												: "";

											// Date picker filter
											if (incomeSearchDate) {
												const searchDateStr = format(
													incomeSearchDate,
													"dd-MM-yyyy"
												);
												if (dateStr !== searchDateStr) return false;
											}

											// Text search filter
											return (
												i.source?.toLowerCase().includes(searchLower) ||
												i.category?.toLowerCase().includes(searchLower) ||
												i.notes?.toLowerCase().includes(searchLower) ||
												dateStr.includes(searchLower)
											);
										})
										.sort((a, b) => {
											// Sort by date
											const dateA = new Date(a.date || 0).getTime();
											const dateB = new Date(b.date || 0).getTime();
											return incomeSortOrder === "asc"
												? dateA - dateB
												: dateB - dateA;
										});
									const total = filtered.length;
									const paginated = filtered.slice(
										(incomePage - 1) * incomeLimit,
										incomePage * incomeLimit
									);

									return paginated.map((item) => (
										<tr
											key={item._id}
											className="odd:bg-gray-50 dark:odd:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
										>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 font-medium border-r dark:border-gray-700">
												{item.source}
											</td>
											<td className="px-4 py-3 text-[13px] text-green-600 dark:text-green-400 font-bold border-r dark:border-gray-700">
												{item.amount} Tk
											</td>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 border-r dark:border-gray-700">
												{format(new Date(item.date), "dd-MM-yyyy")}
											</td>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 border-r dark:border-gray-700">
												{item.category}
											</td>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 max-w-xs truncate border-r dark:border-gray-700">
												{item.notes}
											</td>
											<td className="px-4 py-3 text-[13px]">
												<div className="flex items-center gap-3">
													<button
														onClick={() =>
															setEditingItem({ type: "income", ...item })
														}
														className="cursor-pointer"
														title="Edit"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
															viewBox="0 0 348.882 348.882"
														>
															<path d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z" />
														</svg>
													</button>
													<button
														onClick={() =>
															setItemToDelete({ type: "income", id: item._id })
														}
														className="cursor-pointer"
														title="Delete"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="w-5 h-5 fill-red-500 hover:fill-red-700"
															viewBox="0 0 24 24"
														>
															<path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
															<path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
														</svg>
													</button>
												</div>
											</td>
										</tr>
									));
								})()}
							</tbody>
						</table>

						{/* Pagination Income */}
						{(() => {
							const filtered = incomes
								.filter((i) => {
									const searchLower = incomeSearch.toLowerCase();
									const dateStr = i.date
										? format(new Date(i.date), "dd-MM-yyyy")
										: "";

									// Date picker filter
									if (incomeSearchDate) {
										const searchDateStr = format(
											incomeSearchDate,
											"dd-MM-yyyy"
										);
										if (dateStr !== searchDateStr) return false;
									}

									// Text search filter
									return (
										i.source?.toLowerCase().includes(searchLower) ||
										i.category?.toLowerCase().includes(searchLower) ||
										i.notes?.toLowerCase().includes(searchLower) ||
										dateStr.includes(searchLower)
									);
								})
								.sort((a, b) => {
									// Sort by date
									const dateA = new Date(a.date || 0).getTime();
									const dateB = new Date(b.date || 0).getTime();
									return incomeSortOrder === "asc"
										? dateA - dateB
										: dateB - dateA;
								});
							const total = filtered.length;
							const totalPages = Math.ceil(total / incomeLimit);
							if (total === 0) return null;

							return (
								<div className="md:flex mt-6 m-4">
									<p className="text-sm text-slate-600 dark:text-gray-400 flex-1">
										Showing {(incomePage - 1) * incomeLimit + 1} to{" "}
										{Math.min(incomePage * incomeLimit, total)} of {total}{" "}
										entries
									</p>
									<div className="flex items-center max-md:mt-4">
										<p className="text-sm text-slate-600 dark:text-gray-400">
											Display
										</p>
										<select
											value={incomeLimit}
											onChange={(e) => {
												setIncomeLimit(Number(e.target.value));
												setIncomePage(1);
											}}
											className="text-sm text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md h-8 mx-4 px-1 outline-none"
										>
											<option value={10}>10</option>
											<option value={20}>20</option>
											<option value={50}>50</option>
											<option value={100}>100</option>
										</select>

										<ul className="flex space-x-3 justify-center">
											<li
												onClick={() =>
													setIncomePage(Math.max(1, incomePage - 1))
												}
												className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-md cursor-pointer ${
													incomePage === 1 ? "bg-gray-100" : "bg-gray-200"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-3 fill-gray-400"
													viewBox="0 0 55.753 55.753"
												>
													<path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" />
												</svg>
											</li>
											{Array.from({ length: Math.min(5, totalPages) }).map(
												(_, i) => {
													const p = i + 1;
													return (
														<li
															key={p}
															onClick={() => setIncomePage(p)}
															className={`flex items-center justify-center shrink-0 border border-gray-300 dark:border-gray-700 cursor-pointer text-sm font-medium px-[13px] h-8 rounded-md ${
																incomePage === p
																	? "bg-blue-500 text-white border-blue-500"
																	: "text-slate-900 dark:text-white"
															}`}
														>
															{p}
														</li>
													);
												}
											)}
											<li
												onClick={() =>
													setIncomePage(Math.min(totalPages, incomePage + 1))
												}
												className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-md cursor-pointer ${
													incomePage === totalPages
														? "bg-gray-100"
														: "bg-gray-200"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-3 fill-gray-400 rotate-180"
													viewBox="0 0 55.753 55.753"
												>
													<path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" />
												</svg>
											</li>
										</ul>
									</div>
								</div>
							);
						})()}
					</div>

					{/* Divider */}
					<div className="h-px bg-gray-200 my-4"></div>

					{/* ব্যয় সারাংশ */}
					<div className="overflow-x-auto p-6">
						<div className="flex gap-4 flex-wrap justify-between items-center mb-4">
							<h3 className="text-lg font-bold text-gray-900 dark:text-white">
								ব্যয় সারাংশ
							</h3>
							<div className="flex-1 justify-end flex gap-2 items-center flex-wrap">
								<div className="flex items-center px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 overflow-hidden max-w-xs w-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 192.904 192.904"
										className="fill-gray-600 dark:fill-gray-400 mr-2 w-4 h-4"
									>
										<path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
									</svg>
									<input
										type="text"
										placeholder="ব্যয় খুঁজুন..."
										value={expenseSearch}
										onChange={(e) => setExpenseSearch(e.target.value)}
										className="w-full outline-none bg-transparent text-gray-900 dark:text-white text-sm"
									/>
								</div>
								<DatePicker
									date={expenseSearchDate}
									onSelect={setExpenseSearchDate}
									placeholder="তারিখ দিয়ে খুঁজুন"
									className="w-48"
								/>
								<button
									type="button"
									onClick={() =>
										setExpenseSortOrder(
											expenseSortOrder === "asc" ? "desc" : "asc"
										)
									}
									className="text-slate-900 dark:text-gray-100 font-medium flex items-center px-3 py-2 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 cursor-pointer"
									title={
										expenseSortOrder === "asc" ? "Ascending" : "Descending"
									}
								>
									{expenseSortOrder === "asc" ? "↑" : "↓"}
								</button>
								<button
									type="button"
									onClick={clearExpenseFilters}
									className="text-red-600 dark:text-red-400 font-medium flex items-center px-4 py-2 rounded-md bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 cursor-pointer"
									title="রিসেট ফিল্টার"
								>
									রিসেট
								</button>
								<button
									type="button"
									onClick={() => exportToExcel("expense", expenses)}
									className="text-blue-600 dark:text-gray-100 font-medium flex items-center px-4 py-2 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 overflow-hidden cursor-pointer"
								>
									<Download className="w-4 h-4 mr-2" /> Export Excel
								</button>
							</div>
						</div>

						<table className="min-w-full border border-gray-200 dark:border-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-900 whitespace-nowrap">
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Category
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Amount
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Date
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Recipient
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400 border-r dark:border-gray-700">
										Note
									</th>
									<th className="px-4 py-3 text-left text-[13px] font-medium text-slate-600 dark:text-gray-400">
										Actions
									</th>
								</tr>
							</thead>

							<tbody className="whitespace-nowrap divide-y divide-gray-200 dark:divide-gray-700">
								{(() => {
									const filtered = expenses
										.filter((e) => {
											const searchLower = expenseSearch.toLowerCase();
											const dateStr = e.date
												? format(new Date(e.date), "dd-MM-yyyy")
												: "";

											// Date picker filter
											if (expenseSearchDate) {
												const searchDateStr = format(
													expenseSearchDate,
													"dd-MM-yyyy"
												);
												if (dateStr !== searchDateStr) return false;
											}

											// Text search filter
											return (
												e.category?.toLowerCase().includes(searchLower) ||
												e.payee?.toLowerCase().includes(searchLower) ||
												e.notes?.toLowerCase().includes(searchLower) ||
												dateStr.includes(searchLower)
											);
										})
										.sort((a, b) => {
											// Sort by date
											const dateA = new Date(a.date || 0).getTime();
											const dateB = new Date(b.date || 0).getTime();
											return expenseSortOrder === "asc"
												? dateA - dateB
												: dateB - dateA;
										});
									const total = filtered.length;
									const paginated = filtered.slice(
										(expensePage - 1) * expenseLimit,
										expensePage * expenseLimit
									);

									return paginated.map((item) => (
										<tr
											key={item._id}
											className="odd:bg-gray-50 dark:odd:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
										>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 font-medium border-r dark:border-gray-700">
												{item.category}
											</td>
											<td className="px-4 py-3 text-[13px] text-red-600 dark:text-red-400 font-bold border-r dark:border-gray-700">
												{item.amount} Tk
											</td>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 border-r dark:border-gray-700">
												{format(new Date(item.date), "dd-MM-yyyy")}
											</td>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 border-r dark:border-gray-700">
												{item.payee || "N/A"}
											</td>
											<td className="px-4 py-3 text-[13px] text-slate-900 dark:text-gray-100 max-w-xs truncate border-r dark:border-gray-700">
												{item.notes}
											</td>
											<td className="px-4 py-3 text-[13px]">
												<div className="flex items-center gap-3">
													<button
														onClick={() =>
															setEditingItem({ type: "expense", ...item })
														}
														className="cursor-pointer"
														title="Edit"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
															viewBox="0 0 348.882 348.882"
														>
															<path d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z" />
														</svg>
													</button>
													<button
														onClick={() =>
															setItemToDelete({ type: "expense", id: item._id })
														}
														className="cursor-pointer"
														title="Delete"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="w-5 h-5 fill-red-500 hover:fill-red-700"
															viewBox="0 0 24 24"
														>
															<path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
															<path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
														</svg>
													</button>
												</div>
											</td>
										</tr>
									));
								})()}
							</tbody>
						</table>

						{/* Pagination Expense */}
						{(() => {
							const filtered = expenses
								.filter((e) => {
									const searchLower = expenseSearch.toLowerCase();
									const dateStr = e.date
										? format(new Date(e.date), "dd-MM-yyyy")
										: "";

									// Date picker filter
									if (expenseSearchDate) {
										const searchDateStr = format(
											expenseSearchDate,
											"dd-MM-yyyy"
										);
										if (dateStr !== searchDateStr) return false;
									}

									// Text search filter
									return (
										e.category?.toLowerCase().includes(searchLower) ||
										e.payee?.toLowerCase().includes(searchLower) ||
										e.notes?.toLowerCase().includes(searchLower) ||
										dateStr.includes(searchLower)
									);
								})
								.sort((a, b) => {
									// Sort by date
									const dateA = new Date(a.date || 0).getTime();
									const dateB = new Date(b.date || 0).getTime();
									return expenseSortOrder === "asc"
										? dateA - dateB
										: dateB - dateA;
								});
							const total = filtered.length;
							const totalPages = Math.ceil(total / expenseLimit);
							if (total === 0) return null;

							return (
								<div className="md:flex mt-6 m-4">
									<p className="text-sm text-slate-600 dark:text-gray-400 flex-1">
										Showing {(expensePage - 1) * expenseLimit + 1} to{" "}
										{Math.min(expensePage * expenseLimit, total)} of {total}{" "}
										entries
									</p>
									<div className="flex items-center max-md:mt-4">
										<p className="text-sm text-slate-600 dark:text-gray-400">
											Display
										</p>
										<select
											value={expenseLimit}
											onChange={(e) => {
												setExpenseLimit(Number(e.target.value));
												setExpensePage(1);
											}}
											className="text-sm text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md h-8 mx-4 px-1 outline-none"
										>
											<option value={10}>10</option>
											<option value={20}>20</option>
											<option value={50}>50</option>
											<option value={100}>100</option>
										</select>

										<ul className="flex space-x-3 justify-center">
											<li
												onClick={() =>
													setExpensePage(Math.max(1, expensePage - 1))
												}
												className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-md cursor-pointer ${
													expensePage === 1 ? "bg-gray-100" : "bg-gray-200"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-3 fill-gray-400"
													viewBox="0 0 55.753 55.753"
												>
													<path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" />
												</svg>
											</li>
											{Array.from({ length: Math.min(5, totalPages) }).map(
												(_, i) => {
													const p = i + 1;
													return (
														<li
															key={p}
															onClick={() => setExpensePage(p)}
															className={`flex items-center justify-center shrink-0 border border-gray-300 dark:border-gray-700 cursor-pointer text-sm font-medium px-[13px] h-8 rounded-md ${
																expensePage === p
																	? "bg-blue-500 text-white border-blue-500"
																	: "text-slate-900 dark:text-white"
															}`}
														>
															{p}
														</li>
													);
												}
											)}
											<li
												onClick={() =>
													setExpensePage(Math.min(totalPages, expensePage + 1))
												}
												className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-md cursor-pointer ${
													expensePage === totalPages
														? "bg-gray-100"
														: "bg-gray-200"
												}`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-3 fill-gray-400 rotate-180"
													viewBox="0 0 55.753 55.753"
												>
													<path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" />
												</svg>
											</li>
										</ul>
									</div>
								</div>
							);
						})()}
					</div>
				</div>
			</div>

			{/* Edit Overlay */}
			{editingItem && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 w-full max-w-md overflow-hidden">
						<div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
							<h3 className="font-bold text-gray-900 dark:text-white">
								{editingItem.type === "income" ? "আয়" : "ব্যয়"} আপডেট করুন
							</h3>
							<button
								onClick={() => setEditingItem(null)}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							>
								×
							</button>
						</div>
						<form onSubmit={handleItemUpdate} className="p-4 space-y-4">
							{editingItem.type === "income" ? (
								<>
									<div>
										<Label className={labelClasses}>সূত্র</Label>
										<Input
											name="source"
											defaultValue={editingItem.source}
											required
											className={inputClasses}
										/>
									</div>
									<div>
										<Label className={labelClasses}>পরিমাণ</Label>
										<Input
											name="amount"
											type="number"
											defaultValue={editingItem.amount}
											required
											className={inputClasses}
										/>
									</div>
									<div>
										<Label className={labelClasses}>ক্যাটাগরি</Label>
										<Input
											name="category"
											defaultValue={editingItem.category}
											className={inputClasses}
										/>
									</div>
									<div>
										<Label className={labelClasses}>নোট</Label>
										<Textarea
											name="notes"
											rows={2}
											defaultValue={editingItem.notes}
											className={inputClasses}
										/>
									</div>
								</>
							) : (
								<>
									<div>
										<Label className={labelClasses}>ক্যাটাগরি</Label>
										<Input
											name="category"
											defaultValue={editingItem.category}
											required
											className={inputClasses}
										/>
									</div>
									<div>
										<Label className={labelClasses}>পরিমাণ</Label>
										<Input
											name="amount"
											type="number"
											defaultValue={editingItem.amount}
											required
											className={inputClasses}
										/>
									</div>
									<div>
										<Label className={labelClasses}>প্রাপক</Label>
										<Input
											name="payee"
											defaultValue={editingItem.payee}
											className={inputClasses}
										/>
									</div>
									<div>
										<Label className={labelClasses}>নোট</Label>
										<Textarea
											name="notes"
											rows={2}
											defaultValue={editingItem.notes}
											className={inputClasses}
										/>
									</div>
								</>
							)}
							<div className="flex gap-3 pt-2">
								<Button type="submit" disabled={loading} className="flex-1">
									{loading ? "সংরক্ষণ হচ্ছে..." : "হালনাগাদ করুন"}
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

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
						<AlertDialogDescription>
							এটি আপনার ডাটাবেস থেকে স্থায়ীভাবে (সফট ডিলিট) মুছে ফেলা হবে। এই
							কাজটি আর আগের অবস্থায় ফিরিয়ে আনা সম্ভব নয়।
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={loading}>বাতিল</AlertDialogCancel>
						<AlertDialogAction
							onClick={async (e) => {
								e.preventDefault();
								if (itemToDelete) {
									setLoading(true);
									await handleItemDelete(itemToDelete.type, itemToDelete.id);
									setLoading(false);
									setItemToDelete(null);
								}
							}}
							className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white"
						>
							{loading ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
