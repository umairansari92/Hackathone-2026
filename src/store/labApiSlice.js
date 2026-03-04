import { apiSlice } from "./apiSlice";

export const labApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLabTests: builder.query({
      query: (params = {}) => ({
        url: "/lab",
        params,
      }),
      providesTags: ["LabTest"],
    }),
    getLabTestById: builder.query({
      query: (id) => `/lab/${id}`,
      providesTags: (result, error, id) => [{ type: "LabTest", id }],
    }),
    getLabStats: builder.query({
      query: () => "/lab/stats",
      providesTags: ["LabTest"],
    }),
    createLabTest: builder.mutation({
      query: (data) => ({
        url: "/lab",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LabTest"],
    }),
    updateLabTest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/lab/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "LabTest",
        { type: "LabTest", id },
      ],
    }),
  }),
});

export const {
  useGetLabTestsQuery,
  useGetLabTestByIdQuery,
  useGetLabStatsQuery,
  useCreateLabTestMutation,
  useUpdateLabTestMutation,
} = labApiSlice;
