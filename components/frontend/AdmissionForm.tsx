"use client";

import { useState, useEffect } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import Animated from "./Animated";
import { env } from "../../lib/frontend/env";
import { toast } from "sonner";
import Image from "next/image";

// Types
interface AdmissionFormData {
	nameBangla: string;
	nameEnglish: string;
	fatherName: string;
	motherName: string;
	presentAddress: string;
	permanentAddress: string;
	exMadrasa: string;
	lastClass: string;
	admissionClass: string;
	admissionDepartment: string;
	guardianName: string;
	guardianPhone: string;
	guardianRelation: string;
	photo: File | null;
}

type InputEvent = React.ChangeEvent<
	HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const AdmissionForm: React.FC = () => {
	const [formData, setFormData] = useState<AdmissionFormData>({
		nameBangla: "",
		nameEnglish: "",
		fatherName: "",
		motherName: "",
		presentAddress: "",
		permanentAddress: "",
		exMadrasa: "",
		lastClass: "",
		admissionClass: "",
		admissionDepartment: "",
		guardianName: "",
		guardianPhone: "",
		guardianRelation: "",
		photo: null,
	});

	const [loading, setLoading] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [classConfigs, setClassConfigs] = useState<any[]>([]);
	const [availableClasses, setAvailableClasses] = useState<string[]>([]);

	useEffect(() => {
		const fetchConfigs = async () => {
			try {
				const res = await fetch(`${env.apiUrl}/api/class-config`);
				const json = await res.json();
				if (json.success) setClassConfigs(json.data);
			} catch (err) {
				console.error("Failed to load configs", err);
			}
		};
		fetchConfigs();
	}, []);

	const handleChange = (e: InputEvent) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		if (file) {
			setFormData((prev) => ({
				...prev,
				photo: file,
			}));
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoPreview(reader.result as string | null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		const requiredFields: (keyof AdmissionFormData)[] = [
			"nameBangla",
			"nameEnglish",
			"fatherName",
			"motherName",
			"presentAddress",
			"permanentAddress",
			"admissionClass",
			"admissionDepartment",
			"guardianName",
			"guardianPhone",
		];

		const allFieldsFilled = requiredFields.every((field) => {
			const val = formData[field];
			return typeof val === "string" ? val.trim() !== "" : val !== null;
		});

		if (!allFieldsFilled) {
			toast.error("অনুগ্রহ করে সকল বাধ্যতামূলক ক্ষেত্র পূরণ করুন।");
			return;
		}

		if (!formData.photo) {
			toast.error("অনুগ্রহ করে শিক্ষার্থীর ছবি আপলোড করুন।");
			return;
		}

		try {
			setLoading(true);

			// 1. Upload photo to Cloudinary via backend API
			const uploadFormData = new FormData();
			uploadFormData.append("files", formData.photo);
			uploadFormData.append("folder", "admissions");

			const uploadRes = await fetch(`${env.apiUrl}/api/upload`, {
				method: "POST",
				body: uploadFormData,
			});

			const uploadResult = await uploadRes.json();
			if (!uploadResult.success) {
				throw new Error(
					uploadResult.details ||
						uploadResult.error ||
						"ছবি আপলোড করতে ব্যর্থ হয়েছে"
				);
			}

			const photoUrl = uploadResult.data[0].url;

			// 2. Submit admission data
			const admissionData = {
				...formData,
				photo: photoUrl, // Replace File object with URL
			};

			const res = await fetch(`${env.apiUrl}/api/admission`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(admissionData),
			});

			const result = await res.json();
			if (result.success) {
				setSubmitted(true);
				setFormData({
					nameBangla: "",
					nameEnglish: "",
					fatherName: "",
					motherName: "",
					presentAddress: "",
					permanentAddress: "",
					exMadrasa: "",
					lastClass: "",
					admissionClass: "",
					admissionDepartment: "",
					guardianName: "",
					guardianPhone: "",
					guardianRelation: "",
					photo: null,
				});
				setPhotoPreview(null);

				// Scroll to top to see success message
				window.scrollTo({ top: 0, behavior: "smooth" });

				// Reset submitted state after 5 seconds
				setTimeout(() => setSubmitted(false), 5000);
			} else {
				throw new Error(
					result.details || result.message || "আবেদন জমা দিতে ব্যর্থ হয়েছে"
				);
			}
		} catch (error: any) {
			console.error("Admission submission error:", error);
			toast.error(error.message || "একটি ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header Banner */}
			<Animated delay={0} className="bg-emerald-900 text-white py-12">
				<div className="max-w-4xl mx-auto px-4">
					<h1 className="text-3xl font-bold mb-4">শিক্ষার্থী ভর্তি ফর্ম</h1>
					<p className="text-emerald-100 text-lg">
						মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসা
					</p>
				</div>
			</Animated>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto px-4 py-12">
				{/* Success Message */}
				{submitted && (
					<div className="mb-6 p-4 bg-green-100 border-2 border-emerald-600 text-green-800 rounded-lg flex items-start gap-3">
						<CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
						<div>
							<h3 className="font-bold mb-1">ভর্তি ফর্ম সফলভাবে জমা হয়েছে</h3>
							<p>আপনার আবেদন আমাদের কাছে পৌঁছেছে। আমরা শীঘ্রই যোগাযোগ করব।</p>
						</div>
					</div>
				)}

				<Animated
					delay={120}
					className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded"
				>
					<div className="flex gap-3">
						<AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
						<div className="text-sm text-blue-800">
							<strong>নোট:</strong> (*) চিহ্নিত ক্ষেত্রগুলি বাধ্যতামূলক। অনুগ্রহ
							করে সঠিক তথ্য প্রদান করুন।
						</div>
					</div>
				</Animated>

				<div className="space-y-8">
					{/* Section 1: Personal Information */}
					<Animated delay={240} className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-emerald-600">
							ব্যক্তিগত তথ্য
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									শিক্ষার্থীর নাম (বাংলা){" "}
									<span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									name="nameBangla"
									value={formData.nameBangla}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="বাংলায় নাম লিখুন"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									শিক্ষার্থীর নাম (ইংরেজি){" "}
									<span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									name="nameEnglish"
									value={formData.nameEnglish}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="Name in English"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									পিতার নাম <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									name="fatherName"
									value={formData.fatherName}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="পিতার সম্পূর্ণ নাম"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									মাতার নাম <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									name="motherName"
									value={formData.motherName}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="মাতার সম্পূর্ণ নাম"
								/>
							</div>
						</div>
					</Animated>

					{/* Section 2: Address Information */}
					<Animated delay={320} className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-emerald-600">
							ঠিকানা তথ্য
						</h2>

						<div className="space-y-6">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									বর্তমান ঠিকানা <span className="text-red-600">*</span>
								</label>
								<textarea
									name="presentAddress"
									value={formData.presentAddress}
									onChange={handleChange}
									rows={3}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 resize-none"
									placeholder="বর্তমান ঠিকানা বিস্তারিতভাবে লিখুন"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									স্থায়ী ঠিকানা <span className="text-red-600">*</span>
								</label>
								<textarea
									name="permanentAddress"
									value={formData.permanentAddress}
									onChange={handleChange}
									rows={3}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 resize-none"
									placeholder="স্থায়ী ঠিকানা বিস্তারিতভাবে লিখুন"
								/>
							</div>
						</div>
					</Animated>

					{/* Section 3: Educational Background */}
					<Animated delay={400} className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-emerald-600">
							শিক্ষাগত পটভূমি
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									পূর্ববর্তী মাদরাসার নাম
								</label>
								<input
									type="text"
									name="exMadrasa"
									value={formData.exMadrasa}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="মাদরাসার নাম (যদি থাকে)"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									শেষ শ্রেণী
								</label>
								<input
									type="text"
									name="lastClass"
									value={formData.lastClass}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="শেষ যে শ্রেণীতে পড়েছেন"
								/>
							</div>
						</div>
					</Animated>

					{/* Section 4: Admission Details */}
					<Animated delay={480} className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-emerald-600">
							ভর্তি তথ্য
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									বিভাগ <span className="text-red-600">*</span>
								</label>
								<select
									name="admissionDepartment"
									value={formData.admissionDepartment}
									onChange={(e) => {
										const val = e.target.value;
										setFormData((prev) => ({
											...prev,
											admissionDepartment: val,
											admissionClass: "",
										}));
										const conf = classConfigs.find((c) => c.department === val);
										setAvailableClasses(conf ? conf.classes : []);
									}}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
								>
									<option value="">-- বিভাগ নির্বাচন করুন --</option>
									{classConfigs.map((c, idx) => (
										<option key={idx} value={c.department}>
											{c.department}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									ভর্তির শ্রেণী <span className="text-red-600">*</span>
								</label>
								<select
									name="admissionClass"
									value={formData.admissionClass}
									onChange={handleChange}
									disabled={!formData.admissionDepartment}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 disabled:bg-gray-100"
								>
									<option value="">-- শ্রেণী নির্বাচন করুন --</option>
									{availableClasses.map((cls, idx) => (
										<option key={idx} value={cls}>
											{cls}
										</option>
									))}
								</select>
							</div>
						</div>
					</Animated>

					{/* Section 5: Guardian Information */}
					<Animated delay={560} className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-emerald-600">
							অভিভাবক তথ্য
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									অভিভাবকের নাম <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									name="guardianName"
									value={formData.guardianName}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="অভিভাবকের সম্পূর্ণ নাম"
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									অভিভাবকের সম্পর্ক
								</label>
								<select
									name="guardianRelation"
									value={formData.guardianRelation}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
								>
									<option value="">-- সম্পর্ক নির্বাচন করুন --</option>
									<option value="পিতা">পিতা</option>
									<option value="মাতা">মাতা</option>
									<option value="চাচা">চাচা</option>
									<option value="খালা">খালা</option>
									<option value="দাদা">দাদা</option>
									<option value="দাদি">দাদি</option>
									<option value="অন্যান্য">অন্যান্য</option>
								</select>
							</div>

							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									অভিভাবকের ফোন নম্বর <span className="text-red-600">*</span>
								</label>
								<input
									type="tel"
									name="guardianPhone"
									value={formData.guardianPhone}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
									placeholder="+৮৮০১৭१२-०५४৭६৩"
								/>
							</div>
						</div>
					</Animated>

					{/* Section 6: Photo Upload */}
					<Animated delay={640} className="bg-white rounded-lg shadow-md p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-emerald-600">
							শিক্ষার্থীর ছবি
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">
									ছবি আপলোড করুন <span className="text-red-600">*</span>
								</label>
								<label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-600 transition">
									<div className="flex flex-col items-center">
										<Upload className="w-10 h-10 text-gray-400 mb-2" />
										<span className="text-sm text-gray-600">
											ছবি নির্বাচন করুন
										</span>
									</div>
									<input
										type="file"
										accept="image/*"
										onChange={handlePhotoChange}
										className="hidden"
									/>
								</label>
							</div>

							{photoPreview && (
								<div className="flex flex-col items-center justify-center">
									<div className="border-2 border-emerald-600 rounded-lg overflow-hidden">
										<Image
											src={photoPreview}
											alt="Preview"
											width={192}
											height={256}
											className="w-48 h-64 object-cover"
										/>
									</div>
									<p className="text-sm text-green-600 mt-2">✓ ছবি নির্বাচিত</p>
								</div>
							)}
						</div>
					</Animated>

					{/* Submit Button */}
					<Animated delay={720} className="bg-white rounded-lg shadow-md p-8">
						<button
							type="button"
							onClick={handleSubmit}
							disabled={loading}
							className={`w-full bg-button cursor-pointer hover:scale-105 no-scale hover:bg-hover text-white py-4 rounded-lg font-bold text-lg transition ${
								loading ? "opacity-70 cursor-not-allowed" : ""
							}`}
						>
							{loading ? "জমা দেওয়া হচ্ছে..." : "ফর্ম জমা দিন"}
						</button>
						<p className="text-center text-gray-600 text-sm mt-4">
							ফর্ম জমা দেওয়ার পর আমরা আপনার সাথে যোগাযোগ করব।
						</p>
					</Animated>
				</div>
			</div>
		</div>
	);
};

export default AdmissionForm;
