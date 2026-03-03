import { apiSlice } from "./apiSlice";

export const onboardingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Doctor Flow
    verifyInvite: builder.query({
      query: (token) => `/onboarding/doctor/verify-invite/${token}`,
    }),
    registerDoctor: builder.mutation({
      query: (formData) => ({
        url: "/onboarding/doctor/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User", "Patient"],
    }),

    // Admin Flow
    inviteDoctor: builder.mutation({
      query: (data) => ({
        url: "/onboarding/admin/invite",
        method: "POST",
        body: data,
      }),
    }),
    getPendingDoctors: builder.query({
      query: () => "/onboarding/admin/pending",
      providesTags: ["User"],
    }),
    approveDoctor: builder.mutation({
      query: (id) => ({
        url: `/onboarding/admin/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    rejectDoctor: builder.mutation({
      query: (id) => ({
        url: `/onboarding/admin/reject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useVerifyInviteQuery,
  useRegisterDoctorMutation,
  useInviteDoctorMutation,
  useGetPendingDoctorsQuery,
  useApproveDoctorMutation,
  useRejectDoctorMutation,
} = onboardingApiSlice;
