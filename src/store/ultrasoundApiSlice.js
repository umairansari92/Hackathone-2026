import { apiSlice } from "./apiSlice";

export const ultrasoundApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUltrasounds: builder.query({
      query: (params = {}) => ({
        url: "/ultrasound",
        params,
      }),
      providesTags: ["Ultrasound"],
    }),
    getUltrasoundById: builder.query({
      query: (id) => `/ultrasound/${id}`,
      providesTags: (result, error, id) => [{ type: "Ultrasound", id }],
    }),
    getUltrasoundStats: builder.query({
      query: () => "/ultrasound/stats",
      providesTags: ["Ultrasound"],
    }),
    createUltrasound: builder.mutation({
      query: (data) => ({
        url: "/ultrasound",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ultrasound"],
    }),
    updateUltrasound: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/ultrasound/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Ultrasound",
        { type: "Ultrasound", id },
      ],
    }),
  }),
});

export const {
  useGetUltrasoundsQuery,
  useGetUltrasoundByIdQuery,
  useGetUltrasoundStatsQuery,
  useCreateUltrasoundMutation,
  useUpdateUltrasoundMutation,
} = ultrasoundApiSlice;
