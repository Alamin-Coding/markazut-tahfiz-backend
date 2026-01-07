"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { inputClasses, labelClasses } from "./Constants";

export function ContactInfoForm() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				যোগাযোগ পেজ - যোগাযোগ তথ্য সম্পাদনা
			</h2>
			<form className="space-y-8">
				{/* Hero Section */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						হিরো সেকশন
					</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className={labelClasses}>শিরোনাম</Label>
							<Input
								type="text"
								defaultValue="আমাদের সাথে যোগাযোগ করুন"
								className={inputClasses}
							/>
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>সাবটাইটেল</Label>
							<Input
								type="text"
								defaultValue="মারকাজুত তাহফিজ ইন্সটিটিউশনাল মাদরাসা"
								className={inputClasses}
							/>
						</div>
					</div>
				</div>

				{/* Contact Info Cards */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						যোগাযোগ তথ্য কার্ডস
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{[
							{
								title: "আমাদের ঠিকানা",
								details: "ধানাবাড়ি, চাঁদপুর, বাংলাদেশ",
							},
							{
								title: "ফোন নম্বর",
								details: "+৮৮০১৭১২-০৫৪৭৬৩",
							},
							{
								title: "ইমেইল",
								details: "nesarahmd763@gmail.com",
							},
							{
								title: "অফিস সময়",
								details: "সোম - শুক্র: ৯:০০ AM - ৫:০০ PM",
							},
						].map((info, idx) => (
							<div
								key={idx}
								className="p-4 border dark:border-gray-700 rounded-md space-y-4"
							>
								<div className="space-y-2">
									<Label className={labelClasses}>টাইটেল</Label>
									<Input
										type="text"
										defaultValue={info.title}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>বিস্তারিত</Label>
									<Input
										type="text"
										defaultValue={info.details}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Departments */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						বিভাগীয় তথ্য
					</h3>
					<div className="space-y-4">
						{[
							{
								name: "ভর্তি বিভাগ",
								phone: "+৮৮০১৭১২-০৫৪৭৬৩",
								email: "admission@markazut.com",
							},
							{
								name: "শিক্ষা বিভাগ",
								phone: "+৮৮০১৭१२-०५४७६৩",
								email: "academics@markazut.com",
							},
							{
								name: "প্রশাসনিক বিভাগ",
								phone: "+৮৮০১৭१२-०५४७६৩",
								email: "admin@markazut.com",
							},
						].map((dept, idx) => (
							<div
								key={idx}
								className="p-4 border dark:border-gray-700 rounded-md space-y-4"
							>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label className={labelClasses}>বিভাগ নাম</Label>
										<Input
											type="text"
											defaultValue={dept.name}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ফোন</Label>
										<Input
											type="text"
											defaultValue={dept.phone}
											className={inputClasses}
										/>
									</div>
									<div className="space-y-2">
										<Label className={labelClasses}>ইমেইল</Label>
										<Input
											type="text"
											defaultValue={dept.email}
											className={inputClasses}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700 h-11">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}

export function ContactForm() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
				যোগাযোগ পেজ - যোগাযোগ ফর্ম এবং FAQ সম্পাদনা
			</h2>
			<form className="space-y-8">
				{/* Contact Form Fields */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						যোগাযোগ ফর্ম
					</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className={labelClasses}>ফর্ম টাইটেল</Label>
							<Input
								type="text"
								defaultValue="বার্তা পাঠান"
								className={inputClasses}
							/>
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>সাকসেস মেসেজ</Label>
							<Textarea
								rows={2}
								defaultValue="✓ আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
								className={inputClasses}
							/>
						</div>
						<div className="space-y-2">
							<Label className={labelClasses}>বাটন টেক্সট</Label>
							<Input
								type="text"
								defaultValue="বার্তা পাঠান"
								className={inputClasses}
							/>
						</div>
					</div>
				</div>

				{/* FAQ Section */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
					<h3 className="text-md font-medium text-green-600 dark:text-green-400 mb-4">
						FAQ সেকশন
					</h3>
					<div className="space-y-4">
						{[
							{
								q: "আমরা কখন উপলব্ধ?",
								a: "সোমবার থেকে শুক্রবার সকাল ৯:০০ টা থেকে সন্ধ্যা ৫:০০ টা পর্যন্ত। শনি ও রবিবার বন্ধ।",
							},
							{
								q: "জরুরি যোগাযোগের জন্য?",
								a: "জরুরি বিষয়ের জন্য সরাসরি আমাদের ফোন নম্বরে কল করুন: +৮৮০১৭१२-०५४७६৩",
							},
							{
								q: "আমরা কত দ্রুত সাড়া দিই?",
								a: "সাধারণত ২৪ ঘন্টার মধ্যে আমরা আপনার সাথে যোগাযোগ করি।",
							},
							{
								q: "অনলাইন চ্যাট সুবিধা?",
								a: "হ্যাঁ, ইমেইল বা ফেসবুকের মাধ্যমে আপনি আমাদের সাথে লাইভ চ্যাট করতে পারেন।",
							},
						].map((faq, idx) => (
							<div
								key={idx}
								className="p-4 border dark:border-gray-700 rounded-md space-y-4"
							>
								<div className="space-y-2">
									<Label className={labelClasses}>প্রশ্ন</Label>
									<Input
										type="text"
										defaultValue={faq.q}
										className={inputClasses}
									/>
								</div>
								<div className="space-y-2">
									<Label className={labelClasses}>উত্তর</Label>
									<Textarea
										rows={2}
										defaultValue={faq.a}
										className={inputClasses}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<Button type="submit" className="bg-green-600 hover:bg-green-700 h-11">
					সেভ করুন
				</Button>
			</form>
		</div>
	);
}
