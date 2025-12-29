import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../../lib/frontend/env";

export const noticeApi = createApi({
	reducerPath: "noticeApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${env.apiUrl}/api` }),
	endpoints: (builder) => ({
		getNotices: builder.query<any, void>({
			query: () => "/notice",
		}),
	}),
});

export const { useGetNoticesQuery } = noticeApi;
