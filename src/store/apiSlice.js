import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Auto-logout when backend returns 401 (expired / deleted user token)
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Clear stale user from localStorage and Redux
    localStorage.removeItem("user");
    // Redirect to login
    window.location.href = "/login";
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Users",
    "Patient",
    "Appointment",
    "Prescription",
    "Analytics",
    "AI",
    "Diagnosis",
    "Token",
    "Schedule",
  ],
  endpoints: (builder) => ({}),
});
