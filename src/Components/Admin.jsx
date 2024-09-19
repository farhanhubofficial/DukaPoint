import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import { useSelector } from 'react-redux';
import { useFetchSalesQuery } from '../Store/Api/salesSlice';
import { useFetchProfitsQuery } from '../Store/Api/profitSlice';
import { useFetchLossesQuery } from '../Store/Api/lossesSlice';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import Users from './Users';
import CurtainTile from './CurtainTile';

function Admin() {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  const { data: sales = [] } = useFetchSalesQuery();
  const { data: profits = [] } = useFetchProfitsQuery();
  const { data: losses = [] } = useFetchLossesQuery();
  const { data: allcurtains = [] } = useFetchCurtainsQuery();
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [TotalLoss, setTotalLoss] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredCurtains, setFilteredCurtains] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('All'); // New state for category filter

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const total = sales.reduce(
      (acc, sale) => acc + parseFloat(sale.sellingPrice || 0),
      0
    );
    setTotalSales(total);

    const totalProfit = profits.reduce(
      (acc, profit) => acc + parseFloat(profit.profit || 0),
      0
    );
    setTotalProfits(totalProfit);

    const TotalLosses = losses.reduce(
      (acc, loss) => acc + parseFloat(loss.loss || 0),
      0
    );
    setTotalLoss(TotalLosses);
  }, [sales, profits, losses]);

  useEffect(() => {
    if (search) {
      const filtered = allcurtains.filter((curtain) =>
        curtain.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCurtains(filtered);
    } else {
      setFilteredCurtains(allcurtains);
    }
  }, [search, allcurtains]);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white shadow-md p-4 border-r border-gray-300 fixed">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="flex flex-col gap-4">
          <li>
            <button
              className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/admin/AdminCurtainsPage')}
            >
              Curtains
            </button>
          </li>
          <li>
            <button
              className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/admin/salesOverview')}
            >
              Sales Overview
            </button>
          </li>
          <li>
            <button
              className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/admin/adminCategories')}
            >
              Categories
            </button>
          </li>
          <li className="relative">
            <button
              className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              onClick={() => navigate('/admin/orders')} // Updated route to '/admin/orders'
            >
              Orders
            </button>
            {orders.length > 0 && (
              <span className="absolute top-0 right-0 bg-green-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                {orders.length}
              </span>
            )}
          </li>
          
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6 flex flex-col bg-gray-200">
        <h1 className="text-3xl font-bold mb-4">Admin Page</h1>

        {/* Nested Route Outlet */}
        <div className="bg-white shadow-md border border-gray-300 p-6 rounded-lg">
          <Outlet />
        </div>

       

       

        {/* Curtains Section with Scroll */}
      
      
      </div>
    </div>
  );
}

export default Admin;
