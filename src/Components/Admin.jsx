import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Admin() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
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
          <li>
            <button
              className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/orders')}
            >
              Orders
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center bg-gray-200">
        <h1 className="text-3xl font-bold">Admin Page</h1>
      </div>
    </div>
  );
}

export default Admin;
