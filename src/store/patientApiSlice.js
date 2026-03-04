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

    // NEW: Search by UID / phone / name
    searchPatients: builder.query({
      query: (q) => `/patients/search?q=${q}`,
      providesTags: ["Patient"],
    }),

    // NEW: Get patient by UID
    getPatientByUID: builder.query({
      query: (uid) => `/patients/uid/${uid}`,
      providesTags: ["Patient"],
    }),

    // NEW: Get full history (visits + labs + pharmacy + prescriptions)
    getPatientHistory: builder.query({
      query: (id) => `/patients/${id}/history`,
      providesTags: (_r, _e, id) => [{ type: "Patient", id }, "Visit"],
    }),

    // NEW: Create patient with full profile
    createPatient: builder.mutation({
      query: (data) => ({
        url: "/patients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Patient"],
    }),

    // NEW: Update patient
    updatePatient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Patient"],
    }),

    // NEW: Delete patient
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
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
  useSearchPatientsQuery,
  useGetPatientByUIDQuery,
  useGetPatientHistoryQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApiSlice;
