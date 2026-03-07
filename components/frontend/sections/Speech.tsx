import { AlertCircle } from "lucide-react";

interface TestimonialCardProps {
	image: string;
	name: string;
	title: string;
	subtitle: string;
	arabic: string;
	bengaliGreeting: string;
	testimonialText: string[];
	rating: number;
}

const SpeechBlock: React.FC<TestimonialCardProps> = ({
	image,
	name,
	title,
	subtitle,
	arabic,
	bengaliGreeting,
	testimonialText,
	rating,
}) => {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-12">
					<h1 className="text-3xl font-bold text-gray-800">
						প্রতিষ্ঠাতা ও প্রিন্সিপালের এর{" "}
						<span className="text-green-600">বাণী</span>
					</h1>
				</div>

				{/* Card Section */}
				<div className="border-4 border-green-600 rounded-3xl bg-white p-8 md:p-12 relative">
					{/* Rating Badge */}
					<div
						style={{ borderRadius: "20px 20px 20px 0px" }}
						className="absolute top-6 right-6 bg-green-600 text-white w-12 h-12 flex items-center justify-center font-bold text-lg"
					>
						{rating}
					</div>

					<div className="flex flex-col md:flex-row gap-8">
						{/* Left Section - Image and Info */}
						<div className="flex flex-col items-center md:w-1/4 md:items-start">
							{/* Profile Image */}
							<div className="mb-6">
								<img
									src={image}
									alt={name}
									loading="lazy"
									className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dashed border-gray-300 object-cover"
								/>
							</div>

							{/* Name and Title */}
							<div className="text-center md:text-left">
								<h2 className="text-lg font-bold text-gray-800 mb-1">{name}</h2>
								<p className="text-green-600 text-sm font-semibold mb-2">
									{title}
								</p>
								<p className="text-gray-600 text-xs leading-relaxed">
									{subtitle}
								</p>
							</div>

							{/* Arabic Text */}
							<p className="text-gray-500 text-sm mt-4 text-right">{arabic}</p>
						</div>

						{/* Right Section - Testimonial */}
						<div className="md:w-3/4">
							{/* Greeting */}
							<p className="text-green-600 text-base font-semibold mb-4">
								{bengaliGreeting}
							</p>

							{/* Testimonial Text */}
							<div className="space-y-4 text-gray-700 text leading-relaxed">
								{testimonialText.map((paragraph, index) => (
									<p key={index}>{paragraph}</p>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

interface SpeechData {
	name: string;
	role: string;
	message: string;
	image: string;
	subtitle: string;
	arabic: string;
	bengaliGreeting: string;
}

interface SpeechProps {
	data: SpeechData | null;
}

export default function Speech({ data }: SpeechProps) {
	if (!data) {
		return (
			<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-gray-800">
				<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
				<h2 className="text-2xl font-bold mb-2">সার্ভার ত্রুটি</h2>
				<p className="text-gray-600 text-center mb-6">
					দুঃখিত, বর্তমানে সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।
				</p>
			</div>
		);
	}

	const speechProps: TestimonialCardProps = {
		image: data.image,
		name: data.name,
		title: data.role,
		subtitle: data.subtitle,
		arabic: data.arabic,
		bengaliGreeting: data.bengaliGreeting,
		testimonialText: data.message ? data.message.split("\n") : [],
		rating: 99,
	};

	return <SpeechBlock {...speechProps} />;
}
