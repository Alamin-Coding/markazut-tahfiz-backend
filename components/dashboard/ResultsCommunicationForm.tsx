"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { inputClasses, selectClasses } from "./Constants";

export default function ResultsCommunicationForm() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				যোগাযোগ এবং নোটিফিকেশন
			</h2>
			<div className="space-y-6">
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
					<h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
						বাল্ক SMS ফলাফল পাঠান
					</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-gray-700 dark:text-gray-300">
								পরীক্ষা নির্বাচন করুন
							</Label>
							<Select>
								<SelectTrigger className={selectClasses}>
									<SelectValue placeholder="পরীক্ষা বেছে নিন" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="১ম পরীক্ষা ২০২৫">
										১ম পরীক্ষা ২০২৫
									</SelectItem>
									<SelectItem value="২য় পরীক্ষা ২০২৫">
										২য় পরীক্ষা ২০২৫
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label className="text-gray-700 dark:text-gray-300">
								বিভাগ/শ্রেণী (ঐচ্ছিক)
							</Label>
							<Input placeholder="সব বিভাগ/শ্রেণী" className={inputClasses} />
						</div>
						<Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto h-11">
							📱 ফলাফল SMS পাঠান
						</Button>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
					<h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
						জরুরি নোটিস
					</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-gray-700 dark:text-gray-300">
								নোটিস টাইটেল
							</Label>
							<Input placeholder="নোটিসের শিরোনাম" className={inputClasses} />
						</div>
						<div className="space-y-2">
							<Label className="text-gray-700 dark:text-gray-300">
								নোটিস কনটেন্ট
							</Label>
							<Textarea
								rows={4}
								placeholder="নোটিসের বিস্তারিত"
								className={inputClasses}
							/>
						</div>
						<Button className="bg-red-600 hover:bg-red-700 w-full md:w-auto h-11">
							🚨 নোটিস পাঠান
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
