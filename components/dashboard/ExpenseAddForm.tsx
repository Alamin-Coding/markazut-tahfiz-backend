"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { labelClasses, inputClasses } from "./Constants";
import { toast } from "sonner";

interface ExpenseAddFormProps {
	onSuccess?: () => void;
}

export default function ExpenseAddForm({ onSuccess }: ExpenseAddFormProps) {
	const [loading, setLoading] = useState(false);
	const [expenseDate, setExpenseDate] = useState<Date | undefined>(undefined);

	const handleExpenseCreate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget; // Store reference to form
		setLoading(true);
		try {
			const formData = new FormData(form);
			const payload = Object.fromEntries(formData.entries());

			const res = await fetch("/api/finance/expense", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					category: payload.category,
					amount: Number(payload.amount),
					date: expenseDate
						? expenseDate.toISOString()
						: new Date().toISOString(),
					payee: payload.payee,
					notes: payload.notes,
				}),
			});

			if (!res.ok) {
				const errorData = await res
					.json()
					.catch(() => ({ message: "ব্যয় যুক্ত করতে ব্যর্থ হয়েছে" }));
				toast.error(errorData.message || "ব্যয় যুক্ত করতে ব্যর্থ হয়েছে");
				return;
			}

			const data = await res.json();
			if (data.success) {
				toast.success("ব্যয় সফলভাবে যুক্ত হয়েছে");
				form.reset();
				setExpenseDate(undefined);
				if (onSuccess) onSuccess();
			} else {
				toast.error(data.message || "ব্যয় যুক্ত করতে ব্যর্থ হয়েছে");
			}
		} catch (err: any) {
			console.error("Expense creation error:", err);
			toast.error(
				"ব্যয় যুক্ত করতে ব্যর্থ হয়েছে: " + (err.message || "অজানা ত্রুটি")
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 h-fit">
			<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
				ব্যয় যোগ করুন
			</h3>
			<form onSubmit={handleExpenseCreate} className="space-y-3">
				<div>
					<Label className={labelClasses}>ক্যাটাগরি</Label>
					<Input
						name="category"
						required
						className={inputClasses}
						placeholder="ব্যয়ের খাত"
					/>
				</div>
				<div>
					<Label className={labelClasses}>পরিমাণ</Label>
					<Input
						name="amount"
						type="number"
						required
						className={inputClasses}
						placeholder="টাকার পরিমাণ"
					/>
				</div>
				<div>
					<Label className={labelClasses}>তারিখ</Label>
					<DatePicker
						date={expenseDate}
						onSelect={setExpenseDate}
						placeholder="তারিখ বাছাই করুন"
						className="w-full"
					/>
				</div>
				<div>
					<Label className={labelClasses}>প্রাপক</Label>
					<Input
						name="payee"
						className={inputClasses}
						placeholder="যাকে টাকা দেওয়া হয়েছে (ঐচ্ছিক)"
					/>
				</div>
				<div>
					<Label className={labelClasses}>নোট</Label>
					<Textarea
						name="notes"
						rows={2}
						className={inputClasses}
						placeholder="অতিরিক্ত তথ্য (ঐচ্ছিক)"
					/>
				</div>
				<Button type="submit" disabled={loading} className="w-full h-11">
					{loading ? "সংরক্ষণ হচ্ছে..." : "ব্যয় যোগ করুন"}
				</Button>
			</form>
		</div>
	);
}
