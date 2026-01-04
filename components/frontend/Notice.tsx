import { AlertCircle } from "lucide-react";

interface NoticeItem {
	_id: string;
	title: string;
	date: string;
	content: string[];
	type: string;
}

interface NoticeProps {
	data: NoticeItem[];
}

const Notice: React.FC<NoticeProps> = ({ data }) => {
	if (!data || data.length === 0) {
		return (
			<div className="bg-red-600 py-3 text-white overflow-hidden">
				<div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2">
					<AlertCircle className="w-4 h-4" />
					<span>নোটিশ লোড করতে সমস্যা হয়েছে</span>
				</div>
			</div>
		);
	}

	const latestNotice: string[] = Array.isArray(data[0].content)
		? data[0].content
		: [data[0].content];

	return (
		<div className="bg-hover py-3 text-white overflow-hidden">
			<div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
				{/* Badge */}
				<div className="bg-button text-white px-4 py-1 rounded font-semibold whitespace-nowrap">
					লেটেস্ট নোটিশ
				</div>

				{/* Marquee */}
				<div className="flex-1 overflow-hidden relative">
					<div className="marquee">
						<div className="marquee-content whitespace-nowrap">
							{latestNotice?.map((text: string, i: number) => (
								<span
									key={i}
									className="mx-10 text-base md:text-lg inline-block"
								>
									{text} •
								</span>
							))}
							{/* Duplicate for infinite loop */}
							{latestNotice?.map((text: string, i: number) => (
								<span
									key={`dup-${i}`}
									className="mx-10 text-base md:text-lg inline-block"
								>
									{text} •
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notice;
