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
import { inputClasses, labelClasses, selectClasses } from "./Constants";

export interface FAQ {
	_id: string;
	question: string;
	answer: string;
	category: string;
	isActive: boolean;
	order: number;
	createdAt: string;
	updatedAt: string;
}

export default function FAQManagementForm() {
	const [faqs, setFaqs] = useState<FAQ[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [editingFAQ, setEditingFAQ] = useState({
		question: "",
		answer: "",
		category: "general",
		order: 0,
	});
	const [newFAQ, setNewFAQ] = useState({
		question: "",
		answer: "",
		category: "general",
		order: 0,
	});
	const [showAddForm, setShowAddForm] = useState(false);
	const [adding, setAdding] = useState(false);

	// Fetch FAQs on component mount
	useEffect(() => {
		fetchFAQs();
	}, []);

	const fetchFAQs = async () => {
		try {
			const response = await fetch("/api/faq");
			const result = await response.json();
			if (result.success) {
				setFaqs(result.data);
			}
		} catch (error) {
			console.error("Error fetching FAQs:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddFAQ = async () => {
		if (newFAQ.question && newFAQ.answer) {
			setAdding(true);
			try {
				const response = await fetch("/api/faq", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newFAQ),
				});
				const result = await response.json();
				if (result.success) {
					setFaqs([...faqs, result.data]);
					setNewFAQ({
						question: "",
						answer: "",
						category: "general",
						order: 0,
					});
					setShowAddForm(false);
				} else {
					alert("Failed to add FAQ");
				}
			} catch (error) {
				console.error("Error adding FAQ:", error);
				alert("Failed to add FAQ");
			} finally {
				setAdding(false);
			}
		}
	};

	const handleUpdateFAQ = async () => {
		if (!editingId) return;

		setUpdatingId(editingId);
		try {
			const response = await fetch(`/api/faq/${editingId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editingFAQ),
			});
			const result = await response.json();
			if (result.success) {
				setFaqs(faqs.map((faq) => (faq._id === editingId ? result.data : faq)));
				setEditingId(null);
				setEditingFAQ({
					question: "",
					answer: "",
					category: "general",
					order: 0,
				});
			} else {
				alert("Failed to update FAQ");
			}
		} catch (error) {
			console.error("Error updating FAQ:", error);
			alert("Failed to update FAQ");
		} finally {
			setUpdatingId(null);
		}
	};

	const startEditing = (faq: FAQ) => {
		setEditingId(faq._id);
		setEditingFAQ({
			question: faq.question,
			answer: faq.answer,
			category: faq.category,
			order: faq.order,
		});
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditingFAQ({ question: "", answer: "", category: "general", order: 0 });
	};

	const handleDeleteFAQ = async (id: string) => {
		if (confirm("আপনি কি এই FAQটি মুছে ফেলতে চান?")) {
			try {
				const response = await fetch(`/api/faq/${id}`, {
					method: "DELETE",
				});
				const result = await response.json();
				if (result.success) {
					setFaqs(faqs.filter((faq) => faq._id !== id));
				} else {
					alert("Failed to delete FAQ");
				}
			} catch (error) {
				console.error("Error deleting FAQ:", error);
				alert("Failed to delete FAQ");
			}
		}
	};

	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-medium text-gray-900 dark:text-white">
					FAQ ম্যানেজমেন্ট
				</h2>
				<Button
					onClick={() => setShowAddForm(!showAddForm)}
					className="bg-green-600 hover:bg-green-700"
				>
					{showAddForm ? "✕ বাতিল" : "+ নতুন FAQ"}
				</Button>
			</div>

			{/* Add New FAQ Form */}
			{showAddForm && (
				<div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
					<h3 className="text-md font-medium mb-4 text-gray-900 dark:text-white">
						নতুন FAQ যোগ করুন
					</h3>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label className={labelClasses}>প্রশ্ন</Label>
								<Input
									type="text"
									value={newFAQ.question}
									onChange={(e) =>
										setNewFAQ({ ...newFAQ, question: e.target.value })
									}
									className={inputClasses}
									placeholder="FAQ প্রশ্ন লিখুন"
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>উত্তর</Label>
								<Textarea
									rows={4}
									value={newFAQ.answer}
									onChange={(e) =>
										setNewFAQ({ ...newFAQ, answer: e.target.value })
									}
									className={inputClasses}
									placeholder="FAQ উত্তর লিখুন"
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className={labelClasses}>ক্যাটেগরি</Label>
									<Select
										value={newFAQ.category}
										onValueChange={(value) =>
											setNewFAQ({ ...newFAQ, category: value })
										}
									>
										<SelectTrigger className={selectClasses}>
											<SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="general">সাধারণ</SelectItem>
											<SelectItem value="communication">
												যোগাযোগ সম্পর্কে প্রশ্ন
											</SelectItem>
											<SelectItem value="admission">ভর্তি</SelectItem>
											<SelectItem value="academic">একাডেমিক</SelectItem>
											<SelectItem value="fees">ফি</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>অর্ডার</Label>
									<Input
										type="number"
										value={newFAQ.order}
										onChange={(e) =>
											setNewFAQ({ ...newFAQ, order: Number(e.target.value) })
										}
										className={inputClasses}
										placeholder="0"
									/>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									onClick={handleAddFAQ}
									disabled={adding}
									className="bg-green-600 hover:bg-green-700"
								>
									{adding ? "যোগ হচ্ছে..." : "যোগ করুন"}
								</Button>
								<Button onClick={() => setShowAddForm(false)} variant="outline">
									বাতিল
								</Button>
							</div>
						</div>
					</form>
				</div>
			)}

			{/* Existing FAQs */}
			<div className="space-y-4">
				{faqs.map((faq) => (
					<div
						key={faq._id}
						className="p-4 border rounded-lg bg-white dark:bg-gray-800"
					>
						{editingId === faq._id ? (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label className={labelClasses}>প্রশ্ন</Label>
									<Input
										type="text"
										value={editingFAQ.question}
										onChange={(e) =>
											setEditingFAQ({
												...editingFAQ,
												question: e.target.value,
											})
										}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>উত্তর</Label>
									<Textarea
										rows={4}
										value={editingFAQ.answer}
										onChange={(e) =>
											setEditingFAQ({
												...editingFAQ,
												answer: e.target.value,
											})
										}
										className={inputClasses}
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>ক্যাটেগরি</Label>
										<Select
											value={editingFAQ.category}
											onValueChange={(value) =>
												setEditingFAQ({ ...editingFAQ, category: value })
											}
										>
											<SelectTrigger className={selectClasses}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="general">সাধারণ</SelectItem>
												<SelectItem value="communication">
													যোগাযোগ সম্পর্কে প্রশ্ন
												</SelectItem>
												<SelectItem value="admission">ভর্তি</SelectItem>
												<SelectItem value="academic">একাডেমিক</SelectItem>
												<SelectItem value="fees">ফি</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>অর্ডার</Label>
										<Input
											type="number"
											value={editingFAQ.order}
											onChange={(e) =>
												setEditingFAQ({
													...editingFAQ,
													order: Number(e.target.value),
												})
											}
											className={inputClasses}
										/>
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										onClick={handleUpdateFAQ}
										disabled={updatingId === faq._id}
										className="bg-green-600 hover:bg-green-700"
									>
										{updatingId === faq._id ? "সেভ হচ্ছে..." : "সেভ করুন"}
									</Button>
									<Button onClick={cancelEditing} variant="outline">
										বাতিল
									</Button>
								</div>
							</div>
						) : (
							<div>
								<div className="flex justify-between items-start mb-2">
									<h3 className="text-lg font-medium text-gray-900 dark:text-white">
										{faq.question}
									</h3>
									<div className="flex gap-2">
										<Button
											onClick={() => startEditing(faq)}
											size="sm"
											variant="outline"
											className="text-blue-600 hover:text-blue-800"
										>
											✏️ এডিট
										</Button>
										<Button
											onClick={() => handleDeleteFAQ(faq._id)}
											size="sm"
											variant="outline"
											className="text-red-600 hover:text-red-800"
										>
											🗑️ ডিলিট
										</Button>
									</div>
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
									ক্যাটেগরি: {faq.category} | অর্ডার: {faq.order}
								</p>
								<div className="text-gray-700 dark:text-gray-300">
									{faq.answer}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
