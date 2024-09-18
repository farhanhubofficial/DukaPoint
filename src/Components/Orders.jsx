import React, { useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { clearOrder } from '../Store/Api/OrderSlice';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import { useEditCurtainMutation } from '../Store/Api/CurtSlice';
import { useAddSaleMutation } from '../Store/Api/salesSlice'; // Use mutation from RTK Query
import { useAddProfitMutation } from '../Store/Api/profitSlice';
import { useAddLossMutation, useFetchLossesQuery } from '../Store/Api/lossesSlice'; // Use mutation from RTK Query for losses
import { formatDistanceToNow } from 'date-fns'; // For time formatting

function Orders() {
  const [addSale] = useAddSaleMutation(); // Mutation hook for adding sale
  const [addProfit] = useAddProfitMutation(); // Mutation hook for adding profit
  const [addLoss] = useAddLossMutation(); // Mutation hook for adding loss
  const { data: allcurtains = [] } = useFetchCurtainsQuery();
  
  const orders = useSelector((state) => state.orders.items);
  const dispatch = useDispatch();
  const [updateCurtain] = useEditCurtainMutation(); // Mutation hook for editing curtain

  // State to track selling prices for each order
  const [sellingPrices, setSellingPrices] = useState({});

  const handleConfirmSale = async (id, size, email, order) => {
    const decItem = allcurtains.find((item) => item.id === id);

    if (decItem) {
      const updatedItem = {
        ...decItem,
        size: decItem.size - size, // Update curtain stock
      };

      // Update the curtain stock in Firestore
      await updateCurtain({ id, ...updatedItem });
    }

    // Get the selling price for this order
    const sellingPrice = parseFloat(sellingPrices[id] || 0); // Fallback to 0 if not provided
    const orderSize = parseFloat(order.order.size || 0); // Fallback to 0 if not valid

    // Calculate total cost
    const totalCost = orderSize * parseFloat(order.order.price || 0); // Fallback to 0 if not valid

    // Validate inputs to avoid NaN
    if (isNaN(totalCost) || isNaN(sellingPrice)) {
      console.error('Invalid selling price or order size. Please check your input.');
      return; // Exit the function if inputs are invalid
    }

    // Calculate the profit
    const profit = sellingPrice - totalCost;

    console.log("Profit/Loss calculated:", profit);
    const currentDate = new Date();

    // Capture the current time when the button is clicked
    const timeCreated = currentDate.toISOString(); // ISO format for the exact time

    // Calculate the relative "time ago" format (like "3 mins ago")
    const timeAgo = formatDistanceToNow(currentDate, { addSuffix: true });

    // Add sale to the database via RTK Query
    await addSale({
      id,
      name: decItem.name,
      size,
      sellingPrice,
      email,
      timeCreated, // Exact timestamp
      timeAgo,     // How long ago the sale was confirmed
    });

    // If profit is positive, add to profits slice
    if (profit > 0) {
      await addProfit({
        id,
        profit,
        email, // For reference, you can include any necessary metadata
      });
    } 
    // If profit is negative, add to losses slice
    else if (profit < 0) {
      await addLoss({
        id,
        loss: Math.abs(profit), // Store the absolute value of the loss
        email, // For reference
      });
    }

    // Clear the order after confirmation using both id and email
    dispatch(clearOrder({ id, email }));
  };

  // Handle change in selling price input
  const handleSellingPriceChange = (id, value) => {
    setSellingPrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order, index) => (
            <li key={index} className="mb-4 p-4 border border-gray-300 rounded">
              <div className="p-4 text-right">
                <p className="font-bold text-gray-800">User: {order.displayName}</p>
                <p className="text-gray-600">Email: {order.email}</p>
              </div>
              <h2 className="font-bold text-gray-800">{order.name}</h2>
              <p>Price: ksh {order.price}</p>
              <p>Size: {order.size}</p>
              <p>Total: ksh {order.size * order.price}</p>

              {/* Input field for selling price */}
              <div className="flex items-center mt-2">
                <label className="text-gray-700 mr-2">Selling Price (ksh):</label>
                <input
                  type="number"
                  value={sellingPrices[order.id] || ''} // Ensure the input shows the correct value
                  onChange={(e) => handleSellingPriceChange(order.id, e.target.value)}
                  placeholder="Enter selling price"
                  className="w-32 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <button
                onClick={() => handleConfirmSale(order.id, order.size, order.email, { order })}
                className="mt-4 bg-green-600 text-white h-10 w-32 rounded-lg hover:bg-green-700"
              >
                Confirm Order
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No orders placed.</p>
      )}
    </div>
  );
}

export default Orders;
