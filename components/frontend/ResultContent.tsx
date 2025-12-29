import { useState, useEffect } from "react";
import {
	Download,
	Search,
	ChevronDown,
	Calendar,
	User,
	Award,
	BookOpen,
} from "lucide-react";
import type { StudentResult } from "../../types/frontend";
import { toast } from "sonner";
import { env } from "../../lib/frontend/env";

const ResultContent: React.FC = () => {
	const [selectedTerm, setSelectedTerm] = useState<string>("");
	const [selectedDivision, setSelectedDivision] = useState<string>("");
	const [selectedClass, setSelectedClass] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [selectedRoll, setSelectedRoll] = useState<string>("");
	const [showResult, setShowResult] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [options, setOptions] = useState<{
		terms: string[];
		divisions: string[];
		classes: string[];
		years: string[];
		rolls: string[];
	}>({
		terms: [],
		divisions: [],
		classes: [],
		years: [],
		rolls: [],
	});
	const [resultData, setResultData] = useState<StudentResult | null>(null);

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const res = await fetch(`${env.apiUrl}/api/results/options`);
				const json = await res.json();
				if (json.success) {
					setOptions(json.data);
				}
			} catch (err) {
				console.error("Failed to fetch result options", err);
			}
		};
		fetchOptions();
	}, []);

	const handleSearch = async (e: any) => {
		e.preventDefault();
		if (
			!selectedYear ||
			!selectedTerm ||
			!selectedDivision ||
			!selectedClass ||
			!selectedRoll
		) {
			toast.error(
				"অনুগ্রহ করে বছর, পরীক্ষা, বিভাগ, শ্রেণী এবং রোল নম্বর টাইপ বা নির্বাচন করুন"
			);
			return;
		}
		setLoading(true);
		setShowResult(false);
		try {
			const params = new URLSearchParams({
				year: selectedYear,
				term: selectedTerm,
				division: selectedDivision,
				class: selectedClass,
				roll: selectedRoll,
			});
			const res = await fetch(`${env.apiUrl}/api/results?${params.toString()}`);
			const json = await res.json();
			if (json.success) {
				setResultData(json.data);
				setShowResult(true);
			} else {
				toast.error(json.message || "ফলাফল পাওয়া যায়নি");
			}
		} catch (err) {
			console.error("Search error:", err);
			toast.error("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন");
		} finally {
			setLoading(false);
		}
	};

	const downloadPDF = (): void => {
		if (!resultData) return;
		const printWindow = window.open("", "", "height=800,width=800");

		if (!printWindow) {
			toast.warning("পপআপ ব্লকার অক্ষম করুন এবং পুনরায় চেষ্টা করুন");
			return;
		}

		const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>পরীক্ষার ফলাফল</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #059669; padding-bottom: 15px; }
          .school-name { font-size: 24px; font-weight: bold; color: #059669; }
          .school-motto { font-size: 12px; color: #666; margin-top: 5px; }
          .student-info { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .info-item { font-size: 14px; flex: 1; }
          .info-label { font-weight: bold; color: #059669; }
          .subjects-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .subjects-table th, .subjects-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
          .subjects-table th { background-color: #059669; color: white; }
          .subjects-table tr:nth-child(even) { background-color: #f0f0f0; }
          .summary { margin: 30px 0; padding: 15px; background-color: #f0fdf4; border-left: 4px solid #059669; }
          .summary-item { display: flex; justify-content: space-between; margin: 10px 0; font-size: 14px; }
          .summary-label { font-weight: bold; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
          .signature { margin-top: 30px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">মারকাজুত তাহফীজ</div>
          <div class="school-motto">আন্তর্জাতিক হিফজ শিক্ষা প্রতিষ্ঠান</div>
          <div style="margin-top: 10px; font-size: 14px;">পরীক্ষার ফলাফল</div>
        </div>

        <div class="student-info">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">শিক্ষার্থী নাম:</span>
              <span>${resultData.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">রোল নম্বর:</span>
              <span>${resultData.roll}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">বিভাগ:</span>
              <span>${resultData.division}</span>
            </div>
            <div class="info-item">
              <span class="info-label">শ্রেণী:</span>
              <span>${resultData.class}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">পরীক্ষা:</span>
              <span>${resultData.term}</span>
            </div>
            <div class="info-item">
              <span class="info-label">বছর:</span>
              <span>${resultData.examYear || ""}</span>
            </div>
          </div>
        </div>

        <table class="subjects-table">
          <tr>
            <th>বিষয়</th>
            <th>প্রাপ্ত নম্বর</th>
            <th>মোট নম্বর</th>
            <th>শতাংশ</th>
          </tr>
          ${resultData.subjects
						.map(
							(subject: any) => `
            <tr>
              <td style="text-align: left;">${subject.name}</td>
              <td>${subject.marks}</td>
              <td>${subject.total}</td>
              <td>${((subject.marks / subject.total) * 100).toFixed(1)}%</td>
            </tr>
          `
						)
						.join("")}
        </table>

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">সম্মিলিত ফলাফল:</span>
            <span>${resultData.totalMarks}/100</span>
          </div>
        </div>

        <div class="footer">
          <div class="info-item">
            <span class="info-label">পরীক্ষার তারিখ:</span>
            <span>${resultData.examDate}</span>
          </div>
          <div class="info-item" style="margin-top: 5px;">
            <span class="info-label">ফলাফল প্রকাশের তারিখ:</span>
            <span>${resultData.resultDate}</span>
          </div>
          <div class="signature">
            <div style="margin-bottom: 40px;">প্রধানের স্বাক্ষর</div>
            <div>${resultData.principal}</div>
          </div>
        </div>
      </body>
      </html>
    `;

		printWindow.document.write(htmlContent);
		printWindow.document.close();
		setTimeout(() => {
			printWindow.print();
		}, 250);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="flex max-h-26 max-w-26 overflow-hidden mx-auto rounded-full justify-center mb-4">
							<img
								src="logo.avif"
								loading="lazy"
								className="w-26 h-26"
								alt="logo"
							/>
						</div>
					</div>
					<h1 className="text-4xl font-bold text-emerald-900 mb-2">
						মারকাজুত তাহফীজ
					</h1>
					<p className="text-gray-600">পরীক্ষার ফলাফল</p>
				</div>

				{/* Search Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						ফলাফল খুঁজুন
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
						{/* Year Input */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<Calendar className="inline h-4 w-4 mr-2 text-emerald-600" />
								বছর লিখুন
							</label>
							<div className="relative">
								<input
									type="text"
									placeholder="যেমন: ২০২৫"
									value={selectedYear}
									onChange={(e) => setSelectedYear(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
								/>
							</div>
						</div>
						{/* Term Select */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<Calendar className="inline h-4 w-4 mr-2 text-emerald-600" />
								পরীক্ষা নির্বাচন করুন
							</label>
							<div className="relative">
								<select
									value={selectedTerm}
									onChange={(e) => setSelectedTerm(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white cursor-pointer"
								>
									<option value="">-- পরীক্ষা বেছে নিন --</option>
									{options.terms.map((term: string) => (
										<option key={term} value={term}>
											{term}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
							</div>
						</div>

						{/* Division Select */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<BookOpen className="inline h-4 w-4 mr-2 text-emerald-600" />
								বিভাগ নির্বাচন করুন
							</label>
							<div className="relative">
								<select
									value={selectedDivision}
									onChange={(e) => setSelectedDivision(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white cursor-pointer"
								>
									<option value="">-- বিভাগ বেছে নিন --</option>
									{options.divisions.map((division: string) => (
										<option key={division} value={division}>
											{division}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
						{/* Class Select */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<BookOpen className="inline h-4 w-4 mr-2 text-emerald-600" />
								শ্রেণী নির্বাচন করুন
							</label>
							<div className="relative">
								<select
									value={selectedClass}
									onChange={(e) => setSelectedClass(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white cursor-pointer"
								>
									<option value="">-- শ্রেণী বেছে নিন --</option>
									{options.classes.map((cls: string) => (
										<option key={cls} value={cls}>
											{cls}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
							</div>
						</div>

						{/* Roll Select */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<User className="inline h-4 w-4 mr-2 text-emerald-600" />
								রোল নম্বর নির্বাচন করুন
							</label>
							<div className="relative">
								<input
									list="roll-suggestions"
									type="text"
									placeholder="রোল নম্বর লিখুন"
									value={selectedRoll}
									onChange={(e) => setSelectedRoll(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
								/>
								<datalist id="roll-suggestions">
									{options.rolls?.map((roll: string) => (
										<option key={roll} value={roll} />
									))}
								</datalist>
							</div>
						</div>
					</div>

					{/* Search Button */}
					<button
						onClick={handleSearch}
						disabled={loading}
						className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
					>
						<Search className="h-5 w-5" />
						{loading ? "খুঁজছি..." : "ফলাফল খুঁজুন"}
					</button>
				</div>

				{/* Result Card */}
				{showResult && resultData && (
					<div
						id="result-content"
						className="bg-white rounded-2xl shadow-xl p-8"
					>
						{/* Result Header */}
						<div className="text-center mb-8 pb-8 border-b-2 border-emerald-200">
							<h2 className="text-3xl font-bold text-emerald-900 mb-4">
								পরীক্ষার ফলাফল
							</h2>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
								<div className="bg-emerald-50 rounded-lg p-4">
									<p className="text-sm text-gray-600 mb-1">শিক্ষার্থীর নাম</p>
									<p className="text-lg font-bold text-emerald-900">
										{resultData.name}
									</p>
								</div>
								<div className="bg-emerald-50 rounded-lg p-4">
									<p className="text-sm text-gray-600 mb-1">রোল নম্বর</p>
									<p className="text-lg font-bold text-emerald-900">
										{resultData.roll}
									</p>
								</div>
								<div className="bg-emerald-50 rounded-lg p-4">
									<p className="text-sm text-gray-600 mb-1">বিভাগ</p>
									<p className="text-lg font-bold text-emerald-900">
										{resultData.division}
									</p>
								</div>
								<div className="bg-emerald-50 rounded-lg p-4">
									<p className="text-sm text-gray-600 mb-1">শ্রেণী</p>
									<p className="text-lg font-bold text-emerald-900">
										{resultData.class}
									</p>
								</div>
								<div className="bg-emerald-50 rounded-lg p-4">
									<p className="text-sm text-gray-600 mb-1">পরীক্ষা</p>
									<p className="text-lg font-bold text-emerald-900">
										{resultData.term}
									</p>
								</div>
								<div className="bg-emerald-50 rounded-lg p-4">
									<p className="text-sm text-gray-600 mb-1">বছর</p>
									<p className="text-lg font-bold text-emerald-900">
										{resultData.examYear}
									</p>
								</div>
							</div>
						</div>

						{/* Subjects Table */}
						<div className="mb-8">
							<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
								<Award className="h-5 w-5 text-emerald-600" />
								বিষয়ভিত্তিক ফলাফল
							</h3>
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="bg-linear-to-r from-emerald-500 to-teal-600">
											<th className="border border-gray-300 px-4 py-3 text-white text-left">
												বিষয়
											</th>
											<th className="border border-gray-300 px-4 py-3 text-white text-center">
												প্রাপ্ত নম্বর
											</th>
											<th className="border border-gray-300 px-4 py-3 text-white text-center">
												মোট নম্বর
											</th>
											<th className="border border-gray-300 px-4 py-3 text-white text-center">
												শতাংশ
											</th>
										</tr>
									</thead>
									<tbody>
										{resultData.subjects.map((subject: any, idx: number) => (
											<tr
												key={idx}
												className={idx % 2 === 0 ? "bg-white" : "bg-emerald-50"}
											>
												<td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
													{subject.name}
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center font-bold text-emerald-600">
													{subject.marks}
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
													{subject.total}
												</td>
												<td className="border border-gray-300 px-4 py-3 text-center font-semibold text-teal-600">
													{((subject.marks / subject.total) * 100).toFixed(1)}%
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Summary Section */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
							<div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border-l-4 border-emerald-500">
								<p className="text-sm text-gray-600 mb-2">সম্মিলিত ফলাফল</p>
								<p className="text-3xl font-bold text-emerald-900">
									{resultData.totalMarks}/100
								</p>
							</div>
						</div>

						{/* Additional Info */}
						<div className="bg-gray-50 rounded-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-600">পরীক্ষার তারিখ</p>
								<p className="font-semibold text-gray-900">
									{resultData.examDate}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">ফলাফল প্রকাশের তারিখ</p>
								<p className="font-semibold text-gray-900">
									{resultData.resultDate}
								</p>
							</div>
						</div>

						{/* Download Button */}
						<button
							onClick={downloadPDF}
							className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 flex items-center justify-center gap-2"
						>
							<Download className="h-5 w-5" />
							পিডিএফ হিসাবে ডাউনলোড করুন
						</button>
					</div>
				)}

				{/* No Result Message */}
				{(!showResult || !resultData) && (
					<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
						<p className="text-gray-500 text-lg">
							ফলাফল খোঁজার জন্য বছর, পরীক্ষা, বিভাগ, শ্রেণী এবং রোল নম্বর
							নির্বাচন করুন
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ResultContent;
