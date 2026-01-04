import ContactContent from "@/components/frontend/ContactContent";
import { getContactPageData } from "@/lib/services/contact-data";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ContactPage() {
	const data = await getContactPageData();

	return <ContactContent initialData={data} />;
}
