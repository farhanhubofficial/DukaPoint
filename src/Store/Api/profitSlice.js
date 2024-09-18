import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for the API
const Profits_URL = "http://localhost:3002";

// Create the profit slice using RTK Query
export const profitSlice = createApi({
  reducerPath: 'ProfitApi',
  baseQuery: fetchBaseQuery({
    baseUrl: Profits_URL,
  }),
  tagTypes: ['Profit'],

  // Endpoints for profits
  endpoints: (builder) => ({
    fetchProfits: builder.query({
      query: () => ({
        url: 'profits',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Profit', id })), 'Profit']
          : ['Profit'],
    }),

    addProfit: builder.mutation({
      query: (newProfit) => ({
        url: 'profits',
        method: 'POST',
        body: newProfit,
      }),
      invalidatesTags: ['Profit'],
    }),

    editProfit: builder.mutation({
      query: ({ id, ...updatedProfit }) => ({
        url: `profits/${id}`,
        method: 'PATCH', // or PUT based on your API
        body: updatedProfit,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Profit', id }],
    }),

    deleteProfit: builder.mutation({
      query: (id) => ({
        url: `profits/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Profit', id }],
    }),
  }),
});

// Export hooks for the profit endpoints
export const {
  useFetchProfitsQuery,
  useAddProfitMutation,
  useEditProfitMutation,
  useDeleteProfitMutation,
} = profitSlice;

export default profitSlice.reducer;
