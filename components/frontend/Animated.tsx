"use client";

import useInView from "../../hooks/frontend/useInView";

interface AnimatedProps {
	children: React.ReactNode;
	className?: string;
	threshold?: number;
	delay?: number; // ms
}

const Animated: React.FC<AnimatedProps> = ({
	children,
	className = "",
	threshold,
	delay = 0,
}) => {
	const [ref, inView] = useInView<HTMLDivElement>({
		threshold: threshold ?? 0.15,
	});

	return (
		<div
			ref={ref}
			style={{ transitionDelay: `${delay}ms` }}
			className={`transform transition-all duration-700 ease-out ${
				inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
			} ${className}`}
		>
			{children}
		</div>
	);
};

export default Animated;
