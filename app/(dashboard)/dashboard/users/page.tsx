"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
	Trash2,
	UserPlus,
	Shield,
	Mail,
	Loader2,
	Eye,
	EyeOff,
} from "lucide-react";

interface User {
	_id: string;
	email: string;
	createdAt: string;
}

export default function UserManagementPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [creating, setCreating] = useState(false);

	const fetchUsers = async () => {
		try {
			const res = await fetch("/api/users");
			const json = await res.json();
			if (json.success) {
				setUsers(json.data);
			} else {
				toast.error(json.message || "ইউজার লিস্ট লোড করতে ব্যর্থ");
			}
		} catch (error) {
			toast.error("সার্ভার ত্রুটি");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("ইমেইল এবং পাসওয়ার্ড দিন");
			return;
		}

		setCreating(true);
		try {
			const res = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const json = await res.json();
			if (json.success) {
				toast.success("নতুন অ্যাডমিন তৈরি হয়েছে");
				setEmail("");
				setPassword("");
				fetchUsers();
			} else {
				toast.error(json.message || "ইউজার তৈরি করতে ব্যর্থ");
			}
		} catch (error) {
			toast.error("সার্ভার ত্রুটি");
		} finally {
			setCreating(false);
		}
	};

	const handleDeleteUser = async (id: string) => {
		if (!confirm("আপনি কি নিশ্চিতভাবে এই অ্যাডমিনকে ডিলিট করতে চান?")) return;

		try {
			const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
			const json = await res.json();
			if (json.success) {
				toast.success("অ্যাডমিন ডিলিট হয়েছে");
				fetchUsers();
			} else {
				toast.error(json.message || "ডিলিট করতে ব্যর্থ");
			}
		} catch (error) {
			toast.error("সার্ভার ত্রুটি");
		}
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
						<Shield className="text-emerald-600" />
						ইউজার ম্যানেজমেন্ট
					</h1>
					<p className="text-gray-500 dark:text-gray-400 mt-2">
						আপনার প্রতিষ্ঠানের অ্যাডমিন একাউন্টগুলো পরিচালনা করুন
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Create User Form */}
				<div className="lg:col-span-1">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-8">
						<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
							<UserPlus className="w-5 h-5 text-emerald-600" />
							নতুন অ্যাডমিন যোগ করুন
						</h2>
						<form onSubmit={handleCreateUser} className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									ইমেইল
								</label>
								<Input
									type="email"
									placeholder="admin@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="rounded-xl border-gray-200 dark:border-gray-600 focus:ring-emerald-500"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									পাসওয়ার্ড
								</label>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="********"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="rounded-xl border-gray-200 dark:border-gray-600 focus:ring-emerald-500 pr-12"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors p-1"
										title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</div>
							<Button
								type="submit"
								disabled={creating}
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
							>
								{creating ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"অ্যাডমিন তৈরি করুন"
								)}
							</Button>
						</form>
					</div>
				</div>

				{/* User List */}
				<div className="lg:col-span-2">
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
						<div className="p-6 border-b border-gray-50 dark:border-gray-700">
							<h2 className="text-xl font-bold">বর্তমান অ্যাডমিনগণ</h2>
						</div>

						{loading ? (
							<div className="p-12 text-center">
								<Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
								<p className="text-gray-500 mt-4">লোড হচ্ছে...</p>
							</div>
						) : (
							<div className="divide-y divide-gray-50 dark:divide-gray-700">
								{users.length === 0 ? (
									<div className="p-12 text-center text-gray-500">
										কোনো ইউজার পাওয়া যায়নি
									</div>
								) : (
									users.map((user) => (
										<div
											key={user._id}
											className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
										>
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl font-bold">
													{user.email[0].toUpperCase()}
												</div>
												<div>
													<div className="flex items-center gap-2">
														<Mail className="w-4 h-4 text-gray-400" />
														<p className="font-semibold text-gray-900 dark:text-white">
															{user.email}
														</p>
													</div>
													<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
														তৈরি হয়েছে:{" "}
														{new Date(user.createdAt).toLocaleDateString(
															"bn-BD"
														)}
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleDeleteUser(user._id)}
												className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
												title="ডিলিট করুন"
											>
												<Trash2 className="w-5 h-5" />
											</Button>
										</div>
									))
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
