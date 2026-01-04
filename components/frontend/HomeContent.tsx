import Info from "./Info";
import Notice from "./Notice";
import About from "./sections/About";
import Gallery from "./sections/GalleryGrid";
import Hero from "./sections/Hero";
import Speech from "./sections/Speech";
import Testimonial from "./sections/Testimonial";
import Animated from "./Animated";
import type { HomePageData } from "@/lib/services/home-data";

interface HomeContentProps {
	data: HomePageData;
}

const HomeContent: React.FC<HomeContentProps> = ({ data }) => {
	return (
		<div className="min-h-screen bg-white">
			<Animated>
				<Hero data={data.hero} />
			</Animated>
			<Animated delay={80}>
				<Notice data={data.notices} />
			</Animated>
			<Animated delay={120}>
				<About data={data.about} />
			</Animated>
			<Animated delay={160}>
				<Info data={data.info} />
			</Animated>
			<Animated delay={200}>
				<Speech data={data.speech} />
			</Animated>
			<Animated delay={240}>
				<Gallery data={data.gallery} />
			</Animated>
			<Animated delay={280}>
				<Testimonial data={data.testimonials} />
			</Animated>
		</div>
	);
};

export default HomeContent;
