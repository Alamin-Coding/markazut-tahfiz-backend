"use client";

import { useGetNoticesQuery } from "@/features/notice/notice-api";
import { Loader2 } from "lucide-react";
import Animated from "@/components/frontend/Animated";

const AllNoticesPage = () => {
	const { data, isLoading } = useGetNoticesQuery();

	// Extract notices array from the API response
	const notices = data?.data || [];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Loader2 className="animate-spin text-green-600 size-10" />
			</div>
		);
	}

	if (!notices || notices.length === 0) {
		return (
			<div className="bg-white text-black py-20">
				<div className="container max-w-5xl mx-auto text-center">
					<h1 className="text-3xl font-bold mb-4">কোনো নোটিশ পাওয়া যায়নি</h1>
					<p className="text-gray-600">এখনও কোনো নোটিশ প্রকাশ করা হয়নি।</p>
				</div>
			</div>
		);
	}

	return (
		<section className="bg-white text-black py-20">
			<div className="container max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-10">সকল নোটিশ</h1>
				<div className="space-y-6">
					{notices.map((notice: any, index: number) => (
						<Animated
							key={notice._id}
							delay={index * 100}
							className="bg-gray-100 p-6 rounded-lg shadow-md"
						>
							<h2 className="text-xl font-bold mb-2">{notice.title}</h2>
							<p className="text-gray-600 mb-4">
								{new Date(notice.date || notice.createdAt).toLocaleDateString(
									"en-GB",
									{
										day: "numeric",
										month: "long",
										year: "numeric",
									}
								)}
							</p>
							<div className="text-gray-800">
								{(
									(Array.isArray(notice.content)
										? notice.content
										: notice.content.split("\n")) as string[]
								).map((line: string, idx: number) => (
									<p key={idx} className="mb-2">
										{line}
									</p>
								))}
							</div>
						</Animated>
					))}
				</div>
			</div>
		</section>
	);
};

export default AllNoticesPage;
