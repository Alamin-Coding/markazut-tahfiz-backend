import { useState, useEffect } from "react";
import Link from "next/link";
import {
	ChevronRight,
	BookOpen,
	Users,
	Loader2,
	AlertCircle,
} from "lucide-react";
import Animated from "./Animated";
import type { Department } from "../../types/frontend";
import { env } from "../../lib/frontend/env";

const DepartmentsContent: React.FC = () => {
	const [hoveredDept, setHoveredDept] = useState<number | null>(null);
	const [pageData, setPageData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch(`${env.apiUrl}/api/departments`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setPageData(data.data);
				} else {
					setError(true);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch department page data", err);
				setError(true);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 text-green-600 animate-spin" />
			</div>
		);
	}

	if (error || !pageData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
				<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2">সার্ভার ত্রুটি</h2>
				<p className="text-gray-600 text-center mb-6">
					দুঃখিত, বর্তমানে সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না। দয়া করে
					কিছুক্ষণ পর আবার চেষ্টা করুন।
				</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
				>
					রিফ্রেশ করুন
				</button>
			</div>
		);
	}

	const departments: Department[] =
		pageData.departments?.map((dept: any, index: number) => ({
			id: index + 1,
			name: dept.name,
			description: dept.description,
			icon: dept.icon,
			color: dept.color,
			details: dept.details,
		})) || [];

	const statColors = [
		{ bg: "bg-blue-100", text: "text-blue-600" },
		{ bg: "bg-green-100", text: "text-green-600" },
		{ bg: "bg-purple-100", text: "text-purple-600" },
		{ bg: "bg-amber-100", text: "text-amber-600" },
	];

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
			{/* Header */}
			<div className="bg-linear-to-r from-button to-green-600 text-white py-12 px-4">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						{pageData.header?.title}
					</h1>
					<p className="text-lg text-green-100">{pageData.header?.subtitle1}</p>
					<p className="text-green-100 mt-2">{pageData.header?.subtitle2}</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 py-16">
				{/* Intro Section */}
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-slate-800 mb-4">
						{pageData.intro?.title}
					</h2>
					<p className="text-lg text-slate-600 max-w-2xl mx-auto">
						{pageData.intro?.description}
					</p>
				</div>

				{/* Departments Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
					{departments.map((dept) => (
						<div
							key={dept.id}
							onMouseEnter={() => setHoveredDept(dept.id)}
							onMouseLeave={() => setHoveredDept(null)}
							className="transform transition duration-300 hover:scale-105 "
						>
							<Link href={`/departments/${dept.id}`}>
								<Animated
									className={`rounded-xl shadow-lg hover:shadow-xl transition-all p-8 text-white h-full cursor-pointer ${dept.color}`}
								>
									<div className="text-5xl mb-4">{dept.icon}</div>
									<h3 className="text-2xl font-bold mb-2">{dept.name}</h3>
									<p className="text-green-50 mb-4 text-sm">
										{dept.description}
									</p>

									{hoveredDept === dept.id && (
										<div className="mt-4 pt-4 border-t border-green-200">
											<p className="text-sm text-green-50">{dept.details}</p>
											<div className="flex items-center mt-3 text-green-100">
												<ChevronRight size={18} className="mr-2" />
												<span className="text-sm font-semibold">আরও জানুন</span>
											</div>
										</div>
									)}
								</Animated>
							</Link>
						</div>
					))}
				</div>

				{/* Statistics Section */}
				<div className="bg-white rounded-xl shadow-lg p-8 mb-16">
					<h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
						{pageData.stats?.title}
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{pageData.stats?.items?.map((item: any, index: number) => {
							const colors = statColors[index % statColors.length];
							return (
								<div className="text-center" key={index}>
									<div className={`${colors.bg} rounded-lg p-6 mb-3`}>
										<p className={`text-3xl font-bold ${colors.text}`}>
											{item.count}
										</p>
									</div>
									<p className="text-slate-600 font-semibold">{item.label}</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* Features Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{pageData.features?.map((feature: any, index: number) => {
						// Use default icon 'BookOpen' or 'Users' if stored as string, but here we need to map string to Component if possible
						// Or just simplistic logic: index 0 -> BookOpen, index 1 -> Users if dynamic icon names are not fully supported or map them.
						// Lets try to support dynamic icon name if possible.
						const Icon = feature.icon === "Users" ? Users : BookOpen;

						// Dynamic colors based on index or just alternating
						const iconColor =
							index % 2 === 0 ? "text-green-600" : "text-purple-600";

						return (
							<div className="bg-white rounded-xl shadow-lg p-8" key={index}>
								<h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
									<Icon className={`mr-3 ${iconColor}`} size={28} />
									{feature.title}
								</h3>
								<ul className="space-y-3 text-slate-600">
									{feature.items.map((item: string, idx: number) => (
										<li className="flex items-start" key={idx}>
											<span className={`${iconColor} mr-3 font-bold`}>✓</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						);
					})}
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-hover text-white py-12 px-4 mt-16">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl font-bold mb-4">
						{pageData?.cta?.title || "আপনার সন্তানকে ভর্তি করান"}
					</h2>
					<p className="text-lg text-green-100 mb-8">
						{pageData?.cta?.description ||
							"আমাদের যেকোনো বিভাগে এখনই যোগাযোগ করুন"}
					</p>
					<button className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
						{pageData?.cta?.buttonText || "যোগাযোগ করুন"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DepartmentsContent;
