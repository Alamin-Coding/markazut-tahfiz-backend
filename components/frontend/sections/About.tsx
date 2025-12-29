"use client";

import {
	Phone,
	ArrowRight,
	School,
	NotebookPen,
	MonitorCog,
	BookOpenText,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { env } from "../../../lib/frontend/env";

interface StepCardProps {
	number: string;
	title: string;
	icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, icon }) => (
	<div
		className="bg-white group p-6 border-2 border-dashed hover:shadow-xl hover:scale-105 transition-all duration-500 border-gray-300 cursor-pointer flex flex-col items-center justify-center min-h-[140px] shadow-sm "
		style={{ borderRadius: "40px 40px 40px 0px" }}
	>
		<div className="w-16 h-16 group-hover:rotate-y-360 group-hover:scale-110 bg-button rounded-full transition-all duration-500 hover:shadow-lg flex items-center justify-center mb-3 text-white text-2xl">
			{icon}
		</div>
		<span className="text-button text-3xl font-bold mb-2">{number}</span>
		<p className="text-gray-800 text-center font-semibold ">{title}</p>
	</div>
);

const ImageCircle: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
	<div className="w-full h-full rounded-full border-dashed p-1 border-3 border-button overflow-hidden bg-gray-200 flex items-center justify-center">
		<img
			src={src}
			alt={alt}
			loading="lazy"
			className="w-full rounded-full h-full object-cover"
		/>
	</div>
);

const ImageSquare: React.FC<{
	src: string;
	alt: string;
	style?: React.CSSProperties;
}> = ({ src, alt, style }) => (
	<div
		style={{ borderRadius: "60px 60px 0px 60px", ...style }}
		className="w-full p-1 h-[400px] border-dashed border-3 border-button overflow-hidden bg-gray-200 flex items-center justify-center"
	>
		<img
			style={{ borderRadius: "53px 53px 0px 53px", ...style }}
			src={src}
			loading="lazy"
			alt={alt}
			className="w-full h-full object-cover"
		/>
	</div>
);

export default function About() {
	const [aboutData, setAboutData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch(`${env.apiUrl}/api/about`)
			.then(async (res) => {
				if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
				return res.json();
			})
			.then((data) => {
				if (data.success) {
					setAboutData(data.data);
				} else {
					setError(true);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch about data", err);
				setError(true);
			})
			.finally(() => setLoading(false));
	}, []);

	// Icon mapping
	const iconMap: { [key: string]: any } = {
		School: <School size={30} />,
		NotebookPen: <NotebookPen size={30} />,
		MonitorCog: <MonitorCog size={30} />,
		BookOpenText: <BookOpenText size={30} />,
		Phone: <Phone size={30} />,
		ArrowRight: <ArrowRight size={30} />,
	};

	if (loading) {
		return (
			<div className="w-full min-h-[60vh] bg-gray-50 flex items-center justify-center py-20">
				<Loader2 className="w-10 h-10 text-green-600 animate-spin" />
			</div>
		);
	}

	if (error || !aboutData) {
		return (
			<div className="w-full min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
				<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2 text-gray-800">
					সার্ভার ত্রুটি
				</h2>
				<p className="text-gray-600 text-center mb-6">
					দুঃখিত, বর্তমানে সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।
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

	const steps =
		aboutData.steps?.map((step: any) => ({
			...step,
			icon: iconMap[step.icon] || <School size={30} />,
		})) || [];

	const { title, description, image1, image2, image3, image4 } = aboutData;

	return (
		<div className="w-full bg-linear-to-b from-gray-50 to-white py-12 px-4 text-gray-900">
			<div className="container mx-auto">
				<div className="max-w-7xl mx-auto">
					{/* Steps Section */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
						{steps.map((step: any) => (
							<StepCard key={step.number} {...step} />
						))}
					</div>

					{/* Main Content Section */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
						{/* Left Images */}
						<div className="lg:col-span-1 space-y-6">
							<div className="w-full aspect-square">
								<ImageSquare src={image1} alt="About Image 1" />
							</div>
							<div className="w-full aspect-square">
								<ImageCircle src={image2} alt="About Image 2" />
							</div>
						</div>

						{/* Center Images */}
						<div className="lg:col-span-1 space-y-6">
							<div className="w-full aspect-square">
								<ImageCircle src={image3} alt="About Image 3" />
							</div>
							<div className="w-full aspect-square">
								<ImageSquare
									src={image4}
									alt="About Image 4"
									style={{ borderRadius: "0px 60px 60px 60px" }}
								/>
							</div>
						</div>

						{/* Right Content */}
						<div className="lg:col-span-1 flex flex-col justify-start">
							<div className="mb-4 flex items-center gap-2 text-green-700">
								<span className="text-sm font-semibold">🎯 আমাদের সেবা</span>
							</div>

							<h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
								{title}
							</h2>

							<p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-8 whitespace-pre-line">
								{description}
							</p>

							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4">
								<button className="bg-button hover:bg-hover cursor-pointer text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-colors">
									<span>বিস্তারিত</span>
									<ArrowRight size={18} />
								</button>
								<button className="bg-hover hover:bg-button cursor-pointer text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-colors">
									<Phone size={18} />
									<span>ফোন করুন</span>
								</button>
							</div>

							{/* Phone Number */}
							<div className="mt-6 pt-6 border-t border-gray-200">
								<p className="text-gray-600 text-xs font-medium mb-2">
									যোগাযোগ
								</p>
								<p className="text-2xl font-bold text-green-700">
									+8801712-054763
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
