"use client";

import { useEffect, useState } from "react";
import TestimonialSlider from "../TestimonialSlider";
import { Loader2, AlertCircle } from "lucide-react";
import { env } from "../../../lib/frontend/env";

export default function Testimonial() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch(`${env.apiUrl}/api/testimonials`)
			.then((res) => res.json())
			.then((resData) => {
				if (resData.success) {
					setData(resData.data);
				} else {
					setError(true);
				}
			})
			.catch((err) => {
				console.error(err);
				setError(true);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="py-20 bg-gray-50 flex items-center justify-center">
				<Loader2 className="w-10 h-10 text-green-600 animate-spin" />
			</div>
		);
	}

	// Server connection error
	if (error) {
		return (
			<div className="py-20 bg-gray-50 flex flex-col items-center justify-center text-gray-800">
				<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2">মন্তব্য লোড করা যায়নি</h2>
				<p className="text-gray-600 text-center mb-6">
					দুঃখিত, বর্তমানে সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।
				</p>
			</div>
		);
	}

	// No testimonials in database
	if (data.length === 0) {
		return (
			<div className="py-20 bg-gray-50 flex flex-col items-center justify-center text-gray-800">
				<div className="w-16 h-16 text-gray-400 mb-4 flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-16 h-16"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold mb-2">কোনো মন্তব্য পাওয়া যায়নি</h2>
				<p className="text-gray-600 text-center mb-6">
					এখনও কোনো অভিভাবক মন্তব্য করেননি। শীঘ্রই এখানে মন্তব্য যুক্ত করা হবে।
				</p>
			</div>
		);
	}

	const testimonials = data.map((item: any, index: number) => ({
		id: item._id || index,
		name: item.name,
		location: item.location || "",
		text: item.message,
		image:
			item.image ||
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
		rating: item.rating || 5,
		ratingScore: 100,
	}));

	const sliderData = {
		title: "আমাদের অভিভাবকদের আমাদের সম্পর্কে যা বলেন",
		subtitle: "আমাদের মূল্যবান অভিভাবকদের মতামত এবং অভিজ্ঞতা জানুন",
		testimonials: testimonials,
	};

	return <TestimonialSlider {...sliderData} />;
}
