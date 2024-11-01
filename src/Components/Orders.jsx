import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, deleteDoc, doc, setDoc, updateDoc, onSnapshot, addDoc } from 'firebase/firestore';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [sellingPrices, setSellingPrices] = useState({});
  const [calcInput, setCalcInput] = useState(""); // State for calculator input
  const [calcResult, setCalcResult] = useState(0); // State for calculator result

  // Fetch orders from Firestore using snapshot listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (orderSnapshot) => {
      const ordersList = orderSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersList);
    }, (error) => {
      console.error("Error fetching orders: ", error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Handle confirming the sale
 // Handle confirming the sale
// Handle confirming the sale
const handleConfirmSale = async (orderId, email) => {
  try {
      const orderToDelete = orders.find(order => order.id === orderId && order.email === email);

      if (!orderToDelete) {
          console.error(`Order with id ${orderId} and email ${email} not found.`);
          return;
      }

      const sellingPriceInput = sellingPrices[orderId];
      const currentSellingPrice = orderToDelete.totalSellingPrice;

      if (sellingPriceInput && sellingPriceInput !== currentSellingPrice.toString()) {
          alert(`You have entered a new total selling price but haven't set it yet for order ${orderId}. Please click "Set" first.`);
          return;
      }

      const orderRef = doc(db, 'orders', orderId);
      const sellingPrice = currentSellingPrice;
      const buyingPrice = orderToDelete.totalBuyingPrice; // Add buyingPrice here
      const profit = sellingPrice - buyingPrice;

      // Format timestamp
      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

      // Prepare sales data according to specified format
      const salesData = {
          imageUrl: orderToDelete.imageUrl,
          material: orderToDelete.material,
          name: orderToDelete.displayName,
          productId: orderToDelete.id, // Assuming order.id is the productId
          productName: orderToDelete.name,
          profitOrLoss: profit,
          saleId: Date.now(), // Unique sale ID based on current timestamp
          sellingPrice: sellingPrice, // Directly use the number
          buyingPrice: buyingPrice, // Include buying price
          size: orderToDelete.size,
          timestamp: timestamp,
      };

      const salesCollection = collection(db, 'sales');
      await addDoc(salesCollection, salesData);

      // Handle profit/loss entry
      if (profit > 0) {
          const profitsRef = doc(db, 'profits', `${orderId}_${Date.now()}`);
          await setDoc(profitsRef, {
              amount: profit,
              productName: orderToDelete.name,
              timestamp: timestamp,
          }, { merge: true });
      } else if (profit < 0) {
          const lossesRef = doc(db, 'losses', `${orderId}_${Date.now()}`);
          await setDoc(lossesRef, {
              amount: -profit,
              productName: orderToDelete.name,
              timestamp: timestamp,
          }, { merge: true });
      }

      // Delete the order after processing profit/loss
      await deleteDoc(orderRef);
  } catch (error) {
      console.error("Error confirming sale: ", error);
  }
};



  // Handle selling price input change
  const handleSellingPriceChange = (id, value) => {
    setSellingPrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle setting the total selling price
  const handleSetTotalSellingPrice = async (orderId) => {
    try {
      const sellingPrice = sellingPrices[orderId];

      if (sellingPrice !== undefined && sellingPrice !== "") {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
          totalSellingPrice: parseFloat(sellingPrice), // Update totalSellingPrice
        });
        // Optionally reset the input value
        setSellingPrices((prev) => ({
          ...prev,
          [orderId]: '', // Clear the input field after setting
        }));
      }
    } catch (error) {
      console.error("Error updating total selling price: ", error);
    }
  };

  // Safe evaluation of arithmetic expressions
  const safeEval = (expression) => {
    try {
      const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
      if (!sanitizedExpression) return ""; // Return empty string if the expression is invalid or incomplete
      return Function('"use strict";return (' + sanitizedExpression + ')')();
    } catch (error) {
      return calcResult; // Keep the last valid result instead of showing error
    }
  };

  // Handle calculator input change and evaluate the expression
  const handleCalcInput = (e) => {
    const value = e.target.value;
    setCalcInput(value);
    if (value) {
      const result = safeEval(value);
      setCalcResult(result);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300 relative">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Orders</h1>

      {orders.length > 0 ? (
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Calculator Section */}
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <div className="mt-6 p-4 border-t border-gray-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Simple Calculator</h3>
              <input
                type="text" // Input type as text to allow expressions
                value={calcInput}
                onChange={handleCalcInput}
                placeholder="Enter calculation (e.g., 3+3)"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 mb-4"
              />
              <p className="mt-4 font-bold text-lg">Result: {calcResult}</p>
              <button
                onClick={() => setCalcInput("")} // Only reset the input
                className="mt-4 bg-red-600 text-white h-10 w-32 rounded-lg hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:w-2/3">
            <ul>
              {orders.map((order, index) => (
                <li key={index} className="mb-4 p-4 border border-gray-300 rounded">
                  <div className="p-4 text-right">
                    <p className="font-bold text-gray-800">User: {order.displayName}</p>
                    <p className="text-gray-600">Email: {order.email}</p>
                  </div>
                  <h2 className="font-bold text-gray-800">{order.name}</h2>
                  <p>Selling Price: ksh {order.sellingPrice}</p>
                  <p>Size: {order.size}</p>
                  <p>Total Selling Price: ksh {order.totalSellingPrice}</p>
                  <p>Buying Price: ksh {order.buyingPrice}</p> {/* Display buying price for clarity */}
                  <p>id: {order.id}</p>

                  {/* Input for total selling price */}
                  <div className="flex items-center mt-2">
                    <label className="text-gray-700 mr-2">Enter Total Selling Price (ksh):</label>
                    <input
                      type="number"
                      value={sellingPrices[order.id] || ''}
                      onChange={(e) => handleSellingPriceChange(order.id, e.target.value)}
                      placeholder="Enter total selling price"
                      className="w-32 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button
                      onClick={() => handleSetTotalSellingPrice(order.id)} // Set total selling price
                      className="ml-2 bg-blue-600 text-white h-10 w-20 rounded-lg hover:bg-blue-700"
                    >
                      Set
                    </button>
                  </div>

                  <button
                    onClick={() => handleConfirmSale(order.id, order.email)}
                    className="mt-4 bg-green-600 text-white h-10 w-32 rounded-lg hover:bg-green-700"
                  >
                    Confirm Order
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center h-[50vh] text-gray-600">No orders placed.</p>
      )}
    </div>
  );
}

export default Orders;
