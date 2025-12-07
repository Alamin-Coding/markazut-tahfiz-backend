import React from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-100">
			{/* Main Content */}
			<main className="max-w-[1920px] w-full mx-auto p-3">{children}</main>
		</div>
	);
}
