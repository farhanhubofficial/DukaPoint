import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearOrder } from '../Store/Api/OrderSlice';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import { useEditCurtainMutation } from '../Store/Api/CurtSlice';

function Orders() {
  const { data: allcurtains = [] } = useFetchCurtainsQuery();
  const orders = useSelector((state) => state.orders.items);
  const dispatch = useDispatch();
  const [updateCurtain] = useEditCurtainMutation();

  const handleConfirmSale = async (id, size, email) => {
    const decItem = allcurtains.find((item) => item.id === id);

    if (decItem) {
      const updatedItem = {
        ...decItem,
        size: decItem.size - size,
      };

      // Update the curtain stock in Firestore
      await updateCurtain(updatedItem);
    }

    // Clear the order after confirmation using both id and email
    dispatch(clearOrder({ id, email }));
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
              <button
                onClick={() => handleConfirmSale(order.id, order.size, order.email)}
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
