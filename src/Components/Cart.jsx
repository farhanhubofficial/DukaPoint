import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, addItemToCart, clearCartItems } from '../Store/Api/CartSlice';
import { auth, db } from '../firebase-config'; // Import Firebase auth and Firestore
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore methods

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

  const handleOrder = async () => {
    setOrderStatus('Processing...');

    try {
      const orderPromises = items.map(async (item) => {
        // Calculate totalSellingPrice and totalBuyingPrice
        const totalSellingPrice = item.sellingPrice * item.size;
        const totalBuyingPrice = item.buyingPrice * item.size;

        // Use the item's id as the document ID in the "orders" collection
        const orderRef = doc(db, 'orders', item.id);

        // Use setDoc to explicitly set the document with the cart item's ID
        await setDoc(orderRef, {
          ...item,
          totalSellingPrice, // Add the calculated totalSellingPrice
          totalBuyingPrice,  // Add the calculated totalBuyingPrice
          displayName,
          email,
          createdAt: new Date(), // Optionally, you can add a timestamp
        });

        return { id: item.id, ...item }; // Return the item ID along with the item details
      });

      // Wait for all items to be added to Firestore and collect their IDs
      const ordersWithIds = await Promise.all(orderPromises);

      // Optionally, you can do something with the ordersWithIds here
      console.log('Orders placed successfully:', ordersWithIds);

      // Clear the cart after successful order placement
      dispatch(clearCartItems());
      setOrderStatus('Order Confirmed');
    } catch (error) {
      console.error('Error placing order: ', error);
      setOrderStatus('Order Failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Your Cart</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover mb-4 rounded" />
              <div className="text-center">
                <h2 className="font-bold text-xl text-gray-800">{item.name}</h2>
                <p className="text-gray-600">Price: <span className="font-semibold">ksh {item.sellingPrice}</span></p>
                <p className="text-gray-600">Size: <span className="font-semibold">ksh {item.size}</span></p>
                <p className="text-gray-600">Total: <span className="font-semibold">ksh {item.size * item.sellingPrice}</span></p>
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
