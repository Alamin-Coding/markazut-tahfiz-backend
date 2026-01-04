import AdmissionContent from "@/components/frontend/AdmissionContent";
import { getAdmissionPageData } from "@/lib/services/admission-data";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function AdmissionPage() {
	const data = await getAdmissionPageData();

	return <AdmissionContent initialData={data} />;
}
