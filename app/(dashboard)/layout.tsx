"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/");
	};

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header with Logout */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
						<button
							onClick={handleLogout}
							className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
						>
							Logout
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
		</div>
	);
}
