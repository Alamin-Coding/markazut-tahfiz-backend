"use client";

import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	ResponsiveContainer,
} from "recharts";

export default function ResultsAnalyticsForm() {
	// Sample data for charts
	const resultsByTermData = [
		{ term: "১ম পরীক্ষা ২০২৫", total: 45, passed: 42, failed: 3 },
		{ term: "২য় পরীক্ষা ২০২৫", total: 48, passed: 45, failed: 3 },
		{ term: "৩য় পরীক্ষা ২০২৫", total: 52, passed: 49, failed: 3 },
		{ term: "৪র্থ পরীক্ষা ২০২৫", total: 50, passed: 47, failed: 3 },
	];

	const passFailData = [
		{ name: "পাশ", value: 183, color: "#10b981" },
		{ name: "ফেল", value: 12, color: "#ef4444" },
	];

	const averageMarksData = [
		{ term: "১ম পরীক্ষা ২০২৫", average: 82.5 },
		{ term: "২য় পরীক্ষা ২০২৫", average: 84.2 },
		{ term: "৩য় পরীক্ষা ২০২৫", average: 85.8 },
		{ term: "৪র্থ পরীক্ষা ২০২৫", average: 87.1 },
	];

	const subjectPerformanceData = [
		{ subject: "কোরআন (হিফজ)", average: 92.5 },
		{ subject: "কোরআন (তাজবিদ)", average: 87.3 },
		{ subject: "ইসলামিক স্টাডিজ", average: 83.7 },
		{ subject: "আরবি ব্যাকরণ", average: 79.2 },
		{ subject: "আচরণ ও শৃঙ্খলা", average: 91.8 },
	];

	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				ফলাফল অ্যানালিটিক্স
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-blue-600">১২৫</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						মোট ফলাফল
					</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-green-600">৯৫</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">পাশ</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-yellow-600">২৫</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">ফেল</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
					<div className="text-2xl font-bold text-purple-600">৮৫%</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						গড় নম্বর
					</div>
				</div>
			</div>
			{/* Charts and detailed analytics */}
			<div className="space-y-8">
				{/* Results by Term Bar Chart */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						পরীক্ষা অনুসারে ফলাফল
					</h3>
					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={resultsByTermData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="term" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="total" fill="#059669" name="মোট শিক্ষার্থী" />
								<Bar dataKey="passed" fill="#10b981" name="পাশ" />
								<Bar dataKey="failed" fill="#ef4444" name="ফেল" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Pass/Fail Distribution Pie Chart */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						পাশ/ফেল বিতরণ
					</h3>
					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={passFailData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) =>
										`${name} ${((percent || 0) * 100).toFixed(0)}%`
									}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{passFailData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Average Marks Trend Line Chart */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						গড় নম্বরের প্রবণতা
					</h3>
					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={averageMarksData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="term" />
								<YAxis domain={[0, 100]} />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="average"
									stroke="#059669"
									strokeWidth={2}
									name="গড় নম্বর"
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Subject-wise Performance */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						বিষয়ভিত্তিক কর্মক্ষমতা
					</h3>
					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={subjectPerformanceData} layout="horizontal">
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis type="number" domain={[0, 100]} />
								<YAxis dataKey="subject" type="category" width={120} />
								<Tooltip />
								<Legend />
								<Bar dataKey="average" fill="#3b82f6" name="গড় নম্বর" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}
