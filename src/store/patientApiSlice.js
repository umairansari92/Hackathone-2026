import { apiSlice } from "./apiSlice";

export const patientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => "/patients",
      providesTags: ["Patient"],
    }),
  }),
});

export const { useGetPatientsQuery } = patientApiSlice;
