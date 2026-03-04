import { apiSlice } from "./apiSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccountEntries: builder.query({
      query: (params = {}) => ({
        url: "/accounts",
        params,
      }),
      providesTags: ["Account"],
    }),
    getAccountSummary: builder.query({
      query: (params = {}) => ({
        url: "/accounts/summary",
        params,
      }),
      providesTags: ["Account"],
    }),
    createAccountEntry: builder.mutation({
      query: (data) => ({
        url: "/accounts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),
    deleteAccountEntry: builder.mutation({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const {
  useGetAccountEntriesQuery,
  useGetAccountSummaryQuery,
  useCreateAccountEntryMutation,
  useDeleteAccountEntryMutation,
} = accountApiSlice;
