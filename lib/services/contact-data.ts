import dbConnect from "../db";
import ContactPage from "../models/ContactPage";
import FAQ from "../models/FAQ";

export interface ContactPageData {
	header: {
		title: string;
		subtitle: string;
	};
	contactInfo: Array<{
		icon: string;
		title: string;
		details: string;
		color: string;
	}>;
	mapUrl: string;
	departments: Array<{
		name: string;
		phone: string;
		email: string;
	}>;
	quickInfo: {
		title: string;
		description: string;
		socials: {
			facebook: string;
			twitter: string;
			linkedin: string;
		};
	};
}

export interface FaqItem {
	_id: string;
	question: string;
	answer: string;
	category: string;
}

export async function getContactPageData() {
	await dbConnect();

	const [pageData, faqs] = await Promise.all([
		ContactPage.findOne().lean(),
		FAQ.find({ isActive: true }).sort({ order: 1 }).lean(),
	]);

	return {
		pageData: pageData
			? {
					header: pageData.header,
					contactInfo: pageData.contactInfo,
					mapUrl: pageData.mapUrl,
					departments: pageData.departments,
					quickInfo: pageData.quickInfo,
			  }
			: null,
		faqs: (faqs as any[]).map((f) => ({
			_id: f._id.toString(),
			question: f.question,
			answer: f.answer,
			category: f.category,
		})),
	};
}
