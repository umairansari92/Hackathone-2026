import { apiSlice } from "./apiSlice";

const VISITS_URL = "/api/visits";

const visitApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all visits (filterable by patientId, doctorId, status)
    getVisits: builder.query({
      query: (params = {}) => ({
        url: VISITS_URL,
        params,
      }),
      providesTags: ["Visit"],
    }),

    // Get visits by patient ID (enriched with lab/pharmacy/prescriptions)
    getVisitsByPatient: builder.query({
      query: (patientId) => `${VISITS_URL}/patient/${patientId}`,
      providesTags: (_result, _err, patientId) => [
        { type: "Visit", id: patientId },
      ],
    }),

    // Get single visit with all linked records
    getVisitById: builder.query({
      query: (id) => `${VISITS_URL}/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Visit", id }],
    }),

    // Create new visit (reception books appointment)
    createVisit: builder.mutation({
      query: (body) => ({
        url: VISITS_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visit"],
    }),

    // Update visit (doctor adds diagnosis/notes)
    updateVisit: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${VISITS_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Visit", id },
        "Visit",
      ],
    }),
  }),
});

export const {
  useGetVisitsQuery,
  useGetVisitsByPatientQuery,
  useGetVisitByIdQuery,
  useCreateVisitMutation,
  useUpdateVisitMutation,
} = visitApiSlice;
