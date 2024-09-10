import { createSlice } from '@reduxjs/toolkit';

// Helper function to load cart items from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      return JSON.parse(savedCartItems); // Parse the saved items
    }
  } catch (error) {
    console.error('Failed to load cart items from localStorage:', error);
  }
  return []; // Return an empty array if no saved items
};

const initialState = {
  items: loadCartFromLocalStorage(), // Initialize cart items from localStorage
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;
      const findItem = state.items.find((i) => i.id === item.id);

      if (!findItem) {
        state.items.push({ ...item, quantity: 1 });
      }

      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItemFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    incrementItemQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.quantity += 1;
      }

      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    decrementItemQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }

      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCartItems:(state)=> {
      state.items = []; // Clear items from the Redux store
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  incrementItemQuantity,
  decrementItemQuantity,
  clearCartItems
} = cartSlice.actions;

export default cartSlice.reducer;
