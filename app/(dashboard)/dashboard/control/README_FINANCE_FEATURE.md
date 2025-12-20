# আয়-ব্যয় সারাংশ - মাসিক/বার্ষিক ভিউ এবং PDF ডাউনলোড

## বাস্তবায়িত Features:

### 1. State Variables (Already Added - Lines 70-74)

```tsx
const [incomeDate, setIncomeDate] = useState<Date | undefined>(undefined);
const [expenseDate, setExpenseDate] = useState<Date | undefined>(undefined);
const [financeViewMode, setFinanceViewMode] = useState<"month" | "year">(
	"month"
);
const [financeDateFrom, setFinanceDateFrom] = useState<Date | undefined>(
	undefined
);
const [financeDateTo, setFinanceDateTo] = useState<Date | undefined>(undefined);
```

### 2. Updated refreshFinanceSummary Function (Already Added - Lines 107-121)

```tsx
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
```

### 3. PDF Download Function (Already Added - Lines 276-361)

```tsx
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
			const toStr = financeDateTo ? format(financeDateTo, "dd/MM/yyyy") : "N/A";
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
```

## UI Changes Needed:

### Step 1: Add Filter Card (Insert BEFORE the summary card - around line 757)

```tsx
<Card>
	<CardHeader>
		<CardTitle>আয়-ব্যয় সারাংশ ফিল্টার</CardTitle>
	</CardHeader>
	<CardContent>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<div>
				<Label>ভিউ মোড</Label>
				<select
					value={financeViewMode}
					onChange={(e) =>
						setFinanceViewMode(e.target.value as "month" | "year")
					}
					className={cn("border rounded-md p-2 w-full", inputClass)}
				>
					<option value="month">মাসিক</option>
					<option value="year">বার্ষিক</option>
				</select>
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
			<div className="flex items-end gap-2">
				<Button onClick={handleApplyFinanceFilter} className="flex-1">
					ফিল্টার প্রয়োগ করুন
				</Button>
			</div>
		</div>
	</CardContent>
</Card>
```

### Step 2: Update Summary Card Header (Replace existing CardHeader around line 758-760)

REPLACE THIS:

```tsx
<CardHeader>
	<CardTitle>মাসভিত্তিক আয়-ব্যয় সারাংশ</CardTitle>
</CardHeader>
```

WITH THIS:

```tsx
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
	<CardTitle>
		{financeViewMode === "month" ? "মাসভিত্তিক" : "বার্ষিক"} আয়-ব্যয় সারাংশ
	</CardTitle>
	<Button onClick={handleDownloadPDF} variant="outline" size="sm">
		PDF ডাউনলোড করুন
	</Button>
</CardHeader>
```

## Features Summary:

✅ **মাসিক/বার্ষিক ভিউ**: Admin মাসিক বা বার্ষিক ভিত্তিতে আয়-ব্যয় দেখতে পারবে
✅ **তারিখ রেঞ্জ ফিল্টার**: নির্দিষ্ট সময়ের ডেটা দেখার জন্য তারিখ নির্বাচন করতে পারবে
✅ **PDF ডাউনলোড**: সম্পূর্ণ সারাংশ PDF ফাইল হিসেবে ডাউনলোড করতে পারবে
✅ **Dynamic Title**: ভিউ মোড অনুযায়ী শিরোনাম পরিবর্তন হবে

## Installation:

jsPDF এবং jspdf-autotable ইতিমধ্যে install করা হয়েছে।

## Usage:

1. "আয়/ব্যয়" ট্যাবে যান
2. ভিউ মোড সিলেক্ট করুন (মাসিক/বার্ষিক)
3. প্রয়োজনে তারিখ রেঞ্জ নির্বাচন করুন
4. "ফিল্টার প্রয়োগ করুন" বাটনে ক্লিক করুন
5. "PDF ডাউনলোড করুন" বাটনে ক্লিক করে রিপোর্ট ডাউনলোড করুন
