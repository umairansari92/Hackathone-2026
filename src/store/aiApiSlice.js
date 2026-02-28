import { apiSlice } from "./apiSlice";

export const aiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSmartDiagnosis: builder.mutation({
      query: (data) => ({
        url: "/ai/diagnosis",
        method: "POST",
        body: data,
      }),
    }),
    explainPrescription: builder.mutation({
      query: (data) => ({
        url: "/ai/explain-prescription",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetSmartDiagnosisMutation, useExplainPrescriptionMutation } =
  aiApiSlice;
