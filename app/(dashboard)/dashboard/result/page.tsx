"use client";

import React, { useState } from "react";
import ResultsManageForm from "@/components/dashboard/ResultsManageForm";
import ResultsAnalyticsForm from "@/components/dashboard/ResultsAnalyticsForm";

export default function DashboardResultPage() {
	const [activeTab, setActiveTab] = useState("manage");

	const tabs = [
		{ id: "manage", label: "ফলাফল ব্যবস্থাপনা" },
		{ id: "analytics", label: "অ্যানালিটিক্স" },
	];

	return (
		<div className="space-y-6">
			<div className="mb-6 overflow-x-auto pb-2">
				<nav
					className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl min-w-max"
					aria-label="Tabs"
				>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`${
								activeTab === tab.id
									? "bg-white dark:bg-gray-700 shadow-sm text-green-700 dark:text-green-400"
									: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
							} px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap`}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			<div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-6 min-h-[400px]">
				{activeTab === "manage" && <ResultsManageForm />}
				{activeTab === "analytics" && <ResultsAnalyticsForm />}
			</div>
		</div>
	);
}
