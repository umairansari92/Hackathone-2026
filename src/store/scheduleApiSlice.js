import { apiSlice } from "./apiSlice";

export const scheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchedules: builder.query({
      query: () => "/schedule",
      providesTags: ["Schedule"],
    }),
    getDoctorSchedule: builder.query({
      query: (doctorId) => `/schedule/${doctorId}`,
      providesTags: ["Schedule"],
    }),
    checkAvailability: builder.query({
      query: ({ doctorId, date }) =>
        `/schedule/${doctorId}/availability?date=${date}`,
      providesTags: ["Schedule"],
    }),
    upsertSchedule: builder.mutation({
      query: (data) => ({ url: "/schedule", method: "POST", body: data }),
      invalidatesTags: ["Schedule"],
    }),
    markLeave: builder.mutation({
      query: ({ doctorId, ...data }) => ({
        url: `/schedule/${doctorId}/leave`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Schedule"],
    }),
  }),
});

export const {
  useGetAllSchedulesQuery,
  useGetDoctorScheduleQuery,
  useCheckAvailabilityQuery,
  useUpsertScheduleMutation,
  useMarkLeaveMutation,
} = scheduleApiSlice;
