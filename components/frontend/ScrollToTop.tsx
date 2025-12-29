"use client";

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollToTop: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const scrollPercent = (scrollTop / docHeight) * 100;

			setScrollProgress(scrollPercent);
			setIsVisible(scrollTop > 200);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!isVisible) return null;

	return (
		<button
			onClick={scrollToTop}
			className="fixed bottom-8 right-8 z-50 group"
			aria-label="Scroll to top"
		>
			{/* Circular Progress Background */}
			<svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
				{/* Background circle */}
				<circle
					cx="28"
					cy="28"
					r="24"
					fill="none"
					stroke="#e5e7eb"
					strokeWidth="2"
				/>
				{/* Progress circle */}
				<circle
					cx="28"
					cy="28"
					r="24"
					fill="none"
					stroke="#07943bff"
					strokeWidth="2"
					strokeDasharray={`${2 * Math.PI * 24}`}
					strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
					strokeLinecap="round"
					className="transition-all duration-150"
				/>
			</svg>

			{/* Arrow Icon */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="size-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-700 transition-colors">
					<ArrowUp className="w-6 h-6 text-white" />
				</div>
			</div>
		</button>
	);
};

export default ScrollToTop;
