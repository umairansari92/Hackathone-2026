import { apiSlice } from "./apiSlice";

export const pharmacyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPharmacyRecords: builder.query({
      query: (params = {}) => ({
        url: "/pharmacy",
        params,
      }),
      providesTags: ["Pharmacy"],
    }),
    getPharmacyRecordById: builder.query({
      query: (id) => `/pharmacy/${id}`,
      providesTags: (result, error, id) => [{ type: "Pharmacy", id }],
    }),
    getPharmacyStats: builder.query({
      query: () => "/pharmacy/stats",
      providesTags: ["Pharmacy"],
    }),
    createPharmacyRecord: builder.mutation({
      query: (data) => ({
        url: "/pharmacy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pharmacy"],
    }),
    updateDispenseStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pharmacy/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Pharmacy",
        { type: "Pharmacy", id },
      ],
    }),
  }),
});

export const {
  useGetPharmacyRecordsQuery,
  useGetPharmacyRecordByIdQuery,
  useGetPharmacyStatsQuery,
  useCreatePharmacyRecordMutation,
  useUpdateDispenseStatusMutation,
} = pharmacyApiSlice;
