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
		header: {
			title: admission.header?.title || "",
			subtitle: admission.header?.subtitle || "",
		},
		infoCards: (admission.infoCards || []).map((card: any) => ({
			icon: card.icon || "",
			title: card.title || "",
			subtitle: card.subtitle || "",
		})),
		schedule: {
			online: {
				title: admission.schedule?.online?.title || "",
				start: admission.schedule?.online?.start || "",
				end: admission.schedule?.online?.end || "",
				status: admission.schedule?.online?.status || "",
			},
			exam: {
				title: admission.schedule?.exam?.title || "",
				date: admission.schedule?.exam?.date || "",
				time: admission.schedule?.exam?.time || "",
				location: admission.schedule?.exam?.location || "",
			},
		},
		classes: (admission.classes || []).map((c: any) => ({
			department: c.department || "",
			class: c.class || "",
			duration: c.duration || "",
			fees: c.fees || "",
			capacity: c.capacity || "",
		})),
		requirements: admission.requirements || [],
		faq: (admission.faq || []).map((f: any) => ({
			q: f.q || "",
			a: f.a || "",
		})),
		cta: {
			title: admission.cta?.title || "",
			address: admission.cta?.address || "",
			phone: admission.cta?.phone || "",
			email: admission.cta?.email || "",
			buttonText: admission.cta?.buttonText || "",
		},
	};
}
