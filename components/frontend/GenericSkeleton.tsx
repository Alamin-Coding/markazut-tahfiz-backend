import React from "react";
import Skeleton from "./Skeleton";

const GenericSkeleton: React.FC = () => {
	return (
		<div className="space-y-12 pb-20">
			{/* Banner Skeleton */}
			<div className="h-48 pt-12 bg-linear-to-r from-emerald-600/20 to-green-600/20">
				<div className="max-w-6xl mx-auto px-4 space-y-4">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
			</div>

			{/* Content Area Skeleton */}
			<div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
				<div className="lg:col-span-2 space-y-8">
					<Skeleton className="h-[400px] w-full rounded-2xl" />
					<div className="space-y-4">
						<Skeleton className="h-6 w-1/2" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
				<div className="space-y-6">
					<Skeleton className="h-64 w-full rounded-2xl" />
					<Skeleton className="h-32 w-full rounded-2xl" />
				</div>
			</div>
		</div>
	);
};

export default GenericSkeleton;
