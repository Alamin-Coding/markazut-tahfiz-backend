"use client";

import { LucideNotebookPen, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { env } from "../../lib/frontend/env";

interface InfoType {
	id: number;
	icon: React.ReactNode;
	quantity: number;
	title: string;
}

const Info: React.FC = () => {
	const [information, setInformation] = useState<InfoType[] | null>(null);
	const [backgroundImage, setBackgroundImage] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetchInfo();
	}, []);

	const fetchInfo = async () => {
		try {
			const res = await fetch(`${env.apiUrl}/api/info`, { cache: "no-store" });

			if (!res.ok) {
				console.error(`API request failed with status: ${res.status}`);
				setError(true);
				return;
			}

			const data = await res.json();
			if (data.success && data.data) {
				updateState(data.data);
			} else {
				setError(true);
			}
		} catch (error) {
			console.error("Failed to fetch info data:", error);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const updateState = (data: any) => {
		setInformation([
			{
				id: 1,
				icon: <LucideNotebookPen size={36} />,
				quantity: data.info1Quantity,
				title: data.info1Title,
			},
			{
				id: 2,
				icon: <LucideNotebookPen size={36} />,
				quantity: data.info2Quantity,
				title: data.info2Title,
			},
			{
				id: 3,
				icon: <LucideNotebookPen size={36} />,
				quantity: data.info3Quantity,
				title: data.info3Title,
			},
			{
				id: 4,
				icon: <LucideNotebookPen size={36} />,
				quantity: data.info4Quantity,
				title: data.info4Title,
			},
		]);
		if (data.backgroundImage) {
			setBackgroundImage(data.backgroundImage);
		}
	};

	if (loading) {
		return (
			<div className="py-20 bg-green-800 flex items-center justify-center">
				<Loader2 className="w-10 h-10 text-white animate-spin" />
			</div>
		);
	}

	if (error || !information) {
		return (
			<div className="py-20 bg-green-800 flex flex-col items-center justify-center text-white">
				<AlertCircle className="w-16 h-16 text-red-400 mb-4" />
				<h2 className="text-2xl font-bold mb-2">তথ্য লোড করা যায়নি</h2>
				<p className="text-green-50 text-center mb-6">
					দুঃখিত, সার্ভারের সমস্যার কারণে তথ্য দেখানো যাচ্ছে না।
				</p>
			</div>
		);
	}

	const bgStyle = {
		backgroundImage: `linear-gradient(rgba(0, 128, 0, 0.45), rgba(0, 128, 0, 0.45)), url("${
			backgroundImage || "/bg.avif"
		}")`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<div className="py-12 md:py-16" style={bgStyle}>
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 items-center justify-center">
					{information.map((item) => (
						<div
							key={item.id}
							className="flex flex-col items-center justify-center text-center"
						>
							<div
								className="bg-button flex items-center justify-center text-white shadow-md hover:shadow-lg transition-transform duration-300"
								style={{
									borderRadius: "20px 20px 20px 0px",
									width: "5.5rem",
									height: "5.5rem",
								}}
							>
								<div className="flex items-center justify-center w-full h-full">
									{item.icon}
								</div>
							</div>
							<h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mt-3 mb-1 drop-shadow-md">
								{item.quantity}
							</h3>
							<p className="text-sm sm:text-base md:text-lg text-white font-semibold drop-shadow-sm">
								{item.title}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Info;
