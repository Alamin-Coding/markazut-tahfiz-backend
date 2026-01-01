"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { env } from "../../../lib/frontend/env";

// Hero Component
const Hero: React.FC = () => {
	const [heroData, setHeroData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch(`${env.apiUrl}/api/hero`)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setHeroData(data.data);
				} else {
					setError(true);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch hero data", err);
				setError(true);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="relative w-full min-h-[60vh] lg:min-h-[700px] bg-gray-900 flex items-center justify-center">
				<Loader2 className="w-10 h-10 text-green-500 animate-spin" />
			</div>
		);
	}

	if (error || !heroData) {
		return (
			<div className="relative w-full min-h-[60vh] lg:min-h-[700px] bg-gray-900 flex flex-col items-center justify-center text-white px-4">
				<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2 text-center">সার্ভার ত্রুটি</h2>
				<p className="text-gray-300 text-center mb-6">
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

	const { title, description, buttonText, backgroundImage } = heroData;

	return (
		<div className="relative w-full min-h-[60vh] lg:min-h-[700px] bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
			{/* Background Image Overlay (responsive: lighter on mobile, fixed on md+) */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-local md:bg-fixed opacity-25 sm:opacity-40 pointer-events-none"
				style={{
					backgroundImage: `url(${backgroundImage || "/bg.avif"})`,
				}}
			/>

			{/* Content */}
			<div className="relative w-full flex items-center justify-center container mx-auto px-4 py-12 md:py-20">
				<div className="max-w-4xl mx-auto text-center text-white">
					<h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
						{title}
					</h1>

					<p className="text-base sm:text-lg md:text-xl mb-8 leading-relaxed text-gray-100 whitespace-pre-line">
						{description}
					</p>

					<button className="bg-button hover:bg-hover cursor-pointer text-white px-6 py-3 rounded-full text-base sm:text-lg font-medium transition-all hover:scale-105 duration-300 inline-flex items-center gap-2">
						{buttonText}
					</button>
				</div>
			</div>

			{/* Decorative Elements */}
			<div
				className="absolute -z-10 bottom-0 left-0 right-0"
				aria-hidden="true"
			>
				<svg
					viewBox="0 0 1200 120"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					className="w-full h-auto"
				>
					<path
						d="M0,60 Q300,0 600,60 T1200,60 L1200,120 L0,120 Z"
						fill="white"
						opacity="0.1"
					/>
				</svg>
			</div>
		</div>
	);
};

export default Hero;
