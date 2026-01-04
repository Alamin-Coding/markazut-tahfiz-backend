import { LucideNotebookPen, AlertCircle } from "lucide-react";

interface InfoType {
	id: number;
	icon: React.ReactNode;
	quantity: number;
	title: string;
}

interface InfoData {
	info1Quantity: number;
	info1Title: string;
	info2Quantity: number;
	info2Title: string;
	info3Quantity: number;
	info3Title: string;
	info4Quantity: number;
	info4Title: string;
	backgroundImage: string;
}

interface InfoProps {
	data: InfoData | null;
}

const Info: React.FC<InfoProps> = ({ data }) => {
	if (!data) {
		return (
			<div className="py-20 bg-green-800 flex flex-col items-center justify-center text-white">
				<AlertCircle className="w-16 h-16 text-red-400 mb-4" />
				<h2 className="text-2xl font-bold mb-2">তথ্য লোড করা যায়নি</h2>
				<p className="text-green-50 text-center mb-6">
					দুঃখিত, সার্ভারের সমস্যার কারণে তথ্য দেখানো যাচ্ছে না।
				</p>
			</div>
		);
	}

	const information: InfoType[] = [
		{
			id: 1,
			icon: <LucideNotebookPen size={36} />,
			quantity: data.info1Quantity,
			title: data.info1Title,
		},
		{
			id: 2,
			icon: <LucideNotebookPen size={36} />,
			quantity: data.info2Quantity,
			title: data.info2Title,
		},
		{
			id: 3,
			icon: <LucideNotebookPen size={36} />,
			quantity: data.info3Quantity,
			title: data.info3Title,
		},
		{
			id: 4,
			icon: <LucideNotebookPen size={36} />,
			quantity: data.info4Quantity,
			title: data.info4Title,
		},
	];

	const bgStyle = {
		backgroundImage: `linear-gradient(rgba(0, 128, 0, 0.45), rgba(0, 128, 0, 0.45)), url("${
			data.backgroundImage || "/bg.avif"
		}")`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<div className="py-12 md:py-16" style={bgStyle}>
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 items-center justify-center">
					{information.map((item) => (
						<div
							key={item.id}
							className="flex flex-col items-center justify-center text-center"
						>
							<div
								className="bg-button flex items-center justify-center text-white shadow-md hover:shadow-lg transition-transform duration-300"
								style={{
									borderRadius: "20px 20px 20px 0px",
									width: "5.5rem",
									height: "5.5rem",
								}}
							>
								<div className="flex items-center justify-center w-full h-full">
									{item.icon}
								</div>
							</div>
							<h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mt-3 mb-1 drop-shadow-md">
								{item.quantity}
							</h3>
							<p className="text-sm sm:text-base md:text-lg text-white font-semibold drop-shadow-sm">
								{item.title}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Info;
