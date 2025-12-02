"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, LogIn, X } from "lucide-react";
import Image from "next/image";

const Login: React.FC = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	// Forgot password modal states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotLoading, setForgotLoading] = useState(false);
	const [forgotMessage, setForgotMessage] = useState("");
	const [forgotError, setForgotError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			alert("অনুগ্রহ করে সব ফিল্ড পূরণ করুন");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();
			if (res.ok) {
				console.log("লগইন সফল!");
				// Redirect to dashboard
				router.push("/dashboard");
			} else {
				alert(data.error || "লগইন ব্যর্থ");
			}
		} catch (err) {
			alert("একটি ত্রুটি ঘটেছে");
		} finally {
			setLoading(false);
		}
	};

	const handleForgotSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!forgotEmail) {
			setForgotError("ইমেইল প্রয়োজন");
			return;
		}
		setForgotLoading(true);
		setForgotError("");
		setForgotMessage("");
		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: forgotEmail }),
			});
			const data = await res.json();
			if (res.ok) {
				setForgotMessage(data.message);
				setForgotEmail("");
			} else {
				setForgotError(data.error || "একটি ত্রুটি ঘটেছে");
			}
		} catch (err) {
			setForgotError("একটি ত্রুটি ঘটেছে");
		} finally {
			setForgotLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				{/* Logo and Header */}
				<div className="text-center mb-8">
					<div className="flex size-30 mx-auto rounded-full justify-center mb-4 border">
						<Image
							src="/logo.avif"
							width={1000}
							height={1000}
							alt="logo"
							className="rounded-full"
						/>
					</div>
					<h1 className="text-3xl font-bold text-emerald-900 mb-2">
						মারকাজুত তাহফীজ
					</h1>
					<p className="text-gray-600 text-sm">
						আন্তর্জাতিক হিফজ শিক্ষা প্রতিষ্ঠান
					</p>
				</div>

				{/* Login Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
					<h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
						স্বাগতম
					</h2>
					<p className="text-gray-600 text-center text-sm mb-8">
						আপনার অ্যাকাউন্টে লগইন করুন
					</p>

					<div className="space-y-5">
						{/* Email Input */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								ইমেইল
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-emerald-500" />
								</div>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
								/>
							</div>
						</div>

						{/* Password Input */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								পাসওয়ার্ড
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-emerald-500" />
								</div>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="your password"
									className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-emerald-600 transition"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center cursor-pointer">
								<input
									type="checkbox"
									className="w-4 h-4 text-emerald-500 rounded focus:ring-2 focus:ring-emerald-500 border-gray-300"
								/>
								<span className="ml-2 text-gray-700">আমাকে মনে রাখুন</span>
							</label>
							<button
								type="button"
								onClick={() => setIsModalOpen(true)}
								className="text-emerald-600 hover:text-emerald-700 font-medium"
							>
								পাসওয়ার্ড ভুলে গেছেন?
							</button>
						</div>

						{/* Login Button */}
						<button
							onClick={handleSubmit}
							disabled={loading}
							className="w-full cursor-pointer bg-linear-to-r from-emerald-500 to-teal-600 bg-button text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
						>
							<LogIn className="h-5 w-5" />
							{loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
						</button>
					</div>
				</div>
			</div>

			{/* Forgot Password Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-md mx-4 relative">
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
						>
							<X className="h-6 w-6" />
						</button>
						<h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
							পাসওয়ার্ড ভুলে গেছেন?
						</h2>
						<p className="text-gray-600 text-center text-sm mb-6">
							আপনার ইমেইল এড্রেস দিন, আমরা রিসেট লিঙ্ক পাঠাব
						</p>
						<form onSubmit={handleForgotSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="forgotEmail"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									ইমেইল
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Mail className="h-5 w-5 text-emerald-500" />
									</div>
									<input
										id="forgotEmail"
										type="email"
										value={forgotEmail}
										onChange={(e) => setForgotEmail(e.target.value)}
										placeholder="your@email.com"
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
									/>
								</div>
							</div>
							{forgotError && (
								<p className="text-red-500 text-sm">{forgotError}</p>
							)}
							{forgotMessage && (
								<p className="text-green-500 text-sm">{forgotMessage}</p>
							)}
							<button
								type="submit"
								disabled={forgotLoading}
								className="w-full cursor-pointer bg-linear-to-r from-emerald-500 to-teal-600 bg-button text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
							>
								{forgotLoading ? "পাঠানো হচ্ছে..." : "রিসেট লিঙ্ক পাঠান"}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Login;
