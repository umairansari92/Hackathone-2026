import { apiSlice } from "./apiSlice";

export const patientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Profile
    getMyProfile: builder.query({
      query: () => "/patient/profile",
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation({
      query: (formData) => ({
        url: "/patient/profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/patient/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    // Doctors
    getAvailableDoctors: builder.query({
      query: () => "/patient/doctors",
      providesTags: ["Schedule"],
    }),

    // Appointments
    getMyAppointments: builder.query({
      query: () => "/patient/my-appointments",
      providesTags: ["Appointment"],
    }),
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: "/patient/appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),
    cancelMyAppointment: builder.mutation({
      query: (id) => ({
        url: `/patient/appointments/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointment"],
    }),

    // Prescriptions
    getMyPrescriptions: builder.query({
      query: () => "/patient/my-prescriptions",
      providesTags: ["Prescription"],
    }),

    // Queue
    getMyQueueStatus: builder.query({
      query: () => "/patient/my-queue",
      providesTags: ["Token"],
    }),

    // Medical History
    getMedicalHistory: builder.query({
      query: () => "/patient/medical-history",
      providesTags: ["Appointment", "Prescription"],
    }),
    // General (for Admin/Doctor/Receptionist)
    getPatients: builder.query({
      query: () => "/patients",
      providesTags: ["Patient"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
  useGetAvailableDoctorsQuery,
  useGetMyAppointmentsQuery,
  useBookAppointmentMutation,
  useCancelMyAppointmentMutation,
  useGetMyPrescriptionsQuery,
  useGetMyQueueStatusQuery,
  useGetMedicalHistoryQuery,
  useGetPatientsQuery,
} = patientApiSlice;
