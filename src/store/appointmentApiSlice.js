import { apiSlice } from "./apiSlice";

export const appointmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: () => "/appointments",
      providesTags: ["Appointment"],
    }),
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "/appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/appointments/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Appointment", "Analytics"],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
} = appointmentApiSlice;
