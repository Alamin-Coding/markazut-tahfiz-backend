"use client";

import Info from "./Info";
import Notice from "./Notice";
import About from "./sections/About";
import Gallery from "./sections/GalleryGrid";
import Hero from "./sections/Hero";
import Speech from "./sections/Speech";
import Testimonial from "./sections/Testimonial";
import Animated from "./Animated";

const HomeContent: React.FC = () => {
	return (
		<div className="min-h-screen bg-white">
			<Animated>
				<Hero />
			</Animated>
			<Animated delay={80}>
				<Notice />
			</Animated>
			<Animated delay={120}>
				<About />
			</Animated>
			<Animated delay={160}>
				<Info />
			</Animated>
			<Animated delay={200}>
				<Speech />
			</Animated>
			<Animated delay={240}>
				<Gallery />
			</Animated>
			<Animated delay={280}>
				<Testimonial />
			</Animated>
		</div>
	);
};

export default HomeContent;
