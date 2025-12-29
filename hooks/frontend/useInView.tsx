import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export default function useInView<T extends Element>(
	options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
	const ref = useRef<T | null>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setInView(true);
					if (observer && node) observer.unobserve(node);
				}
			});
		}, options || { threshold: 0.15 });

		observer.observe(node);

		return () => observer.disconnect();
	}, [ref, options]);

	return [ref as RefObject<T>, inView];
}
