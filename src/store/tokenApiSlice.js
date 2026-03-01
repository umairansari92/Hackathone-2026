import { apiSlice } from "./apiSlice";

export const tokenApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceptionistDashboard: builder.query({
      query: () => "/tokens/dashboard",
      providesTags: ["Token"],
    }),
    getTodayQueue: builder.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.doctorId) q.set("doctorId", params.doctorId);
        if (params.date) q.set("date", params.date);
        return `/tokens/queue?${q.toString()}`;
      },
      providesTags: ["Token"],
    }),
    generateToken: builder.mutation({
      query: (data) => ({
        url: "/tokens/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token"],
    }),
    updateTokenStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tokens/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Token"],
    }),
    callNextPatient: builder.mutation({
      query: (data) => ({
        url: "/tokens/call-next",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token"],
    }),
    resetTokens: builder.mutation({
      query: (data) => ({ url: "/tokens/reset", method: "POST", body: data }),
      invalidatesTags: ["Token"],
    }),
  }),
});

export const {
  useGetReceptionistDashboardQuery,
  useGetTodayQueueQuery,
  useGenerateTokenMutation,
  useUpdateTokenStatusMutation,
  useCallNextPatientMutation,
  useResetTokensMutation,
} = tokenApiSlice;
