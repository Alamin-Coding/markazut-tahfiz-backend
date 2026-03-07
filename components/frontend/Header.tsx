import { Mail, MapPin, Phone } from "lucide-react";

// Header Component
const Header: React.FC = () => {
	return (
		<div className="hidden md:block bg-[#35374B] text-white py-3 px-4 relative z-50">
			<div className="container mx-auto flex flex-wrap justify-between items-center ">
				<div className="flex items-center gap-2 mb-2 sm:mb-0">
					<span>
						স্বাগতম!
						<span className="font-bold font-arabic ml-2 text-lg">
							أهلا و سهلا!
						</span>
					</span>
				</div>
				<div className="flex flex-wrap gap-3 md:gap-6">
					<div className="flex items-center gap-2">
						<MapPin size={16} />
						<span>মিরপুর ১০, ঢাকা, বাংলাদেশ </span>
					</div>

					<div className="w-0.5 bg-gray-500 h-6"></div>
					<div className="flex items-center gap-2">
						<Mail size={16} />
						<a
							href="mailto:tahfizmirpur@gmail.com"
							className="hover:underline transition-all duration-300"
						>
							tahfizmirpur@gmail.com
						</a>
					</div>
					<div className="w-0.5 bg-gray-500 h-6"></div>

					<div className="flex items-center gap-2">
						<Phone size={16} />
						<a
							href="tel:+8801943834216"
							className="hover:underline transition-all duration-300"
						>
							+8801943-834216
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
