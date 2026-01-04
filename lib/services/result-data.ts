import dbConnect from "@/lib/db";
import Result from "@/lib/models/Result";

export interface ResultOptions {
	terms: string[];
	departments: string[];
	classes: string[];
	years: string[];
	rolls: string[];
}

export async function getResultOptions(): Promise<ResultOptions> {
	await dbConnect();

	const [terms, departments, classes, years, rolls] = await Promise.all([
		Result.distinct("term", { isActive: true }),
		Result.distinct("department", { isActive: true }),
		Result.distinct("class", { isActive: true }),
		Result.distinct("examYear", { isActive: true }),
		Result.distinct("roll", { isActive: true }),
	]);

	return {
		terms: terms.sort(),
		departments: departments.sort(),
		classes: classes.sort(),
		years: years.sort(),
		rolls: rolls.sort((a, b: any) => Number(a) - Number(b)),
	};
}
