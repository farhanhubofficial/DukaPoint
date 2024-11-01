import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchSalesQuery } from '../Store/Api/salesSlice';
import { useFetchProfitsQuery } from '../Store/Api/profitSlice';
import { useFetchLossesQuery } from '../Store/Api/lossesSlice';
import { useFetchCurtainsQuery } from '../Store/Api/CurtSlice';
import { FaRegUser, FaChevronDown } from "react-icons/fa";
import { IoMdMenu } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function User() {
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useSelector((state) => state.orders.items);
  const { data: sales = [] } = useFetchSalesQuery();
  const { data: profits = [] } = useFetchProfitsQuery();
  const { data: losses = [] } = useFetchLossesQuery();
  const { data: allcurtains = [] } = useFetchCurtainsQuery();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const displayName = user?.displayName || "User";

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, isSidebarOpen]);

  // Map the route pathnames to their respective page titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/user/dashboard':
        return 'Dashboard';
      case '/user/salesOverview':
        return 'Sales Overview';
      case '/user/categories':
        return 'Categories';
      case '/user/settings':
        return 'Settings';
      default:
        return 'User Page';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Close Icon for small screens */}
        <div className="lg:hidden flex justify-end p-4">
          <MdClose className="text-3xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        {/* Sidebar Content */}
        <div className="p-4 font-bold text-xl border-b">User Panel</div>
        <nav className="mt-4">
          <ul className="space-y-4 px-4 ">
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/user/dashboard')}>
                Dashboard
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/user/salesOverview')}>
                Sales Overview
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/user/categories')}>
                Categories
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/user/settings')}>
                Settings
              </button>
            </li>
            <div className="p-4 text-xl border-t">
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          </ul>
        </nav>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <IoMdMenu className="text-3xl lg:hidden cursor-pointer" onClick={toggleSidebar} />
          <h1 className="font-bold text-xl text-gray-700">
            {getPageTitle()}
          </h1>
        </div>

        {/* User Profile and Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2" onClick={handleDropdownToggle}>
            <FaRegUser className="text-xl" />
            <span>{displayName}</span>
            <FaChevronDown className="text-sm" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-300 z-50 dropdown-container">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/user/settings')}>
                  Account Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-16 lg:ml-64 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default User;
