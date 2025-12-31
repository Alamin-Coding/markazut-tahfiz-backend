import {
	SMSConfig,
	SendSMSRequest,
	BulkSMSRequest,
	SMSResponse,
	BalanceResponse,
	SMSErrorCode,
	SMS_ERROR_MESSAGES,
} from "@/types/sms";

class SMSService {
	private config: SMSConfig;

	constructor() {
		this.config = {
			apiKey: process.env.SMS_API_KEY || "",
			senderId: process.env.SMS_SENDER_ID || "",
			apiUrl: process.env.SMS_API_URL || "http://bulksmsbd.net/api/smsapi",
			balanceApiUrl:
				process.env.SMS_BALANCE_API_URL ||
				"http://bulksmsbd.net/api/getBalanceApi",
		};

		if (!this.config.apiKey || !this.config.senderId) {
			console.warn("SMS service not configured properly");
		}
	}

	/**
	 * Format phone number to Bangladesh format (880XXXXXXXXXX)
	 */
	private formatPhoneNumber(number: string): string {
		// Remove all non-digit characters
		let cleaned = number.replace(/\D/g, "");

		// If it's already in 8801XXXXXXXXX format (13 digits), return it
		if (cleaned.length === 13 && cleaned.startsWith("880")) {
			return cleaned;
		}

		// If it's 11 digits starting with 01 (01XXXXXXXXX), add 88 prefix
		if (cleaned.length === 11 && cleaned.startsWith("0")) {
			return "88" + cleaned;
		}

		// If it's 10 digits starting with 1 (missing leading 0), add 880 prefix
		if (cleaned.length === 10 && cleaned.startsWith("1")) {
			return "880" + cleaned;
		}

		// Fallback: just return cleaned if no rules match
		return cleaned;
	}

	/**
	 * Validate Bangladesh phone number
	 */
	private isValidPhoneNumber(number: string): boolean {
		const cleaned = number.replace(/\D/g, "");

		// Valid formats:
		// 1. 11 digits starting with 01: 01XXXXXXXXX
		// 2. 13 digits starting with 880: 8801XXXXXXXXX
		// 3. 10 digits starting with 1: 1XXXXXXXXX (missing 0)

		if (cleaned.length === 11 && cleaned.startsWith("01")) {
			return true;
		}

		if (cleaned.length === 13 && cleaned.startsWith("8801")) {
			return true;
		}

		if (cleaned.length === 10 && cleaned.startsWith("1")) {
			return true;
		}

		return false;
	}

	/**
	 * URL encode message for API
	 */
	private encodeMessage(message: string): string {
		return encodeURIComponent(message);
	}

	/**
	 * Detect if message contains Bengali characters
	 */
	private isBengali(text: string): boolean {
		// Bengali Unicode range: \u0980-\u09FF
		return /[\u0980-\u09FF]/.test(text);
	}

	/**
	 * Parse API response text/JSON to get the numeric response code
	 */
	private parseResponseCode(text: string): number {
		const trimmed = text.trim();

		// Try parsing as JSON first
		try {
			const json = JSON.parse(trimmed);
			if (json && typeof json.response_code !== "undefined") {
				return parseInt(String(json.response_code));
			}
		} catch (e) {
			// Not JSON, fall back to plain text parsing
		}

		// Try parsing directly as an integer
		const parsed = parseInt(trimmed);
		return isNaN(parsed) ? -1 : parsed;
	}

	/**
	 * Get error message from error code
	 */
	private getErrorMessage(code: number): string {
		return SMS_ERROR_MESSAGES[code] || `Unknown error (code: ${code})`;
	}

	/**
	 * Send SMS to a single number
	 */
	async sendSMS(request: SendSMSRequest): Promise<SMSResponse> {
		try {
			// Validate phone number
			if (!this.isValidPhoneNumber(request.number)) {
				console.warn("Invalid phone number:", request.number);
				return {
					success: false,
					code: SMSErrorCode.INVALID_NUMBER,
					message: this.getErrorMessage(SMSErrorCode.INVALID_NUMBER),
				};
			}

			const formattedNumber = this.formatPhoneNumber(request.number);

			// Combine title and message if title exists
			const fullMessage = request.title
				? `${request.title}: ${request.message}`
				: request.message;

			const encodedMessage = this.encodeMessage(fullMessage);
			const type =
				request.type || (this.isBengali(fullMessage) ? "unicode" : "text");

			// Build API URL
			const url = `${this.config.apiUrl}?api_key=${this.config.apiKey}&type=${type}&number=${formattedNumber}&senderid=${this.config.senderId}&message=${encodedMessage}`;

			console.log("Sending SMS to:", formattedNumber);
			console.log("URL:", url.replace(this.config.apiKey, "REDACTED"));

			// Make API request
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const responseText = await response.text();
			console.log("SMS API raw response:", responseText);

			const code = this.parseResponseCode(responseText);

			// Check if successful
			if (code === SMSErrorCode.SUCCESS) {
				return {
					success: true,
					code,
					message: this.getErrorMessage(code),
					data: {
						sent: 1,
						failed: 0,
					},
				};
			} else {
				return {
					success: false,
					code,
					message: this.getErrorMessage(code),
				};
			}
		} catch (error) {
			console.error("SMS sending error:", error);
			return {
				success: false,
				code: SMSErrorCode.INTERNAL_ERROR,
				message: "SMS পাঠাতে সমস্যা হয়েছে",
			};
		}
	}

