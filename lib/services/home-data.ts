import dbConnect from "../db";
import Hero from "../models/Hero";
import About from "../models/About";
import Info from "../models/Info";
import Speech from "../models/Speech";
import Gallery from "../models/Gallery";
import Testimonial from "../models/Testimonial";
import Notice from "../models/Notice";

// Types for home page data
export interface HomePageData {
	hero: {
		title: string;
		description: string;
		buttonText: string;
		backgroundImage: string;
	} | null;
	about: {
		title: string;
		description: string;
		image1: string;
		image2: string;
		image3: string;
		image4: string;
		steps: Array<{ number: string; title: string; icon: string }>;
	} | null;
	info: {
		info1Quantity: number;
		info1Title: string;
		info2Quantity: number;
		info2Title: string;
		info3Quantity: number;
		info3Title: string;
		info4Quantity: number;
		info4Title: string;
		backgroundImage: string;
	} | null;
	speech: {
		name: string;
		role: string;
		message: string;
		image: string;
		subtitle: string;
		arabic: string;
		bengaliGreeting: string;
	} | null;
	gallery: Array<{
		_id: string;
		title: string;
		imageUrl: string;
	}>;
	testimonials: Array<{
		_id: string;
		name: string;
		location: string;
		message: string;
		image: string;
		rating: number;
	}>;
	notices: Array<{
		_id: string;
		title: string;
		date: string;
		content: string[];
		type: string;
	}>;
}

// Fetch all home page data in parallel for optimal performance
export async function getHomePageData(): Promise<HomePageData> {
	await dbConnect();

	const [hero, about, info, speech, gallery, testimonials, notices] =
		await Promise.all([
			Hero.findOne().lean(),
			About.findOne().lean(),
			Info.findOne().lean(),
			Speech.findOne().lean(),
			Gallery.find().sort({ createdAt: -1 }).limit(6).lean(),
			Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
			Notice.find({ isActive: true }).sort({ createdAt: -1 }).limit(1).lean(),
		]);

	return {
		hero: hero
			? {
					title: hero.title,
					description: hero.description,
					buttonText: hero.buttonText,
					backgroundImage: hero.backgroundImage,
			  }
			: null,
		about: about
			? {
					title: about.title || about.mission?.title || "",
					description: about.description || about.mission?.content || "",
					image1: about.image1 || "",
					image2: about.image2 || "",
					image3: about.image3 || "",
					image4: about.image4 || "",
					steps: about.steps || [],
			  }
			: null,
		info: info
			? {
					info1Quantity: info.info1Quantity,
					info1Title: info.info1Title,
					info2Quantity: info.info2Quantity,
					info2Title: info.info2Title,
					info3Quantity: info.info3Quantity,
					info3Title: info.info3Title,
					info4Quantity: info.info4Quantity,
					info4Title: info.info4Title,
					backgroundImage: info.backgroundImage || "",
			  }
			: null,
		speech: speech
			? {
					name: speech.name,
					role: speech.role,
					message: speech.message,
					image: speech.image || "",
					subtitle: speech.subtitle || "",
					arabic: speech.arabic || "",
					bengaliGreeting: speech.bengaliGreeting || "",
			  }
			: null,
		gallery: gallery.map((item: any) => ({
			_id: item._id.toString(),
			title: item.title || "",
			imageUrl: item.imageUrl,
		})),
		testimonials: testimonials.map((item: any) => ({
			_id: item._id.toString(),
			name: item.name,
			location: item.location || "",
			message: item.message,
			image: item.image || "",
			rating: item.rating || 5,
		})),
		notices: notices.map((item: any) => ({
			_id: item._id.toString(),
			title: item.title,
			date: item.date,
			content: item.content,
			type: item.type,
		})),
	};
}
