import React from "react";
import { Toaster } from "sonner";

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
