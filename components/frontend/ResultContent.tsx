"use client";

import { useState } from "react";
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
import { ResultOptions } from "@/lib/services/result-data";

interface ResultContentProps {
	initialOptions: ResultOptions;
}

const ResultContent: React.FC<ResultContentProps> = ({ initialOptions }) => {
	const [selectedTerm, setSelectedTerm] = useState<string>("");
	const [selectedDepartment, setSelectedDepartment] = useState<string>("");
	const [selectedClass, setSelectedClass] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [selectedRoll, setSelectedRoll] = useState<string>("");
	const [showResult, setShowResult] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [options] = useState<ResultOptions>(initialOptions);
	const [resultData, setResultData] = useState<StudentResult | null>(null);
	const [totalPossibleMarks, setTotalPossibleMarks] = useState<number>(0);

	const handleSearch = async (e: any) => {
		e.preventDefault();
		if (
			!selectedYear ||
			!selectedTerm ||
			!selectedDepartment ||
			!selectedClass ||
			!selectedRoll
		) {
			toast.error(
				"অনুগ্রহ করে বছর, পরীক্ষা, বিভাগ, শ্রেণী এবং রোল নম্বর টাইপ বা নির্বাচন করুন",
			);
			return;
		}
		setLoading(true);
		setShowResult(false);
		try {
			const params = new URLSearchParams({
				year: selectedYear,
				term: selectedTerm,
				department: selectedDepartment,
				class: selectedClass,
				roll: selectedRoll,
				status: "published",
			});
			// Using relative URL for production compatibility
			const res = await fetch(`/api/results?${params.toString()}`);
			const json = await res.json();
			if (json.success) {
				setResultData(json.data);
				const totalMarks = json.data.subjects.reduce(
					(sum: number, subject: any) => sum + subject.total,
					0,
				);
				setTotalPossibleMarks(totalMarks);
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

	const formatDate = (dateString?: string) => {
		if (!dateString) return "";
		const dateObj = new Date(dateString);
		if (isNaN(dateObj.getTime())) return "";
		return new Intl.DateTimeFormat("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}).format(dateObj);
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
          
          * { margin: 0; padding: 0; box-sizing: border-box; }

          @media print {
            @page { 
              size: A4 portrait;
              margin: 0; 
            }
            body { 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important;
              width: 100%;
              height: 100vh;
              page-break-inside: avoid;
              margin: 0;
            }
            html {
              height: 100vh;
              overflow: hidden;
            }
            .body-wrapper {
              flex: 1;
              min-height: 0 !important;
              margin-bottom: 0 !important;
            }
            .footer {
              page-break-inside: avoid;
            }
          }

          html, body {
            min-height: 100vh;
            margin: 0;
            padding: 0;
            width: 100%;
          }

          body {
            font-family: "Noto Serif Bengali", serif;
            background: #fff;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
          }

          /* ====== HEADER ====== */
          .header {
            background: linear-gradient(135deg, #1a7a3c 0%, #0f5c2a 60%, #1a7a3c 100%);
            padding: 0;
            position: relative;
            border-bottom: 4px solid #c8a84b;
          }

          /* Top thin red stripe */
         

          .header-inner {
            display: flex;
            align-items: center;
            padding: 10px 16px 8px 16px;
            gap: 14px;
            position: relative;
          }

          /* Logo circle */
          .header-logo {
            width: 74px;
            height: 74px;
            
            background: #fff;
            border: 3px solid #c8a84b;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
          }

          .header-logo img {
            width: 58px;
            height: 58px;
          }

          .header-content {
            flex: 1;
            text-align: center;
          }

          /* "১০৩ টি দেশের..." tagline */
          .header-tagline {
            font-size: 10px;
            color: #f0e6a0;
            letter-spacing: 0.3px;
            margin-bottom: 3px;
            font-weight: 400;
          }

          /* Main Bengali name */
          .header-bn-name {
            font-size: 28px;
            font-weight: 600;
            color: #f5e96a;
            text-shadow: 1px 2px 4px rgba(0,0,0,0.4);
            line-height: 1.15;
            letter-spacing: 1px;
          }

          /* Arabic text */
          .header-arabic {
            font-size: 18px;
            color: #d4edba;
            direction: rtl;
            unicode-bidi: bidi-override;
            margin: 2px 0;
            letter-spacing: 1px;
          }

          /* English name */
          .header-en-name {
            font-size: 13px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 2px;
          }

          /* Phone numbers row */
          .header-phones {
            background: rgba(0,0,0,0.25);
            text-align: center;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 1px;
            border-top: 1px solid rgba(200,168,75,0.4);
          }

          /* "মিরপুর শাখা" badge — top right corner */
          .header-branch-badge {
            position: absolute;
            top: 10px;
            right: 16px;
            background: #c8a84b;
            color: #1a1a1a;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 3px;
            border: 1px solid #a07830;
            white-space: nowrap;
          }

          /* Divider line under Arabic row (green section) */
          .header-divider {
            height: 3px;
            background: linear-gradient(to right, #c8a84b, #f5e96a, #c8a84b);
          }

          /* ====== BODY ====== */
          .body-wrapper {
            padding: 20px 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .result-title {
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            color: #0f5c2a;
            margin-bottom: 18px;
            border-bottom: 2px solid #0f5c2a;
            padding-bottom: 6px;
            letter-spacing: 0.5px;
          }

          .student-info {
            margin: 16px 0;
            border: 1px solid #c8e6c9;
            border-radius: 6px;
            overflow: hidden;
          }

          .info-row {
            display: flex;
            border-bottom: 1px solid #e8f5e9;
          }

          .info-row:last-child { border-bottom: none; }

          .info-item {
            flex: 1;
            padding: 7px 12px;
            font-size: 13px;
            border-right: 1px solid #e8f5e9;
          }

          .info-item:last-child { border-right: none; }

          .info-item:nth-child(odd) { background: #f1faf4; }
          .info-item:nth-child(even) { background: #ffffff; }

          .info-label {
            font-weight: 700;
            color: #0f5c2a;
            margin-right: 4px;
          }

          .subjects-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
          }

          .subjects-table th {
            background: linear-gradient(135deg, #1a7a3c, #0f5c2a);
            color: #ffffff;
            padding: 9px 10px;
            text-align: center;
            font-weight: 700;
            border: 1px solid #0d4d24;
          }

          .subjects-table td {
            border: 1px solid #c8e6c9;
            padding: 8px 10px;
            text-align: center;
          }

          .subjects-table tr:nth-child(even) td { background-color: #f1faf4; }
          .subjects-table tr:nth-child(odd) td  { background-color: #ffffff; }

          .subjects-table td:first-child { text-align: left; font-weight: 600; }

          .summary-box {
            background: #f1faf4;
            border: 1px solid #a5d6a7;
            border-left: 5px solid #1a7a3c;
            border-radius: 4px;
            padding: 12px 16px;
            margin: 10px 0 20px 0;
          }

          .summary-item {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin: 5px 0;
          }

          .summary-label { font-weight: 700; color: #0f5c2a; }

          .signature-area {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
            padding-top: 10px;
          }

          .signature-box {
            text-align: center;
            font-size: 12px;
            position: relative;
          }

          .signature-image{
            width: 200px;
            height:200px;
            object-fit: cover;
            display: flex;
            align-items:center;
            justify-content:center;
            position: absolute;
            top: -100px;
            left: 0;
          }
          .signature-image img{
            width: 100%;
            height:100%;
          }

          .signature-line {
            width: 160px;
            border-top: 1px solid #333;
            margin: 30px auto 4px auto;
          }

          /* ====== FOOTER ====== */
          .footer {
            background: linear-gradient(135deg, #1a7a3c 0%, #0f5c2a 100%);
            padding: 8px 16px;
            margin-top: auto;
            border-top: 3px solid #c8a84b;
          }

          .footer-inner {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
          }

          .footer-branch {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            flex: 1;
          }

          .footer-branch-icon {
            font-size: 14px;
            margin-top: 2px;
            flex-shrink: 0;
          }

          .footer-branch-text {
            font-size: 10px;
            color: #d4f5df;
            line-height: 1.6;
          }

          .footer-branch-text strong {
            color: #f5e96a;
            font-size: 10.5px;
          }

          .footer-divider-v {
            width: 1px;
            background: rgba(200,168,75,0.5);
            align-self: stretch;
            min-height: 30px;
          }

          /* Top stripe of footer */
          .footer-top-stripe {
            background: #cc2222;
            height: 3px;
            width: 100%;
            margin-bottom: 1px;
          }
        </style>
      </head>
      <body>

        <!-- ===== HEADER ===== -->
        <div class="header">
          
          <div class="header-inner">
            <!-- Logo -->
            <div class="header-logo">
              <img src="logo.avif" alt="logo" />
        
            </div>

            <!-- Center text content -->
            <div class="header-content">
              <div class="header-tagline">১০৩ টি দেশের মধ্যে কুরআন প্রতিযোগিতায় বিশ্বসেরা হিফজ মাদরাসা</div>
              <div class="header-bn-name">মারকাজুত তাহফিজ ইন্টা. মাদরাসা</div>
              <div class="header-arabic">مـركـز الـتـحـفـيـظ انترنـاشـيـونـال</div>
              <div class="header-en-name">MARKAZUT TAHFIZ INT. MADRASHA</div>
            </div>

            <!-- Branch badge -->
            <div class="header-branch-badge">মিরপুর শাখা</div>
          </div>

          <!-- Phone numbers -->
          <div class="header-phones">
            01943-834216, 01629-238535, 01677-272255, 01982-233298
          </div>

          <div class="header-divider"></div>
        </div>

        <!-- ===== BODY ===== -->
        <div class="body-wrapper">
          <div class="result-title">পরীক্ষার ফলাফল</div>

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
                <span>${resultData.department}</span>
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
              <th>শতকরা</th>
            </tr>
            ${resultData.subjects
							.map(
								(subject) => `
              <tr>
                <td>${subject.name}</td>
                <td>${subject.marks}</td>
                <td>${subject.total}</td>
                <td>${((subject.marks / subject.total) * 100).toFixed(1)}%</td>
              </tr>
            `,
							)
							.join("")}
          </table>

          <div style="display: flex; gap: 12px; margin: 10px 0 20px 0;">
            <div class="summary-box" style="flex: 1; margin: 0; padding: 12px 10px;">
              <div class="summary-item" style="margin: 0; align-items: center;">
                <span class="summary-label">সম্মিলিত ফলাফল:</span>
                <span>${resultData.totalMarks}/${totalPossibleMarks}</span>
              </div>
            </div>

            <div class="summary-box" style="flex: 1; margin: 0; padding: 12px 10px;">
              <div class="summary-item" style="margin: 0; align-items: center;">
                <span class="summary-label">গড়:</span>
                <span>${((resultData.subjects.reduce((sum, subject) => sum + subject.marks / subject.total, 0) / resultData.subjects.length) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div class="summary-box" style="flex: 1; margin: 0; padding: 12px 10px;">
              <div class="summary-item" style="margin: 0; align-items: center;">
                <span class="summary-label">গ্রেড:</span>
                <span>${(() => {
									const percentage =
										(resultData.totalMarks / totalPossibleMarks) * 100;
									if (percentage >= 80) return "মুমতাজ ";
									if (percentage >= 65) return "জায়্যিদ জিদ্দান ";
									if (percentage >= 50) return "জায়্যিদ";
									if (percentage >= 33) return "মাকবুল ";
									return "রাসিব";
								})()}</span>
              </div>
            </div>
          </div>

          <div style="margin-top: auto;">
            <div style="font-size: 13px; color: #444; margin-top: 8px;">
              <div><span style="font-weight:700; color:#0f5c2a;">পরীক্ষার তারিখ:</span> ${formatDate(resultData.examDate)}</div>
              <div style="margin-top:4px;"><span style="font-weight:700; color:#0f5c2a;">ফলাফল প্রকাশের তারিখ:</span> ${formatDate(resultData.resultDate)}</div>
            </div>

            <div class="signature-area">
              <div class="signature-box">
                <div class="signature-image">
                <img src="sign.png" alt="sign"/>
                </div>
                <div class="signature-line"></div>
                <div style="font-size:12px; color:#333;">প্রধানের স্বাক্ষর</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== FOOTER ===== -->
        <div class="footer">
          <div class="footer-top-stripe"></div>
          <div class="footer-inner">
            <div class="footer-branch">
              <div class="footer-branch-icon">🏠</div>
              <div class="footer-branch-text">
                <strong>ঝুটপট্টি শাখা:</strong> বাড়ী-১০, এটি.-১, হক-সি, সেকশন-১০, মিরপুর।
              </div>
            </div>

            <div class="footer-divider-v"></div>

            <div class="footer-branch">
              <div class="footer-branch-icon">🏠</div>
              <div class="footer-branch-text">
                <strong>সেনপাড়া পর্বতা শাখা:</strong> বাণিজ্যিক প্লট- ৩০, মেইন রোড-১, সেকশন-১০, সেনপাড়া পর্বতা, মিরপুর।
              </div>
            </div>
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
						<div className="flex max-h-32 max-w-32 mx-auto justify-center mb-4">
							<img
								src="logo.avif"
								loading="lazy"
								className="w-32 h-32"
								alt="logo"
							/>
						</div>
					</div>
					<h1 className="text-3xl lg:text-4xl font-bold text-emerald-900 mb-2">
						মারকাজুত তাহফিজ
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

						{/* Department Select */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								<BookOpen className="inline h-4 w-4 mr-2 text-emerald-600" />
								বিভাগ নির্বাচন করুন
							</label>
							<div className="relative">
								<select
									value={selectedDepartment}
									onChange={(e) => setSelectedDepartment(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white cursor-pointer"
								>
									<option value="">-- বিভাগ বেছে নিন --</option>
									{options.departments.map((dept: string) => (
										<option key={dept} value={dept}>
											{dept}
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
										{resultData.department}
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
									{resultData.totalMarks}/{totalPossibleMarks}
								</p>
							</div>

							<div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border-l-4 border-emerald-500">
								<p className="text-sm text-gray-600 mb-2">গড়</p>
								<p className="text-3xl font-bold text-emerald-900">
									{(
										(resultData.subjects.reduce(
											(sum: number, subject: any) =>
												sum + subject.marks / subject.total,
											0,
										) /
											resultData.subjects.length) *
										100
									).toFixed(2)}
									%
								</p>
							</div>

							<div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border-l-4 border-emerald-500">
								<p className="text-sm text-gray-600 mb-2">গ্রেড</p>
								<p className="text-3xl font-bold text-emerald-900">
									{(() => {
										const percentage =
											(resultData.totalMarks / totalPossibleMarks) * 100;
										if (percentage >= 80) return "মুমতাজ ";
										if (percentage >= 65) return "জায়্যিদ জিদ্দান ";
										if (percentage >= 50) return "জায়্যিদ";
										if (percentage >= 33) return "মাকবুল ";

										return "রাসিব";
									})()}
								</p>
							</div>
						</div>

						{/* Additional Info */}
						<div className="bg-gray-50 rounded-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-600">পরীক্ষার তারিখ</p>
								<p className="font-semibold text-gray-900">
									{formatDate(resultData.examDate)}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">ফলাফল প্রকাশের তারিখ</p>
								<p className="font-semibold text-gray-900">
									{formatDate(resultData.resultDate)}
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
