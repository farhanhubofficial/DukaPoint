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

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();  // Get the current location
  const orders = useSelector((state) => state.orders.items);
  const { data: sales = [] } = useFetchSalesQuery();
  const { data: profits = [] } = useFetchProfitsQuery();
  const { data: losses = [] } = useFetchLossesQuery();
  const { data: allcurtains = [] } = useFetchCurtainsQuery();

  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false); // For Manage Products dropdown
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null);
  const auth = getAuth();
  const [user, setUser] = useState(null); // Track user state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);
  

  const displayName = user?.displayName || "Admin";

  // Calculate total sales, profits, and losses
  const totalSales = sales.reduce((acc, sale) => acc + parseFloat(sale.sellingPrice || 0), 0);
  const totalProfits = profits.reduce((acc, profit) => acc + parseFloat(profit.profit || 0), 0);
  const totalLoss = losses.reduce((acc, loss) => acc + parseFloat(loss.loss || 0), 0);

  const filteredCurtains = allcurtains.filter((curtain) =>
    curtain.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Sign out the user
      navigate('/login');  // Redirect to login page after logout
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleProductDropdown = () => {
    setProductDropdownOpen((prev) => !prev);
  };

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
      if (productDropdownOpen && !event.target.closest('.manage-products-dropdown')) {
        setProductDropdownOpen(false);
      }
      // Close sidebar if clicked outside
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, productDropdownOpen, isSidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    const unlisten = () => {
      setIsSidebarOpen(false);
    };

    const unlistenFromLocationChange = location.pathname; // Track location changes
    return () => {
      unlisten(); // Clean up on unmount
    };
  }, [location]);

  // Map the route pathnames to their respective page titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/adminCategories':
        return 'Dashboard';
      case '/admin/AdminCurtainsPage':
        return 'Manage Products';
      case '/admin/salesOverview':
        return 'Sales Overview';
      case '/admin/orders':
        return 'Orders';
      case '/admin/shears':
        return 'Shears';
      case '/admin/carpets':
        return 'Carpets';
      case '/admin/pillows':
        return 'Pillows';
      case '/admin/duvets':
        return 'Duvets';
      case '/admin/accountSettings':
        return 'Account Settings';
      case '/admin/helpCenter':
        return 'Help Center';
      default:
        return 'Admin Page';
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
        <div className="p-[1.62rem] font-bold text-xl border-b">Admin Panel</div>
        <nav className="mt-4">
          <ul className="space-y-4 px-4 ">
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/adminCategories')}>
                Dashboard
              </button>
            </li>
            <li className="relative text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={toggleProductDropdown}>
                Manage Products
              </button>
              {productDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-300 z-50 manage-products-dropdown">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/addcurtains')}>
                      Add Products
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/AdminCurtainsPage')}>
                      Curtains
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/shears')}>
                      Shears
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/carpets')}>
                      Carpets
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/pillows')}>
                      Pillows
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/duvets')}>
                      Duvets
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/salesOverview')}>
                Sales Overview
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/adminCategories')}>
                Categories
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/manageshops')}>
                Shops
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/manageusers')}>
                Manage Users 
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/adminCategories')}>
                Favourites
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/adminCategories')}>
                Settings
              </button>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/adminCategories')}>
                Privacy
              </button>
            </li>
            <li className="relative text-gray-700 hover:text-blue-500 transition-colors">
              <button onClick={() => navigate('/admin/orders')}>
                Orders
              </button>
              {orders.length > 0 && (
                <span className="absolute top-0 right-0 bg-green-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                  {orders.length}
                </span>
              )}
            </li>
            {/* More items... */}
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
            <div className='flex flex-col'>
            <span>{displayName}</span>
            <span>Admin</span>
            </div>
          
            <FaChevronDown className="text-sm" />
          </button>

          {/* Display user's role below the display name */}
         
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-300 z-50 dropdown-container">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/admin/accountSettings')}>
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

export default Admin;
