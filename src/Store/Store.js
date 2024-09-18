import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Api/CartSlice';
import { curtainSlice } from './Api/CurtSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import OrderReducer from './Api/OrderSlice';
import profitsReducer from './Api/profitSlice';
import { salesSlice } from './Api/salesSlice';
import {profitSlice} from './Api/profitSlice' // Corrected import
import {lossSlice} from './Api/lossesSlice'
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: OrderReducer,
    profits: profitsReducer,
    losses: lossSlice,

    [curtainSlice.reducerPath]: curtainSlice.reducer,  // Curtain API slice
    [salesSlice.reducerPath]: salesSlice.reducer,
    [profitSlice.reducerPath]: profitSlice.reducer,
    [lossSlice.reducerPath]:  lossSlice.reducer,     // Sales API slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(curtainSlice.middleware) // Add curtainSlice middleware
      .concat(salesSlice.middleware)
      .concat(profitSlice.middleware)
      .concat(lossSlice.middleware),  // Add salesSlice middleware
});

// Enable refetching on focus/internet reconnect
setupListeners(store.dispatch);
