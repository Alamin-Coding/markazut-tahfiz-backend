# আয়-ব্যয় সারাংশ Feature - সম্পূর্ণ গাইড

## ✅ যা ইতিমধ্যে যোগ করা হয়েছে:

1. **State Variables** (Lines 70-74) ✅
2. **refreshFinanceSummary Function** (Lines 107-121) ✅
3. **handleDownloadPDF Function** (Lines 276-361) ✅
4. **handleApplyFinanceFilter Function** (Line 363) ✅
5. **jsPDF Package** installed ✅

## 📝 এখন যা করতে হবে:

### Step 1: File খুলুন

`backend/app/(dashboard)/dashboard/control/page.tsx` file টি আপনার code editor এ খুলুন

### Step 2: Line 757 খুঁজুন

Line 757 এ যান যেখানে লেখা আছে:

```tsx
<Card>
```

### Step 3: Line 757 থেকে 794 পর্যন্ত সব মুছে দিন

### Step 4: নিচের code টি সেখানে paste করুন:

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
									onChange={(e) => setFinanceViewMode(e.target.value as "month" | "year")}
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
								<Button
									onClick={handleApplyFinanceFilter}
									className="flex-1"
								>
									ফিল্টার প্রয়োগ করুন
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
						<CardTitle>
							{financeViewMode === "month" ? "মাসভিত্তিক" : "বার্ষিক"} আয়-ব্যয় সারাংশ
						</CardTitle>
						<Button
							onClick={handleDownloadPDF}
							variant="outline"
							size="sm"
						>
							PDF ডাউনলোড করুন
						</Button>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="text-sm">
							মোট আয়: {financeSummary?.overall?.income?.total ?? 0} | মোট
							ব্যয়: {financeSummary?.overall?.expense?.total ?? 0} | নিট:{" "}
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
										<div className="text-sm text-red-700">
											ব্যয়: {exp.total}
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
```

### Step 5: File Save করুন (Ctrl+S)

## 🎉 সম্পন্ন! এখন Features:

✅ **মাসিক/বার্ষিক ভিউ**: Dropdown থেকে select করুন
✅ **তারিখ রেঞ্জ ফিল্টার**: নির্দিষ্ট সময়ের ডেটা দেখুন  
✅ **PDF ডাউনলোড**: সম্পূর্ণ রিপোর্ট PDF এ ডাউনলোড করুন
✅ **Dynamic Title**: ভিউ মোড অনুযায়ী title পরিবর্তন হবে

## 🧪 Test করুন:

1. Dashboard এ যান → "আয়/ব্যয়" tab
2. "ভিউ মোড" dropdown থেকে "মাসিক" বা "বার্ষিক" select করুন
3. তারিখ select করুন (optional)
4. "ফিল্টার প্রয়োগ করুন" button এ click করুন
5. "PDF ডাউনলোড করুন" button এ click করে PDF download করুন

## 📸 Screenshot Location:

Backend server: http://localhost:3000/dashboard/control
Tab: "আয়/ব্যয়"
