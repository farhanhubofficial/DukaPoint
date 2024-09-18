import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Sales_URL = "http://localhost:3002";

// Create the sales slice using RTK Query
export const salesSlice = createApi({
  reducerPath: "SalesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Sales_URL
  }),
  tagTypes: ['Sale'],

  // Endpoints for sales
  endpoints: (builder) => ({
    fetchSales: builder.query({
      query: () => ({
        url: "sales",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Sale', id })), 'Sale']
          : ['Sale'],
    }),

    addSale: builder.mutation({
      query: (newSale) => ({
        url: "sales",
        method: "POST",
        body: newSale,
      }),
      invalidatesTags: ['Sale'],
    }),

    editSale: builder.mutation({
      query: ({ id, ...updatedSale }) => ({
        url: `sales/${id}`,
        method: "PATCH", // or PUT based on your API
        body: updatedSale,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Sale', id }],
    }),

    deleteSale: builder.mutation({
      query: (id) => ({
        url: `sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Sale', id }],
    }),
  }),
});

// Export hooks for the sales endpoints
export const {
  useFetchSalesQuery,
  useAddSaleMutation,
  useEditSaleMutation,
  useDeleteSaleMutation,
} = salesSlice;

export default salesSlice.reducer;
