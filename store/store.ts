import { configureStore } from "@reduxjs/toolkit";
import { noticeApi } from "../features/notice/notice-api";
import { faqApi } from "../features/notice/faq-api";

export const store = configureStore({
	reducer: {
		[noticeApi.reducerPath]: noticeApi.reducer,
		[faqApi.reducerPath]: faqApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(noticeApi.middleware)
			.concat(faqApi.middleware),
});
