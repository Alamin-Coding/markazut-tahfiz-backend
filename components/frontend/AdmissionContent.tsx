"use client";

import { useState, useEffect } from "react";
import {
	ChevronDown,
	BookOpen,
	DollarSign,
	Clock,
	Users,
	FileText,
	Loader2,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Animated from "./Animated";
import { env } from "../../lib/frontend/env";

// Define interfaces locally
interface AdmissionPageData {
	header: {
		title: string;
		subtitle: string;
	};
	infoCards: Array<{
		icon: string;
		title: string;
		subtitle: string;
	}>;
	schedule: {
		online: {
			title: string;
			start: string;
			end: string;
			status: string;
		};
		exam: {
			title: string;
			date: string;
			time: string;
			location: string;
		};
	};
	classes: Array<{
		department: string;
		class: string;
		duration: string;
		fees: string;
		capacity: string;
	}>;
	requirements: string[];
	faq: Array<{
		q: string;
		a: string;
	}>;
	cta: {
		title: string;
		address: string;
		phone: string;
		email: string;
		buttonText: string;
	};
}

const AdmissionContent: React.FC = () => {
	const [openFAQ, setOpenFAQ] = useState<number | null>(null);
	const [data, setData] = useState<AdmissionPageData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`${env.apiUrl}/api/admission-page`);
				const json = await res.json();
				if (json.success && json.data) {
					setData(json.data);
				} else {
					setError(true);
				}
			} catch (err) {
				console.error("Failed to fetch admission data", err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const toggleFAQ = (index: number): void => {
		setOpenFAQ(openFAQ === index ? null : index);
	};

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "BookOpen":
				return <BookOpen className="w-8 h-8 text-emerald-600 mb-3" />;
			case "DollarSign":
				return <DollarSign className="w-8 h-8 text-emerald-600 mb-3" />;
			case "Users":
				return <Users className="w-8 h-8 text-emerald-600 mb-3" />;
			case "Clock":
				return <Clock className="w-8 h-8 text-emerald-600 mb-3" />;
			default:
				return <BookOpen className="w-8 h-8 text-emerald-600 mb-3" />;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
				<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2">সার্ভার ত্রুটি</h2>
				<p className="text-gray-600 text-center mb-6">
					দুঃখিত, বর্তমানে সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না। দয়া করে
					কিছুক্ষণ পর আবার চেষ্টা করুন।
				</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
				>
					রিফ্রেশ করুন
				</button>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header Banner */}
			<Animated delay={0} className="bg-emerald-900 text-white py-12">
				<div className="max-w-6xl mx-auto px-4">
					<h1 className="text-3xl font-bold mb-4">{data.header.title}</h1>
					<p className="text-emerald-100 text-lg">{data.header.subtitle}</p>
				</div>
			</Animated>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 py-12">
				{/* Info Cards */}
				<Animated
					delay={80}
					className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
				>
					{data.infoCards.map((card, i) => (
						<div
							key={i}
							className="bg-white p-6 rounded-lg shadow-md border-l-4 border-emerald-600"
						>
							{getIcon(card.icon)}
							<h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
							<p className="text-sm text-gray-600">{card.subtitle}</p>
						</div>
					))}
				</Animated>

				{/* Admission Schedule */}
				<Animated
					delay={160}
					className="bg-white rounded-lg shadow-md p-8 mb-12"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						ভর্তি সময়সূচী
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="border-l-4 border-blue-500 pl-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								{data.schedule.online.title}
							</h3>
							<p className="text-gray-600 mb-2">
								<strong>শুরু:</strong> {data.schedule.online.start}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>শেষ:</strong> {data.schedule.online.end}
							</p>
							<p className="text-gray-600">
								<strong>স্ট্যাটাস:</strong> {data.schedule.online.status}
							</p>
						</div>
						<div className="border-l-4 border-emerald-600 pl-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								{data.schedule.exam.title}
							</h3>
							<p className="text-gray-600 mb-2">
								<strong>তারিখ:</strong> {data.schedule.exam.date}
							</p>
							<p className="text-gray-600 mb-2">
								<strong>সময়:</strong> {data.schedule.exam.time}
							</p>
							<p className="text-gray-600">
								<strong>স্থান:</strong> {data.schedule.exam.location}
							</p>
						</div>
					</div>
				</Animated>

				{/* Class Information */}
				<Animated
					delay={240}
					className="bg-white rounded-lg shadow-md p-8 mb-12"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						শ্রেণী ও ফি তথ্য
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-emerald-50">
									<th className="px-4 py-3 text-left text-gray-800 font-semibold">
										বিভাগ
									</th>
									<th className="px-4 py-3 text-left text-gray-800 font-semibold">
										শ্রেণী
									</th>
									<th className="px-4 py-3 text-left text-gray-800 font-semibold">
										শিক্ষা মেয়াদ
									</th>
									<th className="px-4 py-3 text-left text-gray-800 font-semibold">
										বার্ষিক ফি
									</th>
									<th className="px-4 py-3 text-left text-gray-800 font-semibold">
										ধারণক্ষমতা
									</th>
								</tr>
							</thead>
							<tbody>
								{data.classes.map((item, idx) => (
									<tr
										key={idx}
										className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
									>
										<td className="px-4 py-3 text-gray-700 font-medium">
											{item.department}
										</td>
										<td className="px-4 py-3 text-gray-700 font-medium">
											{item.class}
										</td>
										<td className="px-4 py-3 text-gray-700">{item.duration}</td>
										<td className="px-4 py-3 text-gray-700">{item.fees}</td>
										<td className="px-4 py-3 text-gray-700">{item.capacity}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Animated>

				{/* Required Documents */}
				<Animated
					delay={320}
					className="bg-white rounded-lg shadow-md p-8 mb-12"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
						<FileText className="w-6 h-6 text-emerald-600" />
						প্রয়োজনীয় ডকুমেন্ট
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{data.requirements.map((req, idx) => (
							<div
								key={idx}
								className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
							>
								<div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
									✓
								</div>
								<span className="text-gray-700">{req}</span>
							</div>
						))}
					</div>
				</Animated>

				{/* FAQ Section */}
				<Animated
					delay={400}
					className="bg-white rounded-lg shadow-md p-8 mb-12"
				>
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						প্রায়শ জিজ্ঞাসিত প্রশ্ন
					</h2>
					<div className="space-y-4">
						{data.faq.map((faq, idx) => (
							<div key={idx} className="border border-gray-200 rounded-lg">
								<button
									onClick={() => toggleFAQ(idx)}
									className="w-full flex items-center cursor-pointer justify-between no-scale p-4 hover:bg-gray-50 transition"
								>
									<span className="font-semibold text-gray-800 text-left">
										{faq.q}
									</span>
									<ChevronDown
										className={`w-5 h-5 text-emerald-700 transition-transform ${
											openFAQ === idx ? "transform rotate-180" : ""
										}`}
									/>
								</button>
								{openFAQ === idx && (
									<div className="px-4 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
										{faq.a}
									</div>
								)}
							</div>
						))}
					</div>
				</Animated>

				{/* Contact Section */}
				<Animated
					delay={480}
					className="bg-emerald-900 text-white rounded-lg shadow-md p-8"
				>
					<h2 className="text-2xl font-bold mb-6">{data.cta.title}</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<h3 className="font-semibold text-emerald-100 mb-2">ঠিকানা</h3>
							<p className="text-emerald-50">{data.cta.address}</p>
						</div>
						<div>
							<h3 className="font-semibold text-emerald-100 mb-2">ফোন নম্বর</h3>
							<p className="text-emerald-50">{data.cta.phone}</p>
						</div>
						<div>
							<h3 className="font-semibold text-emerald-100 mb-2">ইমেইল</h3>
							<p className="text-emerald-50">{data.cta.email}</p>
						</div>
					</div>
					<Link
						href="/admission-form"
						className="mt-8 inline-block bg-white text-button px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
					>
						{data.cta.buttonText}
					</Link>
				</Animated>
			</div>
		</div>
	);
};

export default AdmissionContent;
