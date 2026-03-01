import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (role) => (role ? `/users?role=${role}` : "/users"),
      providesTags: ["Users"],
    }),
    createDoctor: builder.mutation({
      query: (data) => ({ url: "/users/doctor", method: "POST", body: data }),
      invalidatesTags: ["Users"],
    }),
    createReceptionist: builder.mutation({
      query: (data) => ({
        url: "/users/receptionist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
    updateSubscription: builder.mutation({
      query: ({ id, subscriptionPlan }) => ({
        url: `/users/${id}/subscription`,
        method: "PUT",
        body: { subscriptionPlan },
      }),
      invalidatesTags: ["Users"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateDoctorMutation,
  useCreateReceptionistMutation,
  useDeleteUserMutation,
  useUpdateSubscriptionMutation,
  useUpdateUserRoleMutation,
} = userApiSlice;
