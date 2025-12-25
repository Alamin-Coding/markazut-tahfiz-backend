"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { labelClasses, inputClasses } from "./Constants";
import { toast } from "sonner";

interface IncomeAddFormProps {
	onSuccess?: () => void;
}

export default function IncomeAddForm({ onSuccess }: IncomeAddFormProps) {
	const [loading, setLoading] = useState(false);
	const [incomeDate, setIncomeDate] = useState<Date | undefined>(undefined);

	const handleIncomeCreate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget; // Store reference to form
		setLoading(true);
		try {
			const formData = new FormData(form);
			const payload = Object.fromEntries(formData.entries());

			const res = await fetch("/api/finance/income", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					source: payload.source,
					amount: Number(payload.amount),
					date: incomeDate
						? incomeDate.toISOString()
						: new Date().toISOString(),
					category: payload.category || "general",
					notes: payload.notes,
				}),
			});

			if (!res.ok) {
				const errorData = await res
					.json()
					.catch(() => ({ message: "আয় যুক্ত করতে ব্যর্থ হয়েছে" }));
				toast.error(errorData.message || "আয় যুক্ত করতে ব্যর্থ হয়েছে");
				return;
			}

			const data = await res.json();
			if (data.success) {
				toast.success("আয় সফলভাবে যুক্ত হয়েছে");
				form.reset();
				setIncomeDate(undefined);
				if (onSuccess) onSuccess();
			} else {
				toast.error(data.message || "আয় যুক্ত করতে ব্যর্থ হয়েছে");
			}
		} catch (err: any) {
			console.error("Income creation error:", err);
			toast.error(
				"আয় যুক্ত করতে ব্যর্থ হয়েছে: " + (err.message || "অজানা ত্রুটি")
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 h-fit">
			<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
				আয় যোগ করুন
			</h3>
			<form onSubmit={handleIncomeCreate} className="space-y-3">
				<div>
					<Label className={labelClasses}>সূত্র</Label>
					<Input
						name="source"
						required
						className={inputClasses}
						placeholder="আয়ের উৎস"
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
						date={incomeDate}
						onSelect={setIncomeDate}
						placeholder="তারিখ বাছাই করুন"
						className="w-full"
					/>
				</div>
				<div>
					<Label className={labelClasses}>ক্যাটাগরি</Label>
					<Input
						name="category"
						placeholder="general"
						className={inputClasses}
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
					{loading ? "সংরক্ষণ হচ্ছে..." : "আয় যোগ করুন"}
				</Button>
			</form>
		</div>
	);
}