	/**
	 * Send bulk SMS to multiple numbers
	 */
	async sendBulkSMS(request: BulkSMSRequest): Promise<SMSResponse> {
		try {
			// Validate all numbers
			const validNumbers: string[] = [];
			const invalidNumbers: string[] = [];

			for (const number of request.numbers) {
				if (this.isValidPhoneNumber(number)) {
					validNumbers.push(this.formatPhoneNumber(number));
				} else {
					invalidNumbers.push(number);
				}
			}

			if (validNumbers.length === 0) {
				return {
					success: false,
					code: SMSErrorCode.INVALID_NUMBER,
					message: "কোনো সঠিক ফোন নম্বর নেই",
				};
			}

			// Combine title and message if title exists
			const fullMessage = request.title
				? `${request.title}: ${request.message}`
				: request.message;

			const encodedMessage = this.encodeMessage(fullMessage);
			const type =
				request.type || (this.isBengali(fullMessage) ? "unicode" : "text");

			// Send to all valid numbers
			const results = await Promise.allSettled(
				validNumbers.map(async (number) => {
					const url = `${this.config.apiUrl}?api_key=${this.config.apiKey}&type=${type}&number=${number}&senderid=${this.config.senderId}&message=${encodedMessage}`;

					console.log("Bulk sending SMS to:", number);
					const response = await fetch(url, { method: "GET" });
					const responseText = await response.text();
					console.log(`Response for ${number}:`, responseText);

					const code = this.parseResponseCode(responseText);

					return {
						number,
						status:
							code === SMSErrorCode.SUCCESS
								? ("success" as const)
								: ("failed" as const),
						code,
						message: this.getErrorMessage(code),
					};
				})
			);

			// Process results
			const details = results.map((result, index) => {
				if (result.status === "fulfilled") {
					return result.value;
				} else {
					return {
						number: validNumbers[index],
						status: "failed" as const,
						code: SMSErrorCode.INTERNAL_ERROR,
						message: "Request failed",
					};
				}
			});

			const sent = details.filter((d) => d.status === "success").length;
			const failed = details.filter((d) => d.status === "failed").length;

			return {
				success: sent > 0,
				code: sent > 0 ? SMSErrorCode.SUCCESS : SMSErrorCode.INTERNAL_ERROR,
				message: `${sent}টি SMS পাঠানো হয়েছে, ${
					failed + invalidNumbers.length
				}টি ব্যর্থ`,
				data: {
					sent,
					failed: failed + invalidNumbers.length,
					details,
				},
			};
		} catch (error) {
			console.error("Bulk SMS error:", error);
			return {
				success: false,
				code: SMSErrorCode.INTERNAL_ERROR,
				message: "Bulk SMS পাঠাতে সমস্যা হয়েছে",
			};
		}
	}

	/**
	 * Check SMS account balance
	 */
	async checkBalance(): Promise<BalanceResponse> {
		try {
			const url = `${this.config.balanceApiUrl}?api_key=${this.config.apiKey}`;

			console.log("Checking balance at:", url);

			const response = await fetch(url, {
				method: "GET",
			});

			const responseText = await response.text();
			console.log("Balance API response:", responseText);

			// Try to parse as JSON first (new API format)
			try {
				const jsonResponse = JSON.parse(responseText);
				if (
					jsonResponse.response_code === 202 &&
					jsonResponse.balance !== undefined
				) {
					return {
						success: true,
						balance: parseFloat(jsonResponse.balance),
					};
				}
			} catch (e) {
				// Not JSON, try parsing as plain number (old format)
				const balance = parseFloat(responseText.trim());
				if (!isNaN(balance)) {
					return {
						success: true,
						balance,
					};
				}
			}

			return {
				success: false,
				message: "Balance পাওয়া যায়নি",
			};
		} catch (error) {
			console.error("Balance check error:", error);
			return {
				success: false,
				message: "Balance check করতে সমস্যা হয়েছে",
			};
		}
	}
}

// Export singleton instance
export const smsService = new SMSService();
