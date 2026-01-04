"use client";

import {
	ChevronRight,
	Mail,
	MapPin,
	Phone,
	Facebook,
	Youtube,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="bg-button text-white pt-16 pb-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
					{/* Logo & Info */}
					<div className="flex flex-col gap-6">
						<Link href="/" className="flex items-center gap-3">
							<div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2">
								<Image
									src="/logo.png"
									alt="logo"
									width={64}
									height={64}
									className="object-contain"
								/>
							</div>
							<h3 className="text-2xl font-bold font-arabic">المركز</h3>
						</Link>
						<p className="text-emerald-100/70 text-sm leading-relaxed">
							একটি আধুনিক দ্বীনি শিক্ষা প্রতিষ্ঠান যেখানে কুরআন হিফজর পাশাপাশি
							জেনারেল বিষয়েও গুরুত্ব প্রদান করা হয়।
						</p>
						<div className="flex gap-4">
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition-colors"
							>
								<Facebook size={20} />
							</a>
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition-colors"
							>
								<Youtube size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-xl font-bold mb-6 flex items-center gap-2">
							<span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
							দ্রুত লিংক
						</h3>
						<ul className="grid gap-4">
							{[
								{ label: "হোম", href: "/" },
								{ label: "আমাদের সম্পর্কে", href: "/about" },
								{ label: "নোটিশ", href: "/notice" },
								{ label: "বিভাগ সমূহ", href: "/departments" },
								{ label: "ভর্তি তথ্য", href: "/admission" },
								{ label: "ফলাফল", href: "/result" },
							].map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-emerald-100/70 hover:text-white flex items-center gap-2 transition-colors group"
									>
										<ChevronRight
											size={16}
											className="text-emerald-500 group-hover:translate-x-1 transition-transform"
										/>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-xl font-bold mb-6 flex items-center gap-2">
							<span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
							যোগাযোগ
						</h3>
						<ul className="grid gap-6">
							<li className="flex items-start gap-4">
								<div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
									<MapPin size={20} className="text-emerald-400" />
								</div>
								<div>
									<h4 className="font-semibold text-sm mb-1">ঠিকানা</h4>
									<p className="text-emerald-100/70 text-sm">
										মিরপুর-১, ঢাকা, বাংলাদেশ
									</p>
								</div>
							</li>
							<li className="flex items-start gap-4">
								<div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
									<Phone size={20} className="text-emerald-400" />
								</div>
								<div>
									<h4 className="font-semibold text-sm mb-1">ফোন নম্বর</h4>
									<p className="text-emerald-100/70 text-sm">
										+880 1712-054763
									</p>
								</div>
							</li>
							<li className="flex items-start gap-4">
								<div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
									<Mail size={20} className="text-emerald-400" />
								</div>
								<div>
									<h4 className="font-semibold text-sm mb-1">ইমেইল</h4>
									<p className="text-emerald-100/70 text-sm">
										tahfizmirpur@gmail.com
									</p>
								</div>
							</li>
						</ul>
					</div>

					{/* Map Section */}
					<div>
						<h3 className="text-xl font-bold mb-6 flex items-center gap-2">
							<span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
							অবস্থান
						</h3>
						<div className="rounded-xl overflow-hidden h-48 bg-emerald-900 border border-white/10">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.223595720905!2d90.37384899999999!3d23.8106468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c72abbe75d93%3A0x514619aa65ef768e!2z4Kau4Ka-4Kaw4KaV4Ka-4Kac4KeB4KakIOCmpOCmvuCmueCmq-Cmv-CmnCDgpofgpqjgpp_gpr7gprDgpqjgp43gpq_gpr7gprbgpqjgpr7gprIg4KaV4KeN4Kav4Ka-4Kah4KeH4KafIOCmruCmvuCmpuCnjeCmsOCmvuCmuOCmviDgpq7gpr_gprDgpqrgp4HgprAg4Ka24Ka-4KaW4Ka-!5e0!3m2!1sen!2sbd!4v1767550870566!5m2!1sen!2sbd"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							></iframe>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-100/50">
					<p>&copy; {year} মারকাজুত তাহফিজ । সর্বস্বত্ব সংরক্ষিত।</p>
					<div className="flex gap-6">
						<a href="#" className="hover:text-white transition-colors">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-white transition-colors">
							Terms of Service
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
