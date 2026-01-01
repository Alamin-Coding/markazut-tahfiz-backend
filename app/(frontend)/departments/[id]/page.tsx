"use client";

import { useState, useEffect } from "react";
import {
	ArrowLeft,
	BookOpen,
	Users,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import Link from "next/link";
import Animated from "@/components/frontend/Animated";
import { useParams } from "next/navigation";
import { env } from "@/lib/frontend/env";

// Define interface matching the data structure
interface Department {
	name: string;
	description: string;
	icon: string;
	color: string;
	details: string;
	features?: string[];
	targetAudience?: string;
}

export default function DepartmentDetailsPage() {
	const params = useParams();
	const id = params.id;
	const [department, setDepartment] = useState<Department | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		fetch(`${env.apiUrl}/api/departments/${id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setDepartment(data.data);
				} else {
					setError(data.message || "Department data unavailable");
				}
			})
			.catch((err) => {
				console.error("Failed to fetch department", err);
				setError("Failed to load department details");
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<Loader2 className="animate-spin h-12 w-12 text-emerald-600" />
			</div>
		);
	}

	if (error || !department) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
				<h2 className="text-2xl font-bold text-red-500 mb-4">
					{error || "Department not found"}
				</h2>
				<Link
					href="/departments"
					className="text-emerald-600 hover:underline flex items-center"
				>
					<ArrowLeft className="mr-2" size={20} /> সকল বিভাগে ফিরে যান
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header / Hero */}
			<div className={`bg-emerald-900 text-white py-16 px-4`}>
				<div className="max-w-4xl mx-auto">
					<Link
						href="/departments"
						className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
					>
						<ArrowLeft className="mr-2" size={20} /> সকল বিভাগ ফিরে যান
					</Link>
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
						<div className="text-6xl bg-white/10 p-4 rounded-xl backdrop-blur-sm">
							{department.icon}
						</div>
						<div>
							<h1 className="text-3xl md:text-5xl font-bold mb-3">
								{department.name}
							</h1>
							<p className="text-xl opacity-90">{department.description}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto px-4 py-12">
				<Animated className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
					<h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
						<BookOpen className="mr-3 text-emerald-600" />
						বিস্তারিত তথ্য
					</h2>
					<p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
						{department.details}
					</p>
				</Animated>

				<div className="grid md:grid-cols-2 gap-6">
					<Animated
						className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
						delay={100}
					>
						<h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
							<CheckCircle2 className="mr-3 text-blue-600" />
							বৈশিষ্ট্যসমূহ
						</h3>
						<ul className="space-y-3">
							{department.features && department.features.length > 0 ? (
								department.features.map((feature: string, idx: number) => (
									<li key={idx} className="flex items-start text-slate-600">
										<span className="mr-2 text-blue-500">•</span> {feature}
									</li>
								))
							) : (
								<li className="text-slate-500 italic">কোনো তথ্য নেই</li>
							)}
						</ul>
					</Animated>

					<Animated
						className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
						delay={200}
					>
						<h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
							<Users className="mr-3 text-purple-600" />
							কাদের জন্য?
						</h3>
						<p className="text-slate-600 mb-4">
							{department.targetAudience || "তথ্য উপলব্ধ নয়"}
						</p>
					</Animated>
				</div>

				<div className="mt-12 text-center">
					<Link
						href="/admission"
						className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
					>
						ভর্তির জন্য আবেদন করুন
					</Link>
				</div>
			</div>
		</div>
	);
}
