"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inputClasses, labelClasses } from "./Constants";

export function DepartmentsListForm() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				বিভাগ তালিকা সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						"হিফজুল কোরআন বিভাগ",
						"নূরানী বিভাগ",
						"নাজেরা বিভাগ",
						"কিতাব বিভাগ",
						"উর্দু ও ফারসি বিভাগ",
						"ইংরেজি ও গণিত বিভাগ",
					].map((dept, idx) => (
						<div
							key={idx}
							className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg space-y-2"
						>
							<Label className={labelClasses}>বিভাগ {idx + 1}</Label>
							<Input type="text" defaultValue={dept} className={inputClasses} />
						</div>
					))}
				</div>
				<Button type="submit" className="bg-green-600 hover:bg-green-700 h-11">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

export function DepartmentsDetailsForm() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				বিভাগের বিস্তারিত তথ্য সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-4">
					{[
						{
							title: "হিফজুল কোরআন বিভাগ (Hifz)",
							description:
								"সহীহ্ তিলাওয়াত ও তাজবীদের সাথে পবিত্র কোরআন হিফজ সম্পন্ন করা হয়।",
						},
						{
							title: "নূরানী বিভাগ (Noorani)",
							description:
								"শিশুদের কোরআন তিলাওয়াত ও প্রাথমিক দ্বিনী শিক্ষা প্রদান করা হয়।",
						},
					].map((dept, idx) => (
						<div
							key={idx}
							className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg space-y-4"
						>
							<div className="space-y-2">
								<Label className={labelClasses}>বিভাগ টাইটেল</Label>
								<Input
									type="text"
									defaultValue={dept.title}
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>বিবরণ</Label>
								<Input
									type="text"
									defaultValue={dept.description}
									className={inputClasses}
								/>
							</div>
						</div>
					))}
				</div>
				<Button type="submit" className="bg-green-600 hover:bg-green-700 h-11">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}
