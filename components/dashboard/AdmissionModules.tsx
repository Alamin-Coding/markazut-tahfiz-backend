"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inputClasses, labelClasses } from "./Constants";

// Admission Page Forms
export function AdmissionForm() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				ভর্তি পেজ - হিরো ব্যানার সম্পাদনা
			</h2>
			<form className="space-y-6">
				<div className="space-y-2">
					<Label className={labelClasses}>শিরোনাম</Label>
					<Input
						type="text"
						defaultValue="ভর্তি তথ্য ও নির্দেশিকা"
						className={inputClasses}
					/>
				</div>

				<div className="space-y-2">
					<Label className={labelClasses}>সাবটাইটেল</Label>
					<Input
						type="text"
						defaultValue="মারকাজুত তাহফিজ ইন্সটিটিউশনাল মাদরাসায় স্বাগতম"
						className={inputClasses}
					/>
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700 h-11">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

export function AdmissionRequirementsForm() {
	const [documents, setDocuments] = useState([
		"জন্ম নিবন্ধন সার্টিফিকেট",
		"একাডেমিক রেকর্ড (যদি থাকে)",
		"স্বাস্থ্য পরীক্ষার রিপোর্ট",
		"অভিভাবকের পরিচয়পত্র (এনআইডি)",
		"পাসপোর্ট সাইজ ছবি",
	]);

	const [infoCards, setInfoCards] = useState([
		{ title: "শ্রেণী সমূহ", value: "নূরানী থেকে আলিম পর্যন্ত" },
		{ title: "বার্ষিক ফি", value: "২,০০০ - ৫,০০০ টাকা" },
		{ title: "প্রতি ক্লাসে ধারণক্ষমতা", value: "৫০ - ৭৫ জন শিক্ষার্থী" },
		{ title: "শিক্ষা সময়কাল", value: "২ - ১০ বছর" },
	]);

	const addDocument = () => {
		setDocuments([...documents, ""]);
	};

	const removeDocument = (index: number) => {
		setDocuments(documents.filter((_, i) => i !== index));
	};

	const updateDocument = (index: number, value: string) => {
		setDocuments(documents.map((doc, i) => (i === index ? value : doc)));
	};

	const addInfoCard = () => {
		setInfoCards([...infoCards, { title: "", value: "" }]);
	};

	const removeInfoCard = (index: number) => {
		setInfoCards(infoCards.filter((_, i) => i !== index));
	};

	const updateInfoCard = (
		index: number,
		field: "title" | "value",
		value: string
	) => {
		setInfoCards(
			infoCards.map((card, i) =>
				i === index ? { ...card, [field]: value } : card
			)
		);
	};

	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				ভর্তি পেজ - প্রয়োজনীয় ডকুমেন্টস এবং তথ্য সম্পাদনা
			</h2>
			<form className="space-y-8">
				{/* Info Cards */}
				<div>
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						ইনফো কার্ডস
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{infoCards.map((card, idx) => (
							<div
								key={idx}
								className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg space-y-4"
							>
								<div className="flex justify-between items-center mb-2">
									<h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
										কার্ড {idx + 1}
									</h4>
									<Button
										type="button"
										onClick={() => removeInfoCard(idx)}
										variant="outline"
										size="sm"
										className="text-red-600 hover:text-red-800"
										disabled={infoCards.length <= 1}
									>
										🗑️
									</Button>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>টাইটেল</Label>
									<Input
										type="text"
										value={card.title}
										onChange={(e) =>
											updateInfoCard(idx, "title", e.target.value)
										}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>ভ্যালু</Label>
									<Input
										type="text"
										value={card.value}
										onChange={(e) =>
											updateInfoCard(idx, "value", e.target.value)
										}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
					<Button
						type="button"
						onClick={addInfoCard}
						variant="outline"
						className="mt-4"
					>
						+ নতুন ইনফো কার্ড যোগ করুন
					</Button>
				</div>

				{/* Required Documents */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						প্রয়োজনীয় ডকুমেন্টস
					</h3>
					<div className="space-y-4">
						{documents.map((doc, idx) => (
							<div key={idx} className="flex items-center space-x-2">
								<Input
									type="text"
									value={doc}
									onChange={(e) => updateDocument(idx, e.target.value)}
									className={inputClasses}
									placeholder={`ডকুমেন্ট ${idx + 1}`}
								/>
								<Button
									type="button"
									onClick={() => removeDocument(idx)}
									variant="outline"
									size="sm"
									className="text-red-600 hover:text-red-800"
									disabled={documents.length <= 1}
								>
									🗑️
								</Button>
							</div>
						))}
						<Button
							type="button"
							onClick={addDocument}
							variant="outline"
							className="mt-2"
						>
							+ নতুন ডকুমেন্ট যোগ করুন
						</Button>
					</div>
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700 h-11">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

export function AdmissionProcessForm() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				ভর্তি পেজ - ভর্তি প্রক্রিয়া এবং ক্লাস তথ্য সম্পাদনা
			</h2>
			<form className="space-y-8">
				{/* Admission Schedule */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						ভর্তি সময়সূচী
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="p-4 border dark:border-gray-700 rounded-md space-y-4">
							<h4 className="font-medium text-gray-900 dark:text-white">
								অনলাইন আবেদন
							</h4>
							<div className="space-y-2">
								<Label className={labelClasses}>শুরু তারিখ</Label>
								<Input
									type="text"
									defaultValue="০১ জানুয়ারি"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>শেষ তারিখ</Label>
								<Input
									type="text"
									defaultValue="৩০ জুন"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>স্ট্যাটাস</Label>
								<Input
									type="text"
									defaultValue="চলমান"
									className={inputClasses}
								/>
							</div>
						</div>
						<div className="p-4 border dark:border-gray-700 rounded-md space-y-4">
							<h4 className="font-medium text-gray-900 dark:text-white">
								প্রবেশ পরীক্ষা
							</h4>
							<div className="space-y-2">
								<Label className={labelClasses}>তারিখ</Label>
								<Input
									type="text"
									defaultValue="জুলাই-আগস্ট"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>সময়</Label>
								<Input
									type="text"
									defaultValue="সকাল ৯:০০ টা"
									className={inputClasses}
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>স্থান</Label>
								<Input
									type="text"
									defaultValue="প্রধান ক্যাম্পাস"
									className={inputClasses}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Class Information */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						শ্রেণী ও ফি তথ্য
					</h3>
					<div className="space-y-4">
						{[
							{
								class: "নূরানী",
								duration: "৩ বছর",
								fees: "৩,০০০ টাকা",
								capacity: "৬০ জন",
							},
							{
								class: "প্রথম শ্রেণী",
								duration: "১০ বছর",
								fees: "২,০০০ টাকা",
								capacity: "৫০ জন",
							},
							{
								class: "দ্বিতীয় শ্রেণী",
								duration: "১০ বছর",
								fees: "২,০০০ টাকা",
								capacity: "৫০ জন",
							},
							{
								class: "তৃতীয় শ্রেণী",
								duration: "১০ বছর",
								fees: "২,০০০ টাকা",
								capacity: "৫০ জন",
							},
							{
								class: "দাখিল",
								duration: "৩ বছর",
								fees: "৪,৫০০ টাকা",
								capacity: "৭৫ জন",
							},
							{
								class: "আলিম",
								duration: "২ বছর",
								fees: "৫,০০০ টাকা",
								capacity: "৬০ জন",
							},
						].map((cls, idx) => (
							<div
								key={idx}
								className="p-4 border dark:border-gray-700 rounded-md space-y-4"
							>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>শ্রেণী</Label>
										<Input
											type="text"
											defaultValue={cls.class}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>সময়কাল</Label>
										<Input
											type="text"
											defaultValue={cls.duration}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ফি</Label>
										<Input
											type="text"
											defaultValue={cls.fees}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ধারণক্ষমতা</Label>
										<Input
											type="text"
											defaultValue={cls.capacity}
											className={inputClasses}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700 h-11">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}
