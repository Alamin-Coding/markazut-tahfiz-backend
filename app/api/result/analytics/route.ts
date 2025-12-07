import { NextRequest, NextResponse } from "next/server";
import Result from "@/lib/models/Result";
import dbConnect from "@/lib/db";

// GET /api/result/analytics - Get analytics data for results
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const term = searchParams.get("term");

		// Build filter object
		const filter: Record<string, unknown> = { isActive: true };
		if (term) filter.term = term;

		// Get all results
		const results = await Result.find(filter);

		// Calculate analytics
		const totalResults = results.length;
		const uniqueStudents = new Set(results.map((r) => `${r.roll}-${r.term}`))
			.size;
		const uniqueTerms = new Set(results.map((r) => r.term)).size;
		const uniqueDivisions = new Set(results.map((r) => r.division)).size;
		const uniqueClasses = new Set(results.map((r) => r.class)).size;

		// Calculate average marks
		const totalMarksSum = results.reduce((sum, r) => sum + r.totalMarks, 0);
		const averageMarks = totalResults > 0 ? totalMarksSum / totalResults : 0;

		// Subject-wise performance
		const subjectPerformance: {
			[key: string]: { total: number; count: number };
		} = {};

		results.forEach((result) => {
			result.subjects.forEach(
				(subject: { name: string; marks: number; total: number }) => {
					if (!subjectPerformance[subject.name]) {
						subjectPerformance[subject.name] = { total: 0, count: 0 };
					}
					subjectPerformance[subject.name].total += subject.marks;
					subjectPerformance[subject.name].count += 1;
				}
			);
		});

		const subjectPerformanceData = Object.entries(subjectPerformance).map(
			([subject, data]) => ({
				subject,
				average: data.count > 0 ? data.total / data.count : 0,
			})
		);

		// Grade distribution
		const gradeDistribution = {
			"A+": results.filter((r) => r.totalMarks >= 90).length,
			A: results.filter((r) => r.totalMarks >= 80 && r.totalMarks < 90).length,
			B: results.filter((r) => r.totalMarks >= 70 && r.totalMarks < 80).length,
			C: results.filter((r) => r.totalMarks >= 60 && r.totalMarks < 70).length,
			D: results.filter((r) => r.totalMarks >= 50 && r.totalMarks < 60).length,
			F: results.filter((r) => r.totalMarks < 50).length,
		};

		// Division-wise performance
		const divisionPerformance = results.reduce(
			(acc: Record<string, { total: number; count: number }>, result) => {
				if (!acc[result.division]) {
					acc[result.division] = { total: 0, count: 0 };
				}
				acc[result.division].total += result.totalMarks;
				acc[result.division].count += 1;
				return acc;
			},
			{}
		);

		const divisionPerformanceData = Object.entries(divisionPerformance).map(
			([division, data]) => ({
				division,
				average: data.count > 0 ? data.total / data.count : 0,
			})
		);

		// Class-wise performance
		const classPerformance = results.reduce(
			(acc: Record<string, { total: number; count: number }>, result) => {
				if (!acc[result.class]) {
					acc[result.class] = { total: 0, count: 0 };
				}
				acc[result.class].total += result.totalMarks;
				acc[result.class].count += 1;
				return acc;
			},
			{}
		);

		const classPerformanceData = Object.entries(classPerformance).map(
			([className, data]) => ({
				class: className,
				average: data.count > 0 ? data.total / data.count : 0,
			})
		);

		// Term-wise trends (assuming terms are ordered)
		const termTrends = results.reduce(
			(acc: Record<string, { total: number; count: number }>, result) => {
				if (!acc[result.term]) {
					acc[result.term] = { total: 0, count: 0 };
				}
				acc[result.term].total += result.totalMarks;
				acc[result.term].count += 1;
				return acc;
			},
			{}
		);

		const termTrendsData = Object.entries(termTrends).map(([term, data]) => ({
			term,
			average: data.count > 0 ? data.total / data.count : 0,
		}));

		return NextResponse.json({
			success: true,
			data: {
				overview: {
					totalResults,
					uniqueStudents,
					uniqueTerms,
					uniqueDivisions,
					uniqueClasses,
					averageMarks: Math.round(averageMarks * 100) / 100,
				},
				subjectPerformance: subjectPerformanceData,
				gradeDistribution,
				divisionPerformance: divisionPerformanceData,
				classPerformance: classPerformanceData,
				termTrends: termTrendsData,
			},
		});
	} catch (error) {
		console.error("Error fetching analytics:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch analytics",
			},
			{ status: 500 }
		);
	}
}
