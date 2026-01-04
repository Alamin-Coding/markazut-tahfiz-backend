import dbConnect from "../db";
import About from "../models/About";

export interface AboutPageData {
	hero: {
		title: string;
		subtitle: string;
		backgroundImage: string;
	};
	mission: {
		title: string;
		content: string;
	};
	vision: {
		title: string;
		content: string;
	};
	history: {
		title: string;
		paragraphs: string[];
	};
	features: Array<{
		title: string;
		description: string;
		icon: string;
	}>;
	achievements: Array<{
		title: string;
		description: string;
	}>;
	programs: Array<{
		title: string;
		duration: string;
		description: string;
	}>;
	values: Array<{
		title: string;
		description: string;
	}>;
	facilities: Array<{
		title: string;
		description: string;
	}>;
	cta: {
		title: string;
		description: string;
		buttonText: string;
	};
}

export async function getAboutPageData(): Promise<AboutPageData | null> {
	await dbConnect();
	const about = await About.findOne().lean();

	if (!about) {
		return null;
	}

	return {
		hero: {
			title: about.hero?.title || "আমাদের সম্পর্কে",
			subtitle: about.hero?.subtitle || "",
			backgroundImage: about.hero?.backgroundImage || "",
		},
		mission: {
			title: about.mission?.title || "মিশন:",
			content: about.mission?.content || "",
		},
		vision: {
			title: about.vision?.title || "ভিশন:",
			content: about.vision?.content || "",
		},
		history: {
			title: about.history?.title || "প্রতিষ্ঠানের ইতিহাস",
			paragraphs: about.history?.paragraphs || [],
		},
		features: (about.features || []).map((f: any) => ({
			title: f.title || "",
			description: f.description || "",
			icon: f.icon || "",
		})),
		achievements: (about.achievements || []).map((a: any) => ({
			title: a.title || "",
			description: a.description || "",
		})),
		programs: (about.programs || []).map((p: any) => ({
			title: p.title || "",
			duration: p.duration || "",
			description: p.description || "",
		})),
		values: (about.values || []).map((v: any) => ({
			title: v.title || "",
			description: v.description || "",
		})),
		facilities: (about.facilities || []).map((f: any) => ({
			title: f.title || "",
			description: f.description || "",
		})),
		cta: {
			title: about.cta?.title || "আমাদের সাথে যোগ দিন",
			description: about.cta?.description || "",
			buttonText: about.cta?.buttonText || "এখনই ভর্তি আবেদন করুন",
		},
	};
}
