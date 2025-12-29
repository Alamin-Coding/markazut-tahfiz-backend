import { env } from "../env";

/**
 * Utility function to fetch JSON from an API endpoint with proper error handling
 * Prevents "Unexpected token '<'" errors by checking response type before parsing
 */
export async function fetchJSON<T = any>(
	url: string,
	options?: RequestInit
): Promise<T> {
	try {
		// Prepend env.apiUrl if URL starts with /api/
		const fullUrl = url.startsWith("/api/") ? `${env.apiUrl}${url}` : url;
		const res = await fetch(fullUrl, options);

		// Check if the response is OK
		if (!res.ok) {
			console.error(`API request to ${url} failed with status: ${res.status}`);
			const text = await res.text();
			console.error("Response body:", text.substring(0, 200));
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		// Check content type
		const contentType = res.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			console.error(
				`Response from ${url} is not JSON. Content-Type:`,
				contentType
			);
			const text = await res.text();
			console.error("Response body:", text.substring(0, 200));
			throw new Error("Response is not JSON");
		}

		return await res.json();
	} catch (error) {
		console.error(`Failed to fetch from ${url}:`, error);
		throw error;
	}
}
