import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
	variable: "--font-hind-siliguri",
	subsets: ["bengali"],
	weight: ["300", "400", "500", "600", "700"],
});

const notoSansBengali = Noto_Sans_Bengali({
	variable: "--font-noto-sans-bengali",
	subsets: ["bengali"],
});

export const metadata: Metadata = {
	title: "মারকাজুত তাহফিজ",
	description: "একটি আধুনিক দ্বীনি শিক্ষা প্রতিষ্ঠান (মিরপুর ১০, ঢাকা)",
	other: {
		google: "notranslate",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="bn">
			<body
				className={`${notoSansBengali.variable} ${hindSiliguri.variable} antialiased font-sans`}
			>
				{children}
			</body>
		</html>
	);
}
