import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for the API
const losses_URL = "http://localhost:3002";

// Create the profit slice using RTK Query
export const lossSlice = createApi({
  reducerPath: 'LossApi',
  baseQuery: fetchBaseQuery({
    baseUrl: losses_URL,
  }),
  tagTypes: ['Loss'],

  // Endpoints for profits
  endpoints: (builder) => ({
    fetchLosses: builder.query({
      query: () => ({
        url: 'losses',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Losses', id })), 'Losses']
          : ['Losses'],
    }),

    addLoss: builder.mutation({
      query: (newLoss) => ({
        url: 'losses',
        method: 'POST',
        body: newLoss,
      }),
      invalidatesTags: ['Loss'],
    }),

    editLoss: builder.mutation({
      query: ({ id, ...updateLoss }) => ({
        url: `profits/${id}`,
        method: 'PATCH', // or PUT based on your API
        body: updatedLoss,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Loss', id }],
    }),

    deleteLoss: builder.mutation({
      query: (id) => ({
        url: `losses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Losses', id }],
    }),
  }),
});

// Export hooks for the profit endpoints
export const {
  useFetchLossesQuery,
  useAddLossMutation,
  useEditLossMutation,
  useDeleteLossMutation
} = lossSlice;

export default lossSlice.reducer;
