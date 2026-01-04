import dbConnect from "../db";
import AdmissionPage from "../models/AdmissionPage";

export interface AdmissionPageData {
	header: {
		title: string;
		subtitle: string;
	};
	infoCards: Array<{
		icon: string;
		title: string;
		subtitle: string;
	}>;
	schedule: {
		online: {
			title: string;
			start: string;
			end: string;
			status: string;
		};
		exam: {
			title: string;
			date: string;
			time: string;
			location: string;
		};
	};
	classes: Array<{
		department: string;
		class: string;
		duration: string;
		fees: string;
		capacity: string;
	}>;
	requirements: string[];
	faq: Array<{
		q: string;
		a: string;
	}>;
	cta: {
		title: string;
		address: string;
		phone: string;
		email: string;
		buttonText: string;
	};
}

export async function getAdmissionPageData(): Promise<AdmissionPageData | null> {
	await dbConnect();
	const admission = await AdmissionPage.findOne().lean();

	if (!admission) {
		return null;
	}

	return {
		header: admission.header,
		infoCards: admission.infoCards,
		schedule: admission.schedule,
		classes: admission.classes,
		requirements: admission.requirements,
		faq: admission.faq,
		cta: admission.cta,
	};
}
