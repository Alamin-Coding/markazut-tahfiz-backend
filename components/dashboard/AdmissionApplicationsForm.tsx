"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Users, FileText, AlertCircle, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

function InfoField({
	label,
	value,
	fullWidth = false,
}: {
	label: string;
	value: string;
	fullWidth?: boolean;
}) {
	return (
		<div className={fullWidth ? "md:col-span-2" : ""}>
			<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
			<p className="font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-1">
				{value || "তথ্য নেই"}
			</p>
		</div>
	);
}

export default function AdmissionApplicationsForm() {
	const [applications, setApplications] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedApp, setSelectedApp] = useState<any>(null);

	useEffect(() => {
		fetchApplications();
	}, []);

	const fetchApplications = async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/admission");
			const json = await res.json();
			if (json.success) {
				setApplications(json.data);
			}
		} catch (error) {
			console.error("Failed to fetch applications", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "accepted":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "reviewing":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "accepted":
				return "অনুমোদিত";
			case "pending":
				return "পেন্ডিং";
			case "reviewing":
				return "রিভিউ";
			case "rejected":
				return "প্রত্যাখ্যাত";
			default:
				return status;
		}
	};

	const handleStatusChange = async (id: string, newStatus: string) => {
		try {
			const res = await fetch(`/api/admission/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});
			const json = await res.json();
			if (json.success) {
				setApplications((apps) =>
					apps.map((app) =>
						app._id === id ? { ...app, status: newStatus } : app
					)
				);
				if (selectedApp?._id === id) {
					setSelectedApp({ ...selectedApp, status: newStatus });
				}
			}
		} catch (error) {
			console.error("Failed to update status", error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("আপনি কি নিশ্চিতভাবে এই আবেদনটি মুছে ফেলতে চান?")) {
			return;
		}

		try {
			const res = await fetch(`/api/admission/${id}`, {
				method: "DELETE",
			});
			const json = await res.json();
			if (json.success) {
				setApplications((apps) => apps.filter((app) => app._id !== id));
				setSelectedApp(null);
				toast.success("আবেদনটি সফলভাবে মুছে ফেলা হয়েছে");
			} else {
				toast.error(json.message || "মুছে ফেলতে ব্যর্থ হয়েছে");
			}
		} catch (error) {
			console.error("Failed to delete application", error);
			toast.error("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন");
		}
	};

	const exportToExcel = () => {
		const excelData = applications.map((app) => ({
			"নাম (বাংলা)": app.nameBangla,
			"নাম (ইংরেজি)": app.nameEnglish,
			"পিতার নাম": app.fatherName,
			"মাতার নাম": app.motherName,
			"বর্তমান ঠিকানা": app.presentAddress,
			"স্থায়ী ঠিকানা": app.permanentAddress,
			"পূর্ববর্তী মাদরাসা": app.exMadrasa,
			"শেষ শ্রেণী": app.lastClass,
			"ভর্তির শ্রেণী": app.admissionClass,
			বিভাগ: app.admissionDepartment,
			"অভিভাবকের নাম": app.guardianName,
			"অভিভাবকের ফোন": app.guardianPhone,
			সম্পর্ক: app.guardianRelation,
			স্ট্যাটাস: getStatusLabel(app.status),
			"আবেদন তারিখ": new Date(app.createdAt).toLocaleDateString("bn-BD"),
		}));

		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(excelData);
		XLSX.utils.book_append_sheet(wb, ws, "ভর্তি আবেদনসমূহ");
		const filename = `ভর্তি_আবেদনসমূহ_${
			new Date().toISOString().split("T")[0]
		}.xlsx`;
		XLSX.writeFile(wb, filename);
	};

	if (loading)
		return <div className="p-8 text-center text-gray-500">লোড হচ্ছে...</div>;

	return (
		<div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-medium text-gray-900 dark:text-white">
					ভর্তি আবেদনসমূহ ({applications.length})
				</h2>
				<div className="flex gap-2">
					<Button
						onClick={fetchApplications}
						variant="outline"
						size="sm"
						className="mr-2"
					>
						🔄 রিফ্রেশ
					</Button>
					<Button onClick={exportToExcel} variant="outline" size="sm">
						📊 এক্সেল এক্সপোর্ট
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
					<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
						{applications.length}
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						মোট আবেদন
					</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
					<div className="text-2xl font-bold text-green-600 dark:text-green-400">
						{applications.filter((a) => a.status === "accepted").length}
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						অনুমোদিত
					</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
					<div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
						{applications.filter((a) => a.status === "pending").length}
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						পেন্ডিং
					</div>
				</div>
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
					<div className="text-2xl font-bold text-red-600 dark:text-red-400">
						{applications.filter((a) => a.status === "rejected").length}
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						প্রত্যাখ্যাত
					</div>
				</div>
			</div>

			{/* Applications Table */}
			<div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-900">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									ছাত্র/ছাত্রী
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									শ্রেণী/বিভাগ
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									অভিভাবক ও ফোন
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									স্ট্যাটাস
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									তারিখ
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									অ্যাকশন
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{applications.map((app) => (
								<tr
									key={app._id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-10 w-10">
												<img
													className="h-10 w-10 rounded-full object-cover border dark:border-gray-600"
													src={app.photo || "/api/placeholder/150/200"}
													alt={app.nameBangla}
												/>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900 dark:text-white">
													{app.nameBangla}
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													{app.nameEnglish}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
										<div>{app.admissionClass}</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											{app.admissionDepartment}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
										<div>{app.guardianName}</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{app.guardianPhone}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
												app.status
											)}`}
										>
											{getStatusLabel(app.status)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
										{new Date(app.createdAt).toLocaleDateString("bn-BD")}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<Button
											onClick={() => setSelectedApp(app)}
											size="sm"
											variant="outline"
											className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/30"
										>
											বিস্তারিত
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{applications.length === 0 && (
					<div className="text-center py-10 text-gray-500 dark:text-gray-400">
						কোন আবেদন পাওয়া যায়নি।
					</div>
				)}
			</div>

			{/* Application Detail Modal */}
			{selectedApp && (
				<div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 flex justify-between items-center z-10">
							<h3 className="text-xl font-bold dark:text-white">
								আবেদনকারীর বিস্তারিত তথ্য
							</h3>
							<button
								onClick={() => setSelectedApp(null)}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-2xl"
							>
								✕
							</button>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{/* Left column: Photo & Status */}
								<div className="space-y-6">
									<div className="rounded-lg overflow-hidden border-2 border-emerald-100 dark:border-emerald-900 bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-[300px] max-h-[400px]">
										<img
											src={selectedApp.photo || "/api/placeholder/300/400"}
											alt={selectedApp.nameBangla}
											className="w-full h-full object-contain"
										/>
									</div>
									<div className="space-y-2">
										<Label className="dark:text-gray-300">
											আবেদন স্ট্যাটাস পরিবর্তন করুন
										</Label>
										<Select
											value={selectedApp.status}
											onValueChange={(val) =>
												handleStatusChange(selectedApp._id, val)
											}
										>
											<SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="dark:bg-gray-700 dark:text-white">
												<SelectItem value="pending">পেন্ডিং</SelectItem>
												<SelectItem value="reviewing">রিভিউ</SelectItem>
												<SelectItem value="accepted">অনুমোদিত</SelectItem>
												<SelectItem value="rejected">প্রত্যাখ্যাত</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Right columns: Info */}
								<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
									<InfoField
										label="নাম (বাংলা)"
										value={selectedApp.nameBangla}
									/>
									<InfoField
										label="নাম (ইংরেজি)"
										value={selectedApp.nameEnglish}
									/>
									<InfoField label="পিতার নাম" value={selectedApp.fatherName} />
									<InfoField label="মাতার নাম" value={selectedApp.motherName} />
									<InfoField
										label="বর্তমান ঠিকানা"
										value={selectedApp.presentAddress}
										fullWidth
									/>
									<InfoField
										label="স্থায়ী ঠিকানা"
										value={selectedApp.permanentAddress}
										fullWidth
									/>
									<InfoField
										label="পূর্ববর্তী মাদরাস"
										value={selectedApp.exMadrasa || "নাই"}
									/>
									<InfoField
										label="শেষ শ্রেণী"
										value={selectedApp.lastClass || "নাই"}
									/>
									<InfoField
										label="ভর্তির শ্রেণী"
										value={selectedApp.admissionClass}
									/>
									<InfoField
										label="বিভাগ"
										value={selectedApp.admissionDepartment}
									/>
									<InfoField
										label="অভিভাবকের নাম"
										value={selectedApp.guardianName}
									/>
									<InfoField
										label="সম্পর্ক"
										value={selectedApp.guardianRelation}
									/>
									<InfoField
										label="ফোন নম্বর"
										value={selectedApp.guardianPhone}
									/>
									<div className="md:col-span-2">
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
											আবেদন তারিখ
										</p>
										<p className="font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-1">
											{new Date(selectedApp.createdAt).toLocaleString("bn-BD")}
										</p>
									</div>
									{selectedApp.notes && (
										<InfoField
											label="নোট"
											value={selectedApp.notes}
											fullWidth
										/>
									)}
								</div>
							</div>
						</div>
						<div className="p-6 border-t dark:border-gray-700 flex justify-between items-center">
							<Button
								onClick={() => handleDelete(selectedApp._id)}
								variant="destructive"
								className="bg-red-600 hover:bg-red-700 text-white"
							>
								<Trash2 className="w-4 h-4 mr-2" />
								আবেদন মুছুন
							</Button>
							<Button
								onClick={() => setSelectedApp(null)}
								className="dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-700"
							>
								বন্ধ করুন
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
