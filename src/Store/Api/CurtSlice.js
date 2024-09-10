import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Base_URL = "http://localhost:3002";

export const curtainSlice = createApi({
  // Setup
  reducerPath: "CurtainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Base_URL
  }),
  tagTypes: ['Curtain'],
  
  // Endpoints
  endpoints: (builder) => ({
    fetchCurtains: builder.query({
      query: () => {
        return {
          url: "TotalCurtains",
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? // Successful query
            [...result.map(({ id }) => ({ type: 'Curtain', id })), 'Curtain']
          : // Error
            ['Curtain'],
    }),

    addCurtain: builder.mutation({
      query: (newCurtain) => ({
        url: "TotalCurtains",
        method: "POST",
        body: newCurtain,
      }),
      invalidatesTags: ['Curtain'],
    }),

    editCurtain: builder.mutation({
      query: ({ id, ...updatedCurtain }) => ({
        url: `TotalCurtains/${id}`, // Assuming your API uses /TotalCurtains/:id for individual curtains
        method: "PATCH", // or "PUT", depending on your API
        body: updatedCurtain,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Curtain', id }],
    }),

    deleteCurtain: builder.mutation({
      query: (id) => ({
        url: `TotalCurtains/${id}`, // Assuming your API uses /TotalCurtains/:id for deleting curtains
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Curtain', id }],
    }),
  }),
});

export const {
  useFetchCurtainsQuery,
  useAddCurtainMutation,
  useEditCurtainMutation,
  useDeleteCurtainMutation, // Export the delete hook
} = curtainSlice;

export default curtainSlice.reducer;
