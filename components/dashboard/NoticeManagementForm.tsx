"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { inputClasses, labelClasses } from "./Constants";
import { toast } from "sonner";

export interface Notice {
	_id: string;
	title: string;
	date: string;
	content: string | string[];
	type: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export default function NoticeManagementForm() {
	const [notices, setNotices] = useState<Notice[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [editingNotice, setEditingNotice] = useState({
		title: "",
		date: undefined as Date | undefined,
		content: [""] as string[],
	});
	const [newNotice, setNewNotice] = useState({
		title: "",
		date: new Date(),
		content: [""] as string[],
	});
	const [showAddForm, setShowAddForm] = useState(false);
	const [adding, setAdding] = useState(false);

	const addContentLine = (isNew: boolean) => {
		if (isNew) {
			setNewNotice((prev) => ({ ...prev, content: [...prev.content, ""] }));
		} else {
			setEditingNotice((prev) => ({ ...prev, content: [...prev.content, ""] }));
		}
	};

	const removeContentLine = (index: number, isNew: boolean) => {
		if (isNew) {
			setNewNotice((prev) => ({
				...prev,
				content: prev.content.filter((_, i) => i !== index),
			}));
		} else {
			setEditingNotice((prev) => ({
				...prev,
				content: prev.content.filter((_, i) => i !== index),
			}));
		}
	};

	const updateContentLine = (index: number, value: string, isNew: boolean) => {
		if (isNew) {
			setNewNotice((prev) => ({
				...prev,
				content: prev.content.map((c, i) => (i === index ? value : c)),
			}));
		} else {
			setEditingNotice((prev) => ({
				...prev,
				content: prev.content.map((c, i) => (i === index ? value : c)),
			}));
		}
	};

	// Fetch notices on component mount
	useEffect(() => {
		fetchNotices();
	}, []);

	const fetchNotices = async () => {
		try {
			const response = await fetch("/api/notice");
			const result = await response.json();
			if (result.success) {
				setNotices(result.data);
			}
		} catch (error) {
			console.error("Error fetching notices:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddNotice = async () => {
		if (
			newNotice.title &&
			newNotice.date &&
			newNotice.content.some((c) => c.trim())
		) {
			setAdding(true);
			try {
				const response = await fetch("/api/notice", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...newNotice,
						content: newNotice.content,
						date: newNotice.date
							? newNotice.date.toISOString().split("T")[0]
							: "",
						type: "announcement",
					}),
				});
				const result = await response.json();
				if (result.success) {
					setNotices([...notices, result.data]);
					setNewNotice({ title: "", date: new Date(), content: [""] });
					setShowAddForm(false);
					toast.success("নোটিশ সফলভাবে যোগ করা হয়েছে");
				} else {
					toast.error(result.message || "Failed to add notice");
				}
			} catch (error) {
				console.error("Error adding notice:", error);
				toast.error("Failed to add notice");
			} finally {
				setAdding(false);
			}
		}
	};

	const handleUpdateNotice = async () => {
		if (!editingId) return;

		setUpdatingId(editingId);
		try {
			const response = await fetch(`/api/notice/${editingId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...editingNotice,
					content: editingNotice.content,
					date: editingNotice.date
						? editingNotice.date.toISOString().split("T")[0]
						: "",
					type: "announcement",
				}),
			});
			const result = await response.json();
			if (result.success) {
				setNotices(
					notices.map((notice) =>
						notice._id === editingId ? result.data : notice
					)
				);
				setEditingId(null);
				setEditingNotice({ title: "", date: undefined, content: [""] });
				toast.success("নোটিশ সফলভাবে আপডেট করা হয়েছে");
			} else {
				toast.error(result.message || "Failed to update notice");
			}
		} catch (error) {
			console.error("Error updating notice:", error);
			toast.error("Failed to update notice");
		} finally {
			setUpdatingId(null);
		}
	};

	const startEditing = (notice: Notice) => {
		setEditingId(notice._id);
		setEditingNotice({
			title: notice.title,
			date: notice.date ? new Date(notice.date) : undefined,
			content: Array.isArray(notice.content)
				? notice.content
				: notice.content.split("\n"),
		});
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditingNotice({ title: "", date: undefined, content: [""] });
	};

	const handleDeleteNotice = async (id: string) => {
		if (confirm("আপনি কি এই নোটিশটি মুছে ফেলতে চান?")) {
			try {
				const response = await fetch(`/api/notice/${id}`, {
					method: "DELETE",
				});
				const result = await response.json();
				if (result.success) {
					setNotices(notices.filter((notice) => notice._id !== id));
					toast.success("নোটিশ মুছে ফেলা হয়েছে");
				} else {
					toast.error(result.message || "Failed to delete notice");
				}
			} catch (error) {
				console.error("Error deleting notice:", error);
				toast.error("Failed to delete notice");
			}
		}
	};

	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-medium text-gray-900 dark:text-white">
					নোটিশ ম্যানেজমেন্ট
				</h2>
				<Button
					onClick={() => setShowAddForm(!showAddForm)}
					className="bg-green-600 hover:bg-green-700"
				>
					{showAddForm ? "✕ বাতিল" : "+ নতুন নোটিশ"}
				</Button>
			</div>

			{/* Add New Notice Form */}
			{showAddForm && (
				<div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
					<h3 className="text-md font-medium mb-4 text-gray-900 dark:text-white">
						নতুন নোটিশ যোগ করুন
					</h3>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label className={labelClasses}>নোটিশ টাইটেল</Label>
								<Input
									type="text"
									value={newNotice.title}
									onChange={(e) =>
										setNewNotice({ ...newNotice, title: e.target.value })
									}
									className={inputClasses}
									placeholder="নোটিশের শিরোনাম লিখুন"
								/>
							</div>
							<div className="space-y-2">
								<Label className={labelClasses}>তারিখ</Label>
								<DatePicker
									date={newNotice.date}
									onSelect={(date) =>
										date && setNewNotice({ ...newNotice, date })
									}
									placeholder="তারিখ নির্বাচন করুন"
								/>
							</div>
							<div className="space-y-2">
								<p className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
									নোটিশ কনটেন্ট
								</p>
								<div className="space-y-2">
									{newNotice.content.map((line, idx) => (
										<div key={idx} className="flex items-center space-x-2">
											<Input
												type="text"
												value={line}
												onChange={(e) =>
													updateContentLine(idx, e.target.value, true)
												}
												className={inputClasses}
												placeholder={`প্যারাগ্রাফ ${idx + 1}`}
											/>
											<Button
												type="button"
												onClick={() => removeContentLine(idx, true)}
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-800 cursor-pointer"
												disabled={newNotice.content.length <= 1}
											>
												🗑️
											</Button>
										</div>
									))}
									<Button
										type="button"
										onClick={() => addContentLine(true)}
										variant="outline"
										className="mt-2"
									>
										+ নতুন প্যারাগ্রাফ যোগ করুন
									</Button>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									onClick={handleAddNotice}
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

			{/* Existing Notices */}
			<div className="space-y-4">
				{notices.map((notice) => (
					<div
						key={notice._id}
						className="p-4 border rounded-lg bg-white dark:bg-gray-800"
					>
						{editingId === notice._id ? (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label className={labelClasses}>নোটিশ টাইটেল</Label>
									<Input
										type="text"
										value={editingNotice.title}
										onChange={(e) =>
											setEditingNotice({
												...editingNotice,
												title: e.target.value,
											})
										}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>তারিখ</Label>
									<DatePicker
										date={editingNotice.date}
										onSelect={(date) =>
											setEditingNotice({ ...editingNotice, date })
										}
										placeholder="তারিখ নির্বাচন করুন"
									/>
								</div>
								<div className="space-y-2">
									<p className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
										নোটিশ কনটেন্ট
									</p>
									<div className="space-y-2">
										{editingNotice.content.map((line, idx) => (
											<div key={idx} className="space-y-2">
												<Textarea
													rows={2}
													value={line}
													onChange={(e) =>
														updateContentLine(idx, e.target.value, false)
													}
													className={inputClasses}
													placeholder={`প্যারাগ্রাফ ${idx + 1}`}
												/>
												<Button
													type="button"
													onClick={() => removeContentLine(idx, false)}
													variant="outline"
													size="sm"
													className="text-red-600 hover:text-red-800"
													disabled={editingNotice.content.length <= 1}
												>
													🗑️
												</Button>
											</div>
										))}
										<Button
											type="button"
											onClick={() => addContentLine(false)}
											variant="outline"
											className="mt-2"
										>
											+ নতুন প্যারাগ্রাফ যোগ করুন
										</Button>
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										onClick={handleUpdateNotice}
										disabled={updatingId === notice._id}
										className="bg-green-600 hover:bg-green-700"
									>
										{updatingId === notice._id ? "সেভ হচ্ছে..." : "সেভ করুন"}
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
										{notice.title}
									</h3>
									<div className="flex gap-2">
										<Button
											onClick={() => startEditing(notice)}
											size="sm"
											variant="outline"
											className="text-blue-600 hover:text-blue-800"
										>
											✏️ এডিট
										</Button>
										<Button
											onClick={() => handleDeleteNotice(notice._id)}
											size="sm"
											variant="outline"
											className="text-red-600 hover:text-red-800"
										>
											🗑️ ডিলিট
										</Button>
									</div>
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
									{notice.date}
								</p>
								<div className="text-gray-700 dark:text-gray-300">
									{(Array.isArray(notice.content)
										? notice.content
										: notice.content.split("\n")
									).map((line, idx) => (
										<p key={idx} className="mb-2">
											{line}
										</p>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
