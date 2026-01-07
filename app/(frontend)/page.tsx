import HomeContent from "@/components/frontend/HomeContent";
import { getHomePageData } from "@/lib/services/home-data";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "হোম",
};

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds for fresh data

export default async function Home() {
	const data = await getHomePageData();

	return <HomeContent data={data} />;
}
