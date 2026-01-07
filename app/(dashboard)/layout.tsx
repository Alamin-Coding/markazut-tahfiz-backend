import React from "react";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "মারকাজুত তাহফিজ - এডমিন ড্যাশবোর্ড",
	description: "ইসলামী শিক্ষা প্রতিষ্ঠানের কনটেন্ট ম্যানেজমেন্ট সিস্টেম",
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-100">
			{/* Toast Notifications */}
			<Toaster position="top-right" richColors closeButton />

			{/* Main Content */}
			<main className="max-w-[1920px] w-full mx-auto p-3">{children}</main>
		</div>
	);
}
