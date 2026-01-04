import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmissionPage extends Document {
	header: {
		title: string;
		subtitle: string;
	};
	infoCards: Array<{
		icon: string; // "BookOpen", "DollarSign", "Users", "Clock"
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
	requirements: string[]; // List of required documents
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

const AdmissionPageSchema = new Schema<any>(
	{
		header: {
			title: { type: String, default: "ভর্তি তথ্য ও নির্দেশিকা" },
			subtitle: {
				type: String,
				default: "মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসায় স্বাগতম",
			},
		},
		infoCards: [
			{
				icon: String,
				title: String,
				subtitle: String,
			},
		],
		schedule: {
			online: {
				title: { type: String, default: "অনলাইন আবেদন" },
				start: { type: String, default: "০১ জানুয়ারি" },
				end: { type: String, default: "৩০ জুন" },
				status: { type: String, default: "চলমান" },
			},
			exam: {
				title: { type: String, default: "প্রবেশ পরীক্ষা" },
				date: { type: String, default: "জুলাই-আগস্ট" },
				time: { type: String, default: "সকাল ৯:০০ টা" },
				location: { type: String, default: "প্রধান ক্যাম্পাস" },
			},
		},
		classes: [
			{
				department: String,
				class: String,
				duration: String,
				fees: String,
				capacity: String,
			},
		],
		requirements: [String],
		faq: [
			{
				q: String,
				a: String,
			},
		],
		cta: {
			title: { type: String, default: "আমাদের সাথে যোগাযোগ করুন" },
			address: { type: String, default: "মিরপুর ১০, ঢাকা" },
			phone: { type: String, default: "+৮৮০১৭१२-०५४७६३" },
			email: { type: String, default: "tahfizmirpur@gmail.com" },
			buttonText: { type: String, default: "এখনই আবেদন করুন" },
		},
	},
	{ timestamps: true }
);

// Prevent model caching issues in development
if (mongoose.models.AdmissionPage) {
	delete mongoose.models.AdmissionPage;
}

const AdmissionPage =
	mongoose.models.AdmissionPage ||
	mongoose.model<IAdmissionPage>("AdmissionPage", AdmissionPageSchema as any);

export default AdmissionPage;
