import { useEffect, useState } from "react";
import Link from "next/link";
import Animated from "./Animated";
import { BookOpen, Loader2, AlertCircle } from "lucide-react";

interface IAboutData {
	hero: {
		title: string;
		subtitle: string;
		backgroundImage: string;
	};
	mission: {
		title: string;
		content: string;
	};
	vision: {
		title: string;
		content: string;
	};
	history: {
		title: string;
		paragraphs: string[];
	};
	features: Array<{
		title: string;
		description: string;
		icon: string;
	}>;
	achievements: Array<{
		title: string;
		description: string;
	}>;
	programs: Array<{
		title: string;
		duration: string;
		description: string;
	}>;
	values: Array<{
		title: string;
		description: string;
	}>;
	facilities: Array<{
		title: string;
		description: string;
	}>;
	cta: {
		title: string;
		description: string;
		buttonText: string;
	};
}

import { env } from "../../lib/frontend/env";

const AboutContent: React.FC = () => {
	const [data, setData] = useState<IAboutData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`${env.apiUrl}/api/about`);
				const json = await res.json();
				if (json.success && json.data) {
					setData(json.data);
				}
			} catch (error) {
				console.error("Failed to fetch about data", error);
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin w-10 h-10 text-green-600" />
			</div>
		);
	}

	if (error || !data) {
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

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header Banner */}
			<div className="bg-linear-to-r from-button to-green-800 text-white py-12 relative overflow-hidden">
				{data.hero.backgroundImage && (
					<div className="absolute inset-0 z-0">
						<img
							src={data.hero.backgroundImage}
							alt="Hero Background"
							className="w-full h-full object-cover opacity-20"
						/>
					</div>
				)}
				<div className="max-w-6xl mx-auto px-4 relative z-10">
					<h1 className="text-3xl font-bold mb-4">{data.hero.title}</h1>
					<p className="text-green-100 text-lg">{data.hero.subtitle}</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 py-12">
				{/* Introduction Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					<div className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-3xl font-bold text-gray-800 mb-6">
							{data.mission.title.replace(":", "")} ও{" "}
							{data.vision.title.replace(":", "")}
						</h2>
						<div className="space-y-4 text-gray-700">
							<div>
								<h3 className="font-bold text-lg text-green-600 mb-2">
									{data.mission.title}
								</h3>
								<p>{data.mission.content}</p>
							</div>
							<div>
								<h3 className="font-bold text-lg text-green-600 mb-2">
									{data.vision.title}
								</h3>
								<p>{data.vision.content}</p>
							</div>
						</div>
					</div>

					<div className="bg-linear-to-br from-button to-green-800 rounded-lg shadow-md p-8 text-white">
						<h2 className="text-3xl font-bold mb-6">প্রতিষ্ঠানের ইতিহাস</h2>
						<div className="space-y-4 text-green-50">
							{data.history.paragraphs.map((p, idx) => (
								<p key={idx}>{p}</p>
							))}
						</div>
					</div>
				</div>

				{/* Features Section */}
				{data.features.length > 0 && (
					<div className="mb-16">
						<h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
							আমাদের বৈশিষ্ট্য
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{data.features.map((feature, idx) => {
								return (
									<Animated
										key={idx}
										className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition flex flex-col items-center text-center"
										delay={idx * 60}
									>
										{feature.icon ? (
											<img
												src={feature.icon}
												alt={feature.title}
												className="w-16 h-16 mb-4 object-contain"
											/>
										) : (
											<BookOpen className="w-12 h-12 text-green-600 mb-4" />
										)}
										<h3 className="text-xl font-bold text-gray-800 mb-3">
											{feature.title}
										</h3>
										<p className="text-gray-600">{feature.description}</p>
									</Animated>
								);
							})}
						</div>
					</div>
				)}

				{/* Statistics Section */}
				{data.achievements.length > 0 && (
					<div className="bg-linear-to-r from-button to-green-800 rounded-lg shadow-md p-12 mb-16 text-white">
						<h2 className="text-3xl font-bold mb-12 text-center">
							আমাদের অর্জন
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{data.achievements.map((achievement, idx) => (
								<div key={idx} className="text-center">
									<div className="text-5xl font-bold mb-2">
										{achievement.title}
									</div>
									<div className="text-green-100">
										{achievement.description}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Programs Section */}
				{data.programs.length > 0 && (
					<div className="mb-16">
						<h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
							আমাদের শিক্ষা কর্মসূচি
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{data.programs.map((program, idx) => (
								<div
									key={idx}
									className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-600"
								>
									<h3 className="text-xl font-bold text-gray-800 mb-2">
										{program.title}
									</h3>
									<p className="text-green-600 font-semibold mb-3">
										সময়কাল: {program.duration}
									</p>
									<p className="text-gray-600">{program.description}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Values Section */}
				{data.values.length > 0 && (
					<div className="mb-16">
						<h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
							আমাদের মূল্যবোধ
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{data.values.map((value, idx) => (
								<div key={idx} className="bg-white rounded-lg shadow-md p-8">
									<h3 className="text-xl font-bold text-gray-800 mb-3 ">
										{value.title}
									</h3>
									<p className="text-gray-600">{value.description}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Facilities Section */}
				{data.facilities.length > 0 && (
					<div className="bg-linear-to-br from-blue-50 to-green-50 rounded-lg shadow-md p-12 mb-16">
						<h2 className="text-3xl font-bold text-gray-800 mb-8">
							আমাদের সুবিধাসমূহ
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{data.facilities.map((facility, idx) => (
								<div key={idx} className="flex items-start gap-4">
									<div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">
										✓
									</div>
									<div>
										<h3 className="font-bold text-gray-800 mb-1">
											{facility.title}
										</h3>
										<p className="text-gray-600">{facility.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Call to Action */}
				<div className="bg-hover rounded-lg shadow-md p-12 text-white text-center">
					<h2 className="text-3xl font-bold mb-4">{data.cta.title}</h2>
					<p className="text-green-100 mb-8 text-lg">{data.cta.description}</p>
					<Link
						href="/admission"
						className="bg-white text-green-700 px-10 py-3 rounded-lg font-bold hover:bg-green-50 transition"
					>
						{data.cta.buttonText}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AboutContent;
