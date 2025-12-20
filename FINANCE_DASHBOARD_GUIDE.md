# আয়-ব্যয় Feature Main Dashboard এ যোগ করার গাইড

## ✅ Step 1: Finance Page যোগ হয়েছে (সম্পন্ন)

`backend/app/(dashboard)/dashboard/page.tsx` এ line 104 এ যোগ হয়েছে:

```tsx
{ id: "finance", label: "আয়-ব্যয়", icon: "💰" },
```

এখন sidebar এ "আয়-ব্যয়" দেখতে পাবেন! 💰

---

## 📝 Step 2: Finance Content যোগ করুন

`backend/app/(dashboard)/dashboard/page.tsx` file এ:

### 2.1: Line 435 এর পরে এই code যোগ করুন:

```tsx
{
	/* Finance Page Content */
}
{
	activePage === "finance" && <FinanceContent />;
}
```

### 2.2: File এর শেষে (line 3413 এর আগে) এই component যোগ করুন:

```tsx
// Finance Management Component
function FinanceContent() {
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
	const [incomeDate, setIncomeDate] = useState<Date | undefined>(undefined);
	const [expenseDate, setExpenseDate] = useState<Date | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState<string | null>(null);

	useEffect(() => {
		refreshFinanceSummary();
	}, []);

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

	const handleIncomeCreate = async (formData: FormData) => {
		setLoading(true);
		setToast(null);
		try {
			const payload = Object.fromEntries(formData.entries());
			await fetch("/api/finance/income", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					source: payload.source,
					amount: Number(payload.amount),
					date: incomeDate ? incomeDate.toISOString() : payload.date,
					category: payload.category,
					notes: payload.notes,
				}),
			});
			setToast("আয় যোগ হয়েছে");
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
			await fetch("/api/finance/expense", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					category: payload.category,
					amount: Number(payload.amount),
					date: expenseDate ? expenseDate.toISOString() : payload.date,
					payee: payload.payee,
					notes: payload.notes,
				}),
			});
			setToast("ব্যয় যোগ হয়েছে");
			await refreshFinanceSummary();
		} catch (err: any) {
			setToast(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDownloadPDF = async () => {
		try {
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

	const financeIncome = financeSummary?.incomeSummary || [];
	const financeExpense = financeSummary?.expenseSummary || [];

	return (
		<div className="space-y-6">
			{toast && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
					{toast}
				</div>
			)}

			{/* Income and Expense Forms */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Income Form */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-4">আয় যোগ করুন</h3>
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
							<DatePicker
								date={incomeDate}
								onSelect={setIncomeDate}
								placeholder="তারিখ বাছাই করুন"
								className="w-full"
							/>
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
							{loading ? "সংরক্ষণ হচ্ছে..." : "আয় যোগ করুন"}
						</Button>
					</form>
				</div>

				{/* Expense Form */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-4">ব্যয় যোগ করুন</h3>
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
							<DatePicker
								date={expenseDate}
								onSelect={setExpenseDate}
								placeholder="তারিখ বাছাই করুন"
								className="w-full"
							/>
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
							{loading ? "সংরক্ষণ হচ্ছে..." : "ব্যয় যোগ করুন"}
						</Button>
					</form>
				</div>
			</div>

			{/* Filter Controls */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h3 className="text-lg font-semibold mb-4">আয়-ব্যয় সারাংশ ফিল্টার</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<Label>ভিউ মোড</Label>
						<Select
							value={financeViewMode}
							onValueChange={(value: "month" | "year") =>
								setFinanceViewMode(value)
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="month">মাসিক</SelectItem>
								<SelectItem value="year">বার্ষিক</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label>শুরুর তারিখ</Label>
						<DatePicker
							date={financeDateFrom}
							onSelect={setFinanceDateFrom}
							placeholder="শুরুর তারিখ"
							className="w-full"
						/>
					</div>
					<div>
						<Label>শেষ তারিখ</Label>
						<DatePicker
							date={financeDateTo}
							onSelect={setFinanceDateTo}
							placeholder="শেষ তারিখ"
							className="w-full"
						/>
					</div>
					<div className="flex items-end">
						<Button onClick={handleApplyFinanceFilter} className="w-full">
							ফিল্টার প্রয়োগ করুন
						</Button>
					</div>
				</div>
			</div>

			{/* Summary */}
			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">
						{financeViewMode === "month" ? "মাসভিত্তিক" : "বার্ষিক"} আয়-ব্যয়
						সারাংশ
					</h3>
					<Button onClick={handleDownloadPDF} variant="outline" size="sm">
						PDF ডাউনলোড করুন
					</Button>
				</div>
				<div className="space-y-3">
					<div className="text-sm">
						মোট আয়: {financeSummary?.overall?.income?.total ?? 0} | মোট ব্যয়:{" "}
						{financeSummary?.overall?.expense?.total ?? 0} | নিট:{" "}
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
										আয়: {item.total}
									</div>
									<div className="text-sm text-red-700">ব্যয়: {exp.total}</div>
									<div className="text-sm font-semibold">
										নিট: {item.total - (exp.total || 0)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
```

### 2.3: Import যোগ করুন (file এর শুরুতে):

Line 33 এর পরে যোগ করুন:

```tsx
import { format } from "date-fns";
```

---

## ✅ সম্পন্ন!

এখন browser এ গিয়ে দেখুন:

- Sidebar এ "আয়-ব্যয়" 💰 দেখতে পাবেন
- Click করলে আয়-ব্যয় management page খুলবে
- সব features থাকবে: মাসিক/বার্ষিক ভিউ, ফিল্টার, PDF ডাউনলোড

---

## 📌 Note:

Control page আলাদা থাকবে "ছাত্র ও ফি" এবং "বাল্ক SMS" এর জন্য।
Main dashboard এ এখন "আয়-ব্যয়" আলাদা page হিসেবে আছে।
