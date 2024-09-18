import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchSalesQuery } from '../Store/Api/salesSlice';
import { useFetchProfitsQuery } from '../Store/Api/profitSlice'; // Import the fetchSales query
import { useFetchLossesQuery } from '../Store/Api/lossesSlice';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import Users from './Users';
import CurtainTile from './CurtainTile';
function Admin() {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items); 
  // const profits = useSelector((state) => state.profits.totalProfit);
  const { data: sales = [] } = useFetchSalesQuery(); 
  const {data: profits =[]} = useFetchProfitsQuery()// Fetch sales from Redux API
  const {data : losses =[]} =useFetchLossesQuery()
  const {data:allcurtains = []} = useFetchCurtainsQuery()
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0)
  const [TotalLoss, setTotalLoss] = useState(0)


  const [search, setSearch] = useState(""); // Search input state
  const [filteredCurtains, setFilteredCurtains] = useState([]); // Filtered curtains state
  const [selectedCurtain, setSelectedCurtain] = useState(null)
  // Calculate total sales from the sales data
  useEffect(() => {
    const total = sales.reduce((acc, sale) => acc + parseFloat(sale.sellingPrice || 0), 0);
    setTotalSales(total);
    const totalProfit = profits.reduce((acc, profit)=> acc + parseFloat(profit.profit || 0), 0)
    setTotalProfits(totalProfit)
    const TotalLosses = losses.reduce((acc, loss)=> acc + parseFloat(loss.loss || 0), 0)
    setTotalLoss(TotalLosses)
  }, [sales, totalProfits]); // Recalculate when sales data changes
  console.log( "TotalLosses",TotalLoss)
  const [menuOpen, setMenuOpen] = useState(false); // For the three-dot menu


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleNavigateToSalesHistory = () => {
    navigate('/salesHistory'); // Navigate to sales history
  };


  useEffect(() => {
    if (search) {
      const filtered = allcurtains.filter((curtain) =>
        curtain.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCurtains(filtered);
    } else {
      setFilteredCurtains(allcurtains); // Show all curtains if no search term
    }
  }, [search, allcurtains]);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white  shadow-md p-4 border-r border-gray-300">
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
          <div className="grid grid-cols-2 gap-4">
            {/* Total Sales Section with Three Dots Menu */}
            <div className="bg-green-100 p-4 rounded-lg shadow relative">
              <h3 className="text-lg font-bold">Total Sales</h3>
              <p className="text-2xl">Ksh {totalSales.toFixed(2)}</p>
              
              {/* Three dots vertical menu */}
              <div className="absolute top-2 right-2">
                <button onClick={toggleMenu} className="focus:outline-none">
                  <span className="text-black font-bold text-lg">⋮</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                    <ul className="py-2">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => alert('Sales Settings Clicked')}
                      >
                        Sales Settings
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleNavigateToSalesHistory}
                      >
                        Sales History
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Purchases</h3>
              <p className="text-2xl">50</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Profit</h3>
              <p className="text-2xl">ksh {totalProfits}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Total Losses</h3>
              <p className="text-2xl">ksh {TotalLoss}</p>
            </div>
          </div>

         
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
        {filteredCurtains.length > 0 ? (
          filteredCurtains.map((curtain) => (
            <div
              key={curtain.id}
              className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100"
            >
              <CurtainTile product={curtain} />
              <button
                className="bg-green-500 text-white rounded-md px-4 py-2 mt-2"
               // Handle selecting a curtain for sale
              >
                Sale
              </button>
            </div>
          ))
        ) : (
          <p>No curtains found</p>
        )}
      </div>
        
      </div>
    </div>
  );
}

export default Admin;
