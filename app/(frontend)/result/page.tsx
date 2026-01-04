import ResultContent from "@/components/frontend/ResultContent";
import { getResultOptions } from "@/lib/services/result-data";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ResultPage() {
	const initialOptions = await getResultOptions();

	return <ResultContent initialOptions={initialOptions} />;
}
