"use client";

import React, { useState } from "react";
import AdmissionPageContent from "@/components/AdmissionPageContent";
import {
	AdmissionForm,
	AdmissionRequirementsForm,
	AdmissionProcessForm,
} from "@/components/dashboard/AdmissionModules";
import AdmissionApplicationsForm from "@/components/dashboard/AdmissionApplicationsForm";

export default function DashboardAdmissionPage() {
	const [activeTab, setActiveTab] = useState("page-content");

	const tabs = [
		{ id: "page-content", label: "পেজ কনটেন্ট" },
		{ id: "form", label: "ভর্তি ফর্ম (সেটিংস)" },
		{ id: "requirements", label: "প্রয়োজনীয় ডকুমেন্টস" },
		{ id: "process", label: "ভর্তি প্রক্রিয়া" },
		{ id: "applications", label: "ভর্তি আবেদনসমূহ" },
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
				{activeTab === "page-content" && <AdmissionPageContent />}
				{activeTab === "form" && <AdmissionForm />}
				{activeTab === "requirements" && <AdmissionRequirementsForm />}
				{activeTab === "process" && <AdmissionProcessForm />}
				{activeTab === "applications" && <AdmissionApplicationsForm />}
			</div>
		</div>
	);
}
