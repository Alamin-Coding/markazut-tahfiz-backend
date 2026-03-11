import { Metadata } from "next";
import { SubjectConfigForm } from "@/components/dashboard/SubjectConfigForm";

export const metadata: Metadata = {
	title: "Subject Configuration - Markazut Tahfiz",
	description: "Manage test subjects for different departments and classes",
};

export default function SubjectConfigPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					বিষয় কনফিগারেশন
				</h1>
				<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
					বিভাগ ও শ্রেণী অনুযায়ী নিজস্ব বিষয়াবলি এবং তাদের ডিফল্ট নম্বর নির্ধারণ করুন
				</p>
			</div>

			<SubjectConfigForm />
		</div>
	);
}
