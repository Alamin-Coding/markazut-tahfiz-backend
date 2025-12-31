// SMS Types for BulkSMSBD.net Integration

export interface SMSConfig {
	apiKey: string;
	senderId: string;
	apiUrl: string;
	balanceApiUrl: string;
}

export interface SendSMSRequest {
	number: string; // Single number or comma-separated numbers
	title?: string; // Optional title to prepend to message
	message: string;
	type?: "text" | "unicode"; // text for English, unicode for Bengali
}

export interface BulkSMSRequest {
	numbers: string[]; // Array of phone numbers
	title?: string;
	message: string;
	type?: "text" | "unicode";
}

export interface SMSResponse {
	success: boolean;
	code: number;
	message: string;
	data?: {
		sent?: number;
		failed?: number;
		details?: Array<{
			number: string;
			status: "success" | "failed";
			code: number;
			message: string;
		}>;
	};
}

export interface BalanceResponse {
	success: boolean;
	balance?: number;
	message?: string;
}

// BulkSMSBD Error Codes
export enum SMSErrorCode {
	SUCCESS = 202,
	INVALID_NUMBER = 1001,
	INVALID_SENDER_ID = 1002,
	REQUIRED_FIELDS_MISSING = 1003,
	INTERNAL_ERROR = 1005,
	BALANCE_VALIDITY_NOT_AVAILABLE = 1006,
	INSUFFICIENT_BALANCE = 1007,
	USER_NOT_FOUND = 1011,
	MASKING_MUST_BE_BENGALI = 1012,
	SENDER_ID_NO_GATEWAY = 1013,
	SENDER_TYPE_NOT_FOUND = 1014,
	SENDER_ID_NO_VALID_GATEWAY = 1015,
	SENDER_TYPE_PRICE_NOT_FOUND = 1016,
	SENDER_TYPE_PRICE_INFO_NOT_FOUND = 1017,
	ACCOUNT_DISABLED = 1018,
	SENDER_TYPE_PRICE_DISABLED = 1019,
	PARENT_NOT_FOUND = 1020,
	PARENT_PRICE_NOT_FOUND = 1021,
	ACCOUNT_NOT_VERIFIED = 1031,
	IP_NOT_WHITELISTED = 1032,
}

export const SMS_ERROR_MESSAGES: Record<number, string> = {
	[SMSErrorCode.SUCCESS]: "SMS পাঠানো হয়েছে",
	[SMSErrorCode.INVALID_NUMBER]: "ভুল ফোন নম্বর",
	[SMSErrorCode.INVALID_SENDER_ID]: "Sender ID সঠিক নয়",
	[SMSErrorCode.REQUIRED_FIELDS_MISSING]: "সব তথ্য দিন",
	[SMSErrorCode.INTERNAL_ERROR]: "Internal Error",
	[SMSErrorCode.BALANCE_VALIDITY_NOT_AVAILABLE]: "Balance validity নেই",
	[SMSErrorCode.INSUFFICIENT_BALANCE]: "পর্যাপ্ত balance নেই",
	[SMSErrorCode.USER_NOT_FOUND]: "User পাওয়া যায়নি",
	[SMSErrorCode.MASKING_MUST_BE_BENGALI]: "Masking SMS বাংলায় পাঠাতে হবে",
	[SMSErrorCode.SENDER_ID_NO_GATEWAY]: "Sender ID এর gateway নেই",
	[SMSErrorCode.SENDER_TYPE_NOT_FOUND]: "Sender type পাওয়া যায়নি",
	[SMSErrorCode.SENDER_ID_NO_VALID_GATEWAY]: "Valid gateway নেই",
	[SMSErrorCode.SENDER_TYPE_PRICE_NOT_FOUND]: "Sender type price পাওয়া যায়নি",
	[SMSErrorCode.SENDER_TYPE_PRICE_INFO_NOT_FOUND]: "Price info পাওয়া যায়নি",
	[SMSErrorCode.ACCOUNT_DISABLED]: "Account disabled",
	[SMSErrorCode.SENDER_TYPE_PRICE_DISABLED]: "Sender type price disabled",
	[SMSErrorCode.PARENT_NOT_FOUND]: "Parent account পাওয়া যায়নি",
	[SMSErrorCode.PARENT_PRICE_NOT_FOUND]: "Parent price পাওয়া যায়নি",
	[SMSErrorCode.ACCOUNT_NOT_VERIFIED]: "Account verified নয়",
	[SMSErrorCode.IP_NOT_WHITELISTED]: "IP whitelisted নয়",
};
