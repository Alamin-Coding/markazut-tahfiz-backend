"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Types
interface NavItem {
	label: string;
	href: string;
}

// Navigation Component
const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	const navItems: NavItem[] = [
		{ label: "হোম", href: "/" },
		{ label: "আমাদের সম্পর্কে", href: "/about" },
		{ label: "নোটিশ", href: "/notice" },
		{ label: "বিভাগ সমূহ", href: "/departments" },
		{ label: "ভর্তি", href: "/admission" },
		{ label: "যোগাযোগ", href: "/contact" },
		{ label: "ফলাফল", href: "/result" },
	];

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Check if link is active
	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		if (href === "/notice" && pathname === "/all-notices") return true;
		return pathname === href || pathname.startsWith(href + "/");
	};

	return (
		<nav
			className={`bg-white shadow-md top-0 z-50 transition-all duration-300 ${
				isScrolled ? "shadow-lg fixed py-2 w-full" : "py-4 sticky"
			}`}
		>
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center">
					{/* Logo */}
					<Link href={"/"} className="flex items-center gap-3">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
							<Image
								src="/logo.avif"
								alt="markazut tahfiz logo"
								width={48}
								height={48}
								className="w-10 h-10 object-contain"
								unoptimized={true}
							/>
						</div>
						<h3 className="font-bold text-2xl md:text-3xl lg:text-4xl font-arabic">
							المركز
						</h3>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center gap-6">
						{navItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className={`relative font-medium transition-colors ${
									isActive(item.href)
										? "text-green-600 after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-green-600"
										: "text-gray-700 hover:text-green-600"
								}`}
							>
								{item.label}
							</Link>
						))}
						<Link
							href={"/admission-form"}
							className={`px-6 py-2 rounded-full transition-colors ${
								isActive("/admission-form")
									? "bg-green-700 text-white"
									: "bg-button hover:bg-hover text-white"
							}`}
						>
							আবেদন করুন
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="lg:hidden text-gray-700"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-expanded={isMenuOpen}
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="lg:hidden pb-4">
						{navItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								onClick={() => setIsMenuOpen(false)}
								className={`block py-2 font-medium transition-colors ${
									isActive(item.href)
										? "text-green-600 font-bold"
										: "text-gray-700 hover:text-green-600"
								}`}
							>
								{item.label}
							</Link>
						))}
						<Link
							href={"/admission-form"}
							onClick={() => setIsMenuOpen(false)}
							className="block w-full mt-4 bg-button hover:bg-hover text-white px-6 py-2 rounded-lg transition-colors text-center"
						>
							আবেদন করুন
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
