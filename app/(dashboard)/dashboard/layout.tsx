"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "@/lib/context/ThemeContext";
import { LogOutIcon } from "lucide-react";

const pages = [
	{ id: "home", label: "হোম পেজ", icon: "🏠", path: "/dashboard/home" },
	{
		id: "about",
		label: "আমাদের সম্পর্কে",
		icon: "📖",
		path: "/dashboard/about",
	},
	{ id: "notice", label: "নোটিশ", icon: "📢", path: "/dashboard/notice" },
	{
		id: "departments",
		label: "বিভাগসমূহ",
		icon: "🏫",
		path: "/dashboard/departments",
	},
	{ id: "admission", label: "ভর্তি", icon: "📝", path: "/dashboard/admission" },
	{ id: "contact", label: "যোগাযোগ", icon: "📞", path: "/dashboard/contact" },
	{ id: "result", label: "ফলাফল", icon: "📊", path: "/dashboard/result" },
	{
		id: "students",
		label: "শিক্ষার্থী",
		icon: "👨‍🎓",
		path: "/dashboard/students",
	},
	{ id: "faq", label: "FAQ", icon: "❓", path: "/dashboard/faq" },
	{ id: "finance", label: "আয়-ব্যয়", icon: "💰", path: "/dashboard/finance" },
	{
		id: "users",
		label: "ইউজার ম্যানেজমেন্ট",
		icon: "👤",
		path: "/dashboard/users",
	},
	{
		id: "subject-config",
		label: "বিষয় সেটিং",
		icon: "⚙️",
		path: "/dashboard/subject-config",
	},
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [newApplicationsCount, setNewApplicationsCount] = useState(0);
	const [newMessagesCount, setNewMessagesCount] = useState(0);
	const { theme, toggleTheme } = useTheme();
	const pathname = usePathname();
	const [user, setUser] = useState<{ email: string } | null>(null);

	// Fetch current user
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/auth/check");
				const json = await res.json();
				if (json.user) {
					setUser(json.user);
				}
			} catch (e) {
				console.error("Failed to fetch user", e);
			}
		};
		fetchUser();
	}, []);

	// Poll for notifications
	useEffect(() => {
		const checkNotifications = async () => {
			try {
				const res = await fetch("/api/contact");
				const json = await res.json();
				if (json.success) {
					const unread = json.data.filter((m: any) => !m.read).length;
					setNewMessagesCount(unread);
				}

				const resAdm = await fetch("/api/admission?status=pending");
				const jsonAdm = await resAdm.json();
				if (jsonAdm.success) {
					setNewApplicationsCount(jsonAdm.data.length);
				}
			} catch (e) {
				console.error("Failed to check notifications", e);
			}
		};

		checkNotifications();
		const interval = setInterval(checkNotifications, 300000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 dark:from-gray-950 dark:to-gray-900 flex">
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-r-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-bold text-gray-900 dark:text-white">
								ড্যাশবোর্ড
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								মারকাজুত তাহফিজ
							</p>
						</div>
						<button
							onClick={() => setSidebarOpen(false)}
							className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							✕
						</button>
					</div>
					{user && (
						<div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
									{user.email[0].toUpperCase()}
								</div>
								<div className="min-w-0">
									<p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
										{user.email}
									</p>
									<p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
										অ্যাডমিন
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				<nav className="mt-6 flex flex-col h-[calc(100vh-140px)]">
					<div className="px-3 mb-2">
						<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							পেজ সমূহ
						</p>
					</div>
					<div className="space-y-1 flex-1 overflow-y-auto px-2">
						{pages.map((page) => (
							<Link
								key={page.id}
								href={page.path}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all relative ${
									pathname.startsWith(page.path)
										? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 shadow-sm"
										: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
								}`}
							>
								<span className="mr-3 text-lg">{page.icon}</span>
								<span className="flex-1 text-left">{page.label}</span>
								{page.id === "admission" && newApplicationsCount > 0 && (
									<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
										{newApplicationsCount > 99 ? "99+" : newApplicationsCount}
									</span>
								)}
								{page.id === "contact" && newMessagesCount > 0 && (
									<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
										{newMessagesCount > 99 ? "99+" : newMessagesCount}
									</span>
								)}
							</Link>
						))}
					</div>

					<div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
						<Link
							href="/dashboard/control"
							onClick={() => setSidebarOpen(false)}
							className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors mb-4 ${
								pathname.startsWith("/dashboard/control")
									? "bg-emerald-700 text-white"
									: "bg-emerald-600 text-white hover:bg-emerald-700"
							}`}
						>
							<span className="mr-3">⚙️</span>
							<span>কন্ট্রোল প্যানেল</span>
						</Link>
						<button
							onClick={async () => {
								await fetch("/api/auth/logout", { method: "POST" });
								window.location.href = "/";
							}}
							className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition font-medium flex items-center justify-center"
						>
							<span className="mr-2">
								<LogOutIcon />
							</span>
							Logout
						</button>
					</div>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8">
				<div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto w-full min-h-full">
					{/* Header */}
					<header className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-8">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<button
									onClick={() => setSidebarOpen(true)}
									className="lg:hidden mr-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
								>
									☰
								</button>
								<div>
									<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
										{pages.find((p) => pathname.startsWith(p.path))?.label ||
											"ড্যাশবোর্ড"}
									</h2>
									<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
										কনটেন্ট পরিচালনা করুন
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<button
									onClick={toggleTheme}
									className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-mono"
									title={`Switch to ${
										theme === "light" ? "dark" : "light"
									} mode`}
								>
									{theme === "light" ? "🌙" : "☀️"}
								</button>
								<div className="hidden sm:block text-right">
									<div className="text-xs text-gray-400">শেষ আপডেট</div>
									<div className="text-sm font-medium text-gray-900 dark:text-gray-100">
										{new Date().toLocaleDateString("bn-BD")}
									</div>
								</div>
							</div>
						</div>
					</header>

					{/* Content Area */}
					<div className="animate-in fade-in duration-500">{children}</div>
				</div>
			</main>
		</div>
	);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider>
			<DashboardLayoutContent>{children}</DashboardLayoutContent>
		</ThemeProvider>
	);
}
