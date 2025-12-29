import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../lib/frontend/env";
import type { Faq, FaqResponse } from "../../types/frontend";

export const faqApi = createApi({
	reducerPath: "faqApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${env.apiUrl}/api` }),
	endpoints: (builder) => ({
		getFaqs: builder.query<FaqResponse, void>({
			query: () => "/faq",
		}),
	}),
});

export const { useGetFaqsQuery } = faqApi;
