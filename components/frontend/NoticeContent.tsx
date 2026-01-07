import Animated from "./Animated";
import { useGetNoticesQuery } from "../../features/notice/notice-api";
import Link from "next/link";

const NoticeContent: React.FC = () => {
	const { isLoading, data } = useGetNoticesQuery();
	if (isLoading) return <div>Loading...</div>;
	if (!data) return;

	const lastNotice = data?.data[0] || [];

	return (
		<section className="bg-white text-white py-20">
			<div className="container max-w-5xl shadow-xl min-h-[400px] mx-auto flex flex-col justify-between">
				<Animated delay={0} className="bg-hover p-5 rounded-md">
					<h1 className="text-2xl font-bold">{lastNotice?.title}</h1>
					<p className="text-gray-200">
						{new Date(lastNotice?.date).toLocaleDateString("en-GB", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</p>
				</Animated>
				<Animated delay={120} className="bg-white text-black p-5">
					{(
						(Array.isArray(lastNotice?.content)
							? lastNotice.content
							: lastNotice.content.split("\n")) as string[]
					).map((line: string, idx: number) => (
						<p key={idx} className="mb-2">
							{line}
						</p>
					))}
				</Animated>

				<Animated
					delay={240}
					className="bg-gray-100 p-5 flex justify-center rounded-md"
				>
					<Link
						href="/all-notices"
						className="bg-button py-2 cursor-pointer hover:bg-hover px-4 rounded-full text-white no-underline"
					>
						সকল নোটিশ দেখুন
					</Link>
				</Animated>
			</div>
		</section>
	);
};

export default NoticeContent;
