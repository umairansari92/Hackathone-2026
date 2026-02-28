import { apiSlice } from "./apiSlice";

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => "/analytics/stats",
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetStatsQuery } = analyticsApiSlice;
