import React from "react";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import Header from "@/components/frontend/Header";
import ScrollToTop from "@/components/frontend/ScrollToTop";
import { Providers } from "@/components/Providers";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: "%s | মারকাজুত তাহফিজ",
		default: "মারকাজুত তাহফিজ",
	},
	description: "একটি আধুনিক দ্বীনি শিক্ষা প্রতিষ্ঠান",
};

export default function FrontendLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Providers>
			<div className="flex flex-col min-h-screen">
				<Header />
				<Navbar />
				<main className="grow">{children}</main>
				<Footer />
				<ScrollToTop />
			</div>
		</Providers>
	);
}
