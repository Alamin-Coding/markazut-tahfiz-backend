"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";

const ResetPassword: React.FC = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token");

	useEffect(() => {
		if (!token) {
			setError("Invalid reset link");
		}
	}, [token]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password || !confirmPassword) {
			setError("অনুগ্রহ করে সব ফিল্ড পূরণ করুন");
			return;
		}
		if (password !== confirmPassword) {
			setError("পাসওয়ার্ড মিলছে না");
			return;
		}
		if (password.length < 6) {
			setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
			return;
		}

		setLoading(true);
		setError("");
		setMessage("");

		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, password }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage("পাসওয়ার্ড সফলভাবে রিসেট হয়েছে। লগইন করুন।");
				setTimeout(() => router.push("/"), 2000);
			} else {
				setError(data.error || "রিসেট ব্যর্থ হয়েছে");
			}
		} catch (err) {
			setError("একটি ত্রুটি ঘটেছে");
		} finally {
			setLoading(false);
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
					<p className="text-gray-600 text-sm">পাসওয়ার্ড রিসেট</p>
				</div>

				{/* Reset Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Password Input */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								নতুন পাসওয়ার্ড
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
									placeholder="নতুন পাসওয়ার্ড"
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

						{/* Confirm Password Input */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								পাসওয়ার্ড নিশ্চিত করুন
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-emerald-500" />
								</div>
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="পাসওয়ার্ড নিশ্চিত করুন"
									className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-emerald-600 transition"
								>
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						{error && <p className="text-red-500 text-sm">{error}</p>}
						{message && <p className="text-green-500 text-sm">{message}</p>}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading || !token}
							className="w-full cursor-pointer bg-linear-to-r from-emerald-500 to-teal-600 bg-button text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
						>
							{loading ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
