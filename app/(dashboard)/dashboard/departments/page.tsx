"use client";

import React, { useState } from "react";
import DepartmentsContent from "@/components/DepartmentsContent";
import {
	DepartmentsListForm,
	DepartmentsDetailsForm,
} from "@/components/dashboard/DepartmentModules";

export default function DashboardDepartmentsPage() {
	const [activeTab, setActiveTab] = useState("page-content");

	return (
		<div className="space-y-6">
			<div className="mb-6">
				<nav
					className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl"
					aria-label="Tabs"
				>
					<button
						onClick={() => setActiveTab("page-content")}
						className={`${
							activeTab === "page-content"
								? "bg-white dark:bg-gray-700 shadow-sm text-green-700 dark:text-green-400"
								: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
						} px-4 py-2 rounded-lg text-sm font-medium transition-all`}
					>
						পেজ কনটেন্ট
					</button>
					<button
						onClick={() => setActiveTab("list")}
						className={`${
							activeTab === "list"
								? "bg-white dark:bg-gray-700 shadow-sm text-green-700 dark:text-green-400"
								: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
						} px-4 py-2 rounded-lg text-sm font-medium transition-all`}
					>
						বিভাগ তালিকা
					</button>
					<button
						onClick={() => setActiveTab("details")}
						className={`${
							activeTab === "details"
								? "bg-white dark:bg-gray-700 shadow-sm text-green-700 dark:text-green-400"
								: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
						} px-4 py-2 rounded-lg text-sm font-medium transition-all`}
					>
						বিভাগ বিস্তারিত
					</button>
				</nav>
			</div>

			<div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-6 min-h-[400px]">
				{activeTab === "page-content" && <DepartmentsContent />}
				{activeTab === "list" && <DepartmentsListForm />}
				{activeTab === "details" && <DepartmentsDetailsForm />}
			</div>
		</div>
	);
}
