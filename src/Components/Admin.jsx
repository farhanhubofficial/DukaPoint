import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchSalesQuery } from '../Store/Api/salesSlice';
import { useFetchProfitsQuery } from '../Store/Api/profitSlice';
import { useFetchLossesQuery } from '../Store/Api/lossesSlice';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import { FaRegUser, FaChevronDown } from "react-icons/fa";
import { auth } from '../firebase-config';

function Admin() {
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  const { data: sales = [] } = useFetchSalesQuery();
  const { data: profits = [] } = useFetchProfitsQuery();
  const { data: losses = [] } = useFetchLossesQuery();
  const { data: allcurtains = [] } = useFetchCurtainsQuery();
  
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = auth.currentUser;
  const displayName = user?.displayName || "Admin";

  // Calculate total sales, profits, and losses
  const totalSales = sales.reduce((acc, sale) => acc + parseFloat(sale.sellingPrice || 0), 0);
  const totalProfits = profits.reduce((acc, profit) => acc + parseFloat(profit.profit || 0), 0);
  const totalLoss = losses.reduce((acc, loss) => acc + parseFloat(loss.loss || 0), 0);

  const filteredCurtains = allcurtains.filter((curtain) =>
    curtain.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDropdownToggle = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    // Handle logout logic here
  };

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white shadow-md p-4 border-r border-gray-300 fixed z-20">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="flex flex-col gap-4">
          <li>
            <button className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300" onClick={() => navigate('/admin/AdminCurtainsPage')}>
              Curtains
            </button>
          </li>
          <li>
            <button className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300" onClick={() => navigate('/admin/salesOverview')}>
              Sales Overview
            </button>
          </li>
          <li>
            <button className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300" onClick={() => navigate('/admin/adminCategories')}>
              Categories
            </button>
          </li>
          <li className="relative">
            <button className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300" onClick={() => navigate('/admin/orders')}>
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

      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-md z-10 h-16 flex items-center px-4 border-b border-gray-300 justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>

        {/* Right side of the header */}
        <div className="relative dropdown-container flex items-center gap-4 mr-10">
          <FaRegUser className="text-xl" />
          <div className='flex flex-col'>
            <span className='font-bold'>{displayName}</span>
            <span className='text-sm'>Admin</span>
          </div>
          <FaChevronDown className="cursor-pointer text-xl" onClick={handleDropdownToggle} />
          {dropdownOpen && (
            <div className="absolute right-0 top-5 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-300 z-20">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/accountSettings')}>
                  Account Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/helpCenter')}>
                  Help Center
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6 flex flex-col bg-gray-200 mt-16">
        <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
        <div className="bg-white shadow-md border border-gray-300 p-6 rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Admin;
