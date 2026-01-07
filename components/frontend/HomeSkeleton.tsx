import React from "react";
import Skeleton from "./Skeleton";

const HomeSkeleton: React.FC = () => {
	return (
		<div className="space-y-12 pb-20">
			{/* Hero Skeleton */}
			<div className="h-[500px] w-full relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
				<div className="max-w-4xl w-full px-4 space-y-6 text-center">
					<Skeleton className="h-12 w-3/4 mx-auto" />
					<Skeleton className="h-6 w-1/2 mx-auto" />
					<Skeleton className="h-10 w-40 mx-auto rounded-lg" />
				</div>
			</div>

			{/* Notice Skeleton */}
			<div className="max-w-6xl mx-auto px-4 h-12 bg-gray-50 dark:bg-gray-900 flex items-center">
				<Skeleton className="h-4 w-1/4 rounded-full mr-4" />
				<Skeleton className="h-4 flex-1 rounded-full" />
			</div>

			{/* About Section Skeleton */}
			<div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
				<Skeleton className="h-[400px] rounded-2xl" />
				<div className="space-y-6">
					<Skeleton className="h-8 w-1/2" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-10 w-32 rounded-lg" />
				</div>
			</div>

			{/* Grid Cards Skeleton */}
			<div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
				{[...Array(4)].map((_, i) => (
					<Skeleton key={i} className="h-40 rounded-2xl" />
				))}
			</div>

			{/* Speech/Section Skeleton */}
			<div className="bg-gray-50 dark:bg-gray-900 py-16">
				<div className="max-w-6xl mx-auto px-4 space-y-8">
					<Skeleton className="h-8 w-48 mx-auto" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="space-y-4">
								<Skeleton className="h-48 w-full rounded-2xl" />
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-full" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeSkeleton;
