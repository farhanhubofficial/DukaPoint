// src/Store/store.js

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Api/CartSlice';
import { curtainSlice } from './Api/CurtSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import OrderReducer from './Api/OrderSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: OrderReducer, // Add orders reducer
    

    [curtainSlice.reducerPath]: curtainSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(curtainSlice.middleware),
});

setupListeners(store.dispatch);
console.log(cartReducer)