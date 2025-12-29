"use client";

import { useEffect, useState } from "react";
import { fetchJSON } from "../../../lib/frontend/utils/fetchJSON";
import { Loader2, AlertCircle } from "lucide-react";

interface GalleryItem {
	id: number | string;
	image: string;
	alt: string;
}

interface GalleryGridProps {
	title: string;
	subtitle: string;
	images: GalleryItem[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
	title,
	subtitle,
	images,
}) => {
	return (
		<section className="bg-white py-16 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<p className="text-green-600 text-lg mb-2 flex items-center justify-center gap-2">
						<span>📚</span>
						<span className="underline underline-offset-8">গ্যা লা রি</span>
					</p>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 mt-3">
						{title}
					</h2>
					<p className="text-gray-600 text-base">{subtitle}</p>
				</div>

				{/* Gallery Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{images.map((item) => (
						<div
							key={item.id}
							className="relative group cursor-pointer overflow-hidden rounded-2xl h-58 md:h-60"
							style={{ borderRadius: "60px 60px 60px 0px" }}
						>
							<img
								src={item.image}
								alt={item.alt}
								loading="lazy"
								className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
							/>
							{/* Overlay */}
							<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 flex items-center justify-center">
								<div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									🔍
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

// Example usage
export default function Gallery() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const loadGallery = async () => {
			try {
				const resData = await fetchJSON("/api/gallery");
				if (resData.success && Array.isArray(resData.data)) {
					setData(resData.data);
				} else {
					setError(true);
				}
			} catch (err) {
				console.error("Failed to load gallery:", err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		loadGallery();
	}, []);

	if (loading) {
		return (
			<section className="bg-white py-16 px-4">
				<div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
					<Loader2 className="w-10 h-10 text-green-600 animate-spin" />
				</div>
			</section>
		);
	}

	if (error || data.length === 0) {
		return (
			<section className="bg-white py-16 px-4">
				<div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[400px] text-gray-800">
					<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
					<h2 className="text-2xl font-bold mb-2">গ্যালারি লোড করা যায়নি</h2>
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
			</section>
		);
	}

	const images = data.map((item: any) => ({
		id: item._id,
		image: item.imageUrl,
		alt: item.title || "Gallery Image",
	}));

	const galleryData: GalleryGridProps = {
		title: "আমাদের ফটো গ্যালারি",
		subtitle: "আমাদের স্মৃতিময় মুহূর্তগুলি এখানে দেখুন",
		images: images,
	};

	return <GalleryGrid {...galleryData} />;
}
