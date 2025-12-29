import { useState, useEffect } from "react";
import {
	MapPin,
	Phone,
	Mail,
	Clock,
	Send,
	Facebook,
	Twitter,
	Linkedin,
	Loader2,
	AlertCircle,
} from "lucide-react";
import Animated from "./Animated";
import type { FormData, Faq } from "../../types/frontend";
import { useGetFaqsQuery } from "../../features/notice/faq-api";
import { env } from "../../lib/frontend/env";

interface ContactPageData {
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

const ContactContent: React.FC = () => {
	// FAQ API call
	const { data: faqData } = useGetFaqsQuery();
	const [pageData, setPageData] = useState<ContactPageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [serverError, setServerError] = useState(false);

	const communicationFaq = faqData?.data.filter(
		(item: Faq) => item.category === "communication"
	);

	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});

	const [submitted, setSubmitted] = useState<boolean>(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${env.apiUrl}/api/contact-page`)
			.then((res) => res.json())
			.then((json) => {
				if (json.success && json.data) {
					setPageData(json.data);
				} else {
					setServerError(true);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch contact page data", err);
				setServerError(true);
			})
			.finally(() => setLoading(false));
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (): Promise<void> => {
		setError(null);

		// Validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^(\+88)?01[3-9]\d{8}$/; // Bangladeshi phone number regex

		if (!formData.name.trim()) {
			setError("দয়া করে আপনার নাম লিখুন");
			return;
		}
		if (!formData.email.trim() || !emailRegex.test(formData.email)) {
			setError("দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন");
			return;
		}
		if (
			!formData.phone.trim() ||
			!phoneRegex.test(formData.phone.replace(/\D/g, ""))
		) {
			if (formData.phone.length < 11) {
				setError("দয়া করে একটি সঠিক ফোন নম্বর দিন");
				return;
			}
		}
		if (!formData.subject.trim()) {
			setError("দয়া করে বার্তার বিষয় লিখুন");
			return;
		}
		if (!formData.message.trim()) {
			setError("দয়া করে আপনার বার্তা লিখুন");
			return;
		}

		setSending(true);
		try {
			const res = await fetch(`${env.apiUrl}/api/contact`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const json = await res.json();

			if (json.success) {
				setSubmitted(true);
				setFormData({
					name: "",
					email: "",
					phone: "",
					subject: "",
					message: "",
				});
				setTimeout(() => setSubmitted(false), 5000);
			} else {
				setError(json.message || "Failed to send message");
			}
		} catch (err) {
			console.error(err);
			setError("Network error, please try again later.");
		} finally {
			setSending(false);
		}
	};

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "MapPin":
				return MapPin;
			case "Phone":
				return Phone;
			case "Mail":
				return Mail;
			case "Clock":
				return Clock;
			default:
				return MapPin;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 text-green-600 animate-spin" />
			</div>
		);
	}

	if (serverError || !pageData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
				<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2">সার্ভার ত্রুটি</h2>
				<p className="text-gray-600 text-center mb-6">
					দুঃখিত, বর্তমানে সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না। দয়া করে
					কিছুক্ষণ পর আবার চেষ্টা করুন।
				</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
				>
					রিফ্রেশ করুন
				</button>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header Banner */}
			<div className="bg-linear-to-r from-button to-green-700 text-white py-12">
				<div className="max-w-6xl mx-auto px-4">
					<h1 className="text-4xl font-bold mb-4">{pageData.header.title}</h1>
					<p className="text-green-100 text-lg">{pageData.header.subtitle}</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 py-12">
				{/* Contact Info Cards */}
				<Animated>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
						{pageData.contactInfo.map((info, idx) => {
							const IconComponent = getIcon(info.icon);
							return (
								<div
									key={idx}
									className="bg-white rounded-lg shadow-md p-6 text-center"
								>
									<IconComponent
										className={`w-12 h-12 ${info.color} mx-auto mb-4`}
									/>
									<h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
									<p className="text-gray-600">{info.details}</p>
								</div>
							);
						})}
					</div>
				</Animated>

				{/* Contact Form and Map Section */}
				<Animated delay={80}>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
						{/* Contact Form */}
						<div className="bg-white rounded-lg shadow-md p-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-6">
								বার্তা পাঠান
							</h2>

							{submitted && (
								<div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
									✓ আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে
									যোগাযোগ করব।
								</div>
							)}
							{error && (
								<div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
									{error}
								</div>
							)}

							<div className="space-y-4">
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										আপনার নাম
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
										placeholder="আপনার সম্পূর্ণ নাম"
										disabled={sending}
									/>
								</div>

								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										ইমেইল
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
										placeholder="your@email.com"
										disabled={sending}
									/>
								</div>

								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										ফোন নম্বর
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
										placeholder="+৮৮০১७१२-०५४७६३"
										disabled={sending}
									/>
								</div>

								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										বিষয়
									</label>
									<input
										type="text"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
										placeholder="বার্তার বিষয়"
										disabled={sending}
									/>
								</div>

								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										বার্তা
									</label>
									<textarea
										name="message"
										value={formData.message}
										onChange={handleChange}
										rows={5}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 resize-none"
										placeholder="আপনার বার্তা এখানে লিখুন..."
										disabled={sending}
									/>
								</div>

								<button
									onClick={handleSubmit}
									disabled={sending}
									className="w-full bg-button text-white py-3 rounded-lg font-semibold hover:bg-hover cursor-pointer transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
								>
									{sending ? (
										<>sending...</>
									) : (
										<>
											<Send className="w-5 h-5" />
											বার্তা পাঠান
										</>
									)}
								</button>
							</div>
						</div>

						{/* Map and Additional Info */}
						<div className="space-y-6">
							{/* Map Placeholder */}
							<div className="bg-white rounded-lg shadow-md overflow-hidden h-80">
								<iframe
									src={pageData.mapUrl}
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
							<div className="bg-white rounded-lg shadow-md p-6">
								<h3 className="text-lg font-bold text-gray-800 mb-4">
									{pageData.quickInfo.title}
								</h3>
								<p className="text-gray-600 mb-4">
									{pageData.quickInfo.description}
								</p>
								<div className="flex gap-4">
									<a
										href={pageData.quickInfo.socials.facebook}
										className="text-blue-600 hover:text-blue-800"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Facebook className="w-6 h-6" />
									</a>
									<a
										href={pageData.quickInfo.socials.twitter}
										className="text-blue-400 hover:text-blue-600"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Twitter className="w-6 h-6" />
									</a>
									<a
										href={pageData.quickInfo.socials.linkedin}
										className="text-blue-700 hover:text-blue-900"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Linkedin className="w-6 h-6" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</Animated>

				{/* Departments Section */}
				<div className="bg-white rounded-lg shadow-md p-8 mb-12">
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						বিভাগীয় তথ্য
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{pageData.departments.map((dept, idx) => (
							<div key={idx} className="border-l-4 border-button pl-6 py-4">
								<h3 className="font-bold text-gray-800 mb-3">{dept.name}</h3>
								<div className="space-y-2 text-sm">
									<p className="text-gray-600">
										<strong>ফোন:</strong> {dept.phone}
									</p>
									<p className="text-gray-600">
										<strong>ইমেইল:</strong> {dept.email}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* FAQ Section */}
				<div className="bg-linear-to-r from-green-50 to-blue-50 rounded-lg p-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						যোগাযোগ সম্পর্কে প্রশ্ন
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{communicationFaq?.map((faq: any, index: number) => (
							<div key={faq._id || index}>
								<h4 className="font-semibold text-gray-800 mb-2">
									{faq.question}
								</h4>
								<p className="text-gray-600">{faq.answer}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactContent;
