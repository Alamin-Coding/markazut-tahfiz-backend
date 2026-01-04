import AboutContent from "@/components/frontend/AboutContent";
import { getAboutPageData } from "@/lib/services/about-data";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function AboutPage() {
	const data = await getAboutPageData();

	return <AboutContent data={data} />;
}
