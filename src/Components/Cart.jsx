import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, addItemToCart, clearCartItems } from '../Store/Api/CartSlice';
import { addOrder } from '../Store/Api/OrderSlice';
import { auth } from '../firebase-config'; // Import Firebase auth

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const [orderStatus, setOrderStatus] = useState('');

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (savedCartItems) {
      savedCartItems.forEach((item) => {
        dispatch(addItemToCart(item));
      });
    }
  }, [dispatch]);


  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  // Get the current user
  const user = auth.currentUser;
  const displayName = user?.displayName;
  const email = user?.email;

  const handleRemove = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleOrder = () => {
    setOrderStatus('Processing...');
    items.forEach((item) => {
      // Dispatch order with user's displayName and email
      dispatch(addOrder({ ...item, displayName, email }));
    });
    dispatch(clearCartItems())
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Your Cart</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mb-4 rounded" />
              <div className="text-center">
                <h2 className="font-bold text-xl text-gray-800">{item.name}</h2>
                <p className="text-gray-600">Price: <span className="font-semibold">ksh {item.price}</span></p>
                <p className="text-gray-600">Size: <span className="font-semibold">ksh {item.size}</span></p>
                <p className="text-gray-600">Total: <span className="font-semibold">ksh {item.size * item.price}</span></p>
                <button onClick={() => handleRemove(item.id)} className="mt-2 bg-red-500 text-white h-8 w-full rounded-lg hover:bg-red-600">
                  Remove
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-3">Your cart is empty.</p>
        )}
      </ul>
      {items.length > 0 && (
        <div className="mt-8 border-t border-gray-300 pt-6 text-center">
          <button onClick={handleOrder} className="mt-4 bg-blue-600 text-white h-10 w-32 rounded-lg hover:bg-blue-700">
            {orderStatus || 'Order'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
