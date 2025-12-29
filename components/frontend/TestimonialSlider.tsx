"use client";

import Slider from "react-slick";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Testimonial {
	id: string | number;
	name: string;
	location: string;
	text: string;
	image: string;
	rating: number;
	ratingScore: number;
}

interface TestimonialSliderProps {
	title: string;
	subtitle: string;
	testimonials: Testimonial[];
}

// Custom Next Arrow
const NextArrow = ({ onClick }: any) => (
	<button
		onClick={onClick}
		className="hidden lg:flex lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 
               bg-green-600 hover:bg-green-700 text-white p-2 rounded-full 
               shadow-lg z-10"
	>
		<ChevronRight className="w-5 h-5" />
	</button>
);

// Custom Prev Arrow
const PrevArrow = ({ onClick }: any) => (
	<button
		onClick={onClick}
		className="hidden lg:flex lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 
               bg-green-600 hover:bg-green-700 text-white p-2 rounded-full 
               shadow-lg z-10"
	>
		<ChevronLeft className="w-5 h-5" />
	</button>
);

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
	title,
	subtitle,
	testimonials,
}) => {
	const settings = {
		dots: false,
		infinite: true,
		speed: 600,
		autoplay: true,
		autoplaySpeed: 2000,
		arrows: true,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		slidesToShow: 1,
		slidesToScroll: 1,
		pauseOnHover: true,
	};

	return (
		<section className="bg-gray-50 py-16 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<p className="text-green-600 text-lg mb-3 flex items-center justify-center gap-2">
						👥 <span className="font-semibold">প্রশংসা পত্র</span>
					</p>

					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						{title}
					</h2>

					<p className="text-gray-600 text-base max-w-2xl mx-auto">
						{subtitle}
					</p>

					<div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
				</div>

				{/* Slider */}
				<div className="relative px-10">
					<Slider {...settings}>
						{testimonials.map((t) => (
							<div key={t.id} className="px-3">
								<div className="bg-white rounded-lg p-6 md:p-12 shadow-lg relative max-w-2xl h-80 mx-auto">
									{/* Rating Badge */}
									<div className="absolute top-4 right-4 bg-green-600 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-sm md:text-base">
										{t.ratingScore}
									</div>

									{/* Stars */}
									<div className="flex gap-1 mb-4">
										{Array.from({ length: t.rating }).map((_, i) => (
											<Star
												key={i}
												className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>

									{/* Text */}
									<p className="text-gray-700 text-base leading-relaxed mb-8">
										{t.text}
									</p>

									{/* Divider */}
									<div className="flex items-center gap-3 mb-6">
										<div className="flex-1 h-1 bg-linear-to-r from-green-600 to-transparent rounded-full"></div>
									</div>

									{/* Author */}
									<div className="flex items-center gap-4 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-dashed border-green-600">
										<img
											style={{
												objectFit: "cover",
												borderRadius: "50%",
												width: "100%",
												height: "100%",
											}}
											src={t.image}
											alt={t.name}
											loading="lazy"
											className="w-full h-full"
										/>

										<div>
											<h3 className="font-bold text-gray-800">{t.name}</h3>
											<p className="text-green-600 text-sm">{t.location}</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</Slider>
				</div>
			</div>

			{/* CUSTOM DOT ACTIVE COLOR */}
			<style>
				{`
          .slick-dots li.slick-active div {
            background-color: #16a34a !important; /* Green */
            width: 12px !important;
            height: 12px !important;
          }
        `}
			</style>
		</section>
	);
};

export default TestimonialSlider;
