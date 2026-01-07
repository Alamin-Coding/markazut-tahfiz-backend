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
					header: {
						title: pageData.header?.title || "",
						subtitle: pageData.header?.subtitle || "",
					},
					contactInfo: (pageData.contactInfo || []).map((info: any) => ({
						icon: info.icon || "",
						title: info.title || "",
						details: info.details || "",
						color: info.color || "",
					})),
					mapUrl: pageData.mapUrl || "",
					departments: (pageData.departments || []).map((dept: any) => ({
						name: dept.name || "",
						phone: dept.phone || "",
						email: dept.email || "",
					})),
					quickInfo: {
						title: pageData.quickInfo?.title || "",
						description: pageData.quickInfo?.description || "",
						socials: {
							facebook: pageData.quickInfo?.socials?.facebook || "",
							twitter: pageData.quickInfo?.socials?.twitter || "",
							linkedin: pageData.quickInfo?.socials?.linkedin || "",
						},
					},
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
