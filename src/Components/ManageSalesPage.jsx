import React from 'react';

function ManageSalesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Recording Sales</h1>
      <p className="text-lg mb-6">Here, you can record and track your sales data for various categories.</p>

      {/* Buttons for different categories */}
      <div className="grid grid-cols-2 gap-6">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
          Curtains Sales
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
          Shears Sales
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
          Pillows Sales
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
          Carpets Sales
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
          Duvets Sales
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
          Other Sales
        </button>
      </div>
    </div>
  );
}

export default ManageSalesPage;
