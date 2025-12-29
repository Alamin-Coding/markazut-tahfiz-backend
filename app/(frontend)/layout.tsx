import React from "react";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import Header from "@/components/frontend/Header";
import ScrollToTop from "@/components/frontend/ScrollToTop";
import { Providers } from "@/components/Providers";

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
