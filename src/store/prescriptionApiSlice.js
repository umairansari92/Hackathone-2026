import { apiSlice } from "./apiSlice";

export const prescriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query({
      query: () => "/prescriptions",
      providesTags: ["Prescription"],
    }),
    createPrescription: builder.mutation({
      query: (data) => ({
        url: "/prescriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Prescription", "Analytics"],
    }),
    getPrescriptionById: builder.query({
      query: (id) => `/prescriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Prescription", id }],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useCreatePrescriptionMutation,
  useGetPrescriptionByIdQuery,
} = prescriptionApiSlice;
