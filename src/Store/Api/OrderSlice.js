import { createSlice } from '@reduxjs/toolkit';

const loadOrdersFromLocalStorage = () => {
  const savedOrders = localStorage.getItem('orders');
  return savedOrders ? JSON.parse(savedOrders) : [];
};

const saveOrdersToLocalStorage = (orders) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: loadOrdersFromLocalStorage(), // Load initial orders from local storage
    orderConfirmed: false,
  },
  reducers: {
    addOrder: (state, action) => {
      state.items.push(action.payload);
      saveOrdersToLocalStorage(state.items); // Save updated items to local storage
    },
    confirmOrder: (state) => {
      state.orderConfirmed = true;
    },
    clearOrder(state, action) {
      const { id, email } = action.payload;
      state.items = state.items.filter(order => order.id !== id || order.email !== email);
      saveOrdersToLocalStorage(state.items); // Correctly save the updated orders to localStorage
    },
  },
});

export const { addOrder, clearOrder, confirmOrder } = orderSlice.actions;
export default orderSlice.reducer;
