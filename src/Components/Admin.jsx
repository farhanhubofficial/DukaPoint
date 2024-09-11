import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Admin() {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items); // Get orders from Redux store

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="flex flex-col gap-4">
          <li>
            <button
              className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/AdminCurtainsPage')}
            >
              Curtains
            </button>
          </li>
          <li>
            <button
              className="w-full text-left bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/AdminShearsPage')}
            >
              Shears
            </button>
          </li>
          <li>
            <button
              className="w-full text-left bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/AdminPillowsPage')}
            >
              Pillows
            </button>
          </li>
          <li>
            <button
              className="w-full text-left bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/AdminCarpetsPage')}
            >
              Carpets
            </button>
          </li>
          <li>
            <button
              className="w-full text-left bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/AdminDuvetsPage')}
            >
              Duvets
            </button>
          </li>
          <li className="relative">
            <button
              className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/orders')}
            >
              Orders
            </button>
            {/* Badge for available orders */}
            {orders.length > 0 && (
              <span className="absolute top-0 right-0 bg-green-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                {orders.length}
              </span>
            )}
          </li>
          {/* New Manage Sales Button */}
          <li>
            <button
              className="w-full text-left bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/ManageSalesPage')}
            >
              Manage Sales
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-start bg-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Page</h1>

        {/* Sales Info Section */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300">
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Sales</h3>
              <p className="text-2xl">100</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Purchases</h3>
              <p className="text-2xl">50</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Profit</h3>
              <p className="text-2xl">$2000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
