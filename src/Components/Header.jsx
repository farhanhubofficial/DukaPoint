import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import clsx from "clsx";
import { useSelector } from "react-redux";
import Logo from "../Images/Logo.jpg";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { motion } from "framer-motion";

function Header() {
  const [isSideMenuOpen, setMenu] = useState(false);
  const [HrMenu, setHrMenu] = useState("");
  const [About, SetAbout] = useState(false);
  const [Portfolio, SetPortfolio] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const displayNameInitial = user && user.displayName ? user.displayName.charAt(0) : "";

  const items = useSelector((state) => state.cart.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleHomeHr = () => setHrMenu("Home");
  const handleAboutHr = () => setHrMenu("About");
  const handlePortfolioHr = () => setHrMenu("Portfolio");
  const handleCurtainsHr = () => setHrMenu("Curtains");
  const handleShearsHr = () => setHrMenu("Shears");
  const handleCarpetsHr = () => setHrMenu("Carpets");
  const handlePillowsHr = () => setHrMenu("Pillows");
  const handleDuvetsHr = () => setHrMenu("Duvets");

  const MouseMove = () => SetAbout(true);
  const MouseLeave = () => {
    SetAbout(false);
    SetPortfolio(false);
  };

  const handlePortfolioMouseMove = () => SetPortfolio(true);

  const handleLoginClick = () => {
    navigate("/login");
    setMenu(false);
  };

  const handleSignupClick = () => {
    navigate("/signup");
    setMenu(false);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setDropdownOpen(false);
      setUser(null);
      navigate("/login");
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleMobileAboutClick = (e) => {
    e.preventDefault();
    SetAbout((prev) => !prev);
  };

  const handleMobilePortfolioClick = (e) => {
    e.preventDefault();
    SetPortfolio((prev) => !prev);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex items-center justify-between w-screen px-6 l py-4 relative bg-white shadow-md font-[poppins] lg:px-10"

    >
      <div className="flex items-center gap-4">
        <IoMdMenu onClick={() => setMenu(true)} className="text-3xl lg:hidden" />
        <div className="flex">
          <img src={Logo} alt="Logo" className="rounded-full w-12 h-12 bg-black mr-2" />
          <Link>
            <h2 className="text-white font-roboto font-bold text-3xl">
              <span className="text-black">DECOR</span>
              <span className="text-yellow-800">POINT</span>
            </h2>
          </Link>
        </div>
      </div>

      {/* Navbar Links */}
      <div className="hidden lg:block text-xl text-yellow-800/100">
        <ul className="flex items-center space-x-6"> {/* Increased space-x-4 to space-x-6 */}
          <li>
            <Link to="/" onMouseEnter={handleHomeHr} className={clsx("hover:text-yellow-500", { "text-yellow-500": HrMenu === "Home" })}>
              Home
            </Link>
          </li>
          <div className="relative" onMouseLeave={MouseLeave} onMouseMove={MouseMove}>
            <Link to="/About" onClick={handleMobileAboutClick}>
              About Us
              <hr className={HrMenu === "About" ? "border-none w-[80%] h-[3px] bg-black" : ""} />
            </Link>
            <div className={About ? "bg-slate-100 shadow-custom-light border h-80 w-[270%] left-[-3rem] absolute flex flex-col p-3" : "hidden"}>
              <Link className="border-b-2 border-solid border-yellow-800" to="/Vision">
                <h1 className="my-8">Vision, Mission And Core <span>Values</span></h1>
              </Link>
              <Link className="border-b-2 border-solid border-yellow-800" to="/Approach">
                <h1 className="ml-[-.4rem] my-9">Our Approach</h1>
              </Link>
              <Link className="mt-5">
                <h1>Our Product And Services</h1>
              </Link>
            </div>
          </div>
          <div className="relative" onMouseLeave={MouseLeave} onMouseMove={handlePortfolioMouseMove}>
            <Link to="/Portfolio" onClick={handleMobilePortfolioClick}>
              Portfolio
              <hr className={HrMenu === "Portfolio" ? "border-none w-[80%] h-[3px] bg-black" : ""} />
            </Link>
            <div className={Portfolio ? "bg-slate-100 shadow-custom-light border h-40 w-[270%] left-[-3rem] absolute flex flex-col p-3" : "hidden"}>
              <Link className="border-b-2 border-solid border-yellow-800" to="/PrivateHouse">
                <h1 className="my-8">Private House</h1>
              </Link>
            </div>
          </div>
          {/* Other Navbar Items */}
          <li>
            <Link to="/curtains" onMouseEnter={handleCurtainsHr} className={clsx("hover:text-yellow-500", { "text-yellow-500": HrMenu === "Curtains" })}>
              Curtains
            </Link>
          </li>
          <li>
            <Link to="/shears" onMouseEnter={handleShearsHr} className={clsx("hover:text-yellow-500", { "text-yellow-500": HrMenu === "Shears" })}>
              Shears
            </Link>
          </li>
          <li>
            <Link to="/carpets" onMouseEnter={handleCarpetsHr} className={clsx("hover:text-yellow-500", { "text-yellow-500": HrMenu === "Carpets" })}>
              Carpets
            </Link>
          </li>
          <li>
            <Link to="/pillows" onMouseEnter={handlePillowsHr} className={clsx("hover:text-yellow-500", { "text-yellow-500": HrMenu === "Pillows" })}>
              Pillows
            </Link>
          </li>
          <li>
            <Link to="/duvets" onMouseEnter={handleDuvetsHr} className={clsx("hover:text-yellow-500", { "text-yellow-500": HrMenu === "Duvets" })}>
              Duvets
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Link to="/cart" className="relative">
          <BsCart className="text-3xl text-yellow-800/100" />
          <span className="absolute top-[-10px] right-[-12px] bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </span>
        </Link>

        {/* User Icon for Desktop */}
        <div className="relative hidden lg:block">
          {user ? (
            <div onClick={toggleDropdown} className="w-10 h-10 flex items-center justify-center text-xl rounded-full bg-blue-500 text-white cursor-pointer">
              {displayNameInitial}
            </div>
          ) : (
            <MdAccountCircle onClick={toggleDropdown} className="text-4xl text-yellow-800/100 cursor-pointer" />
          )}
          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-32 bg-white border rounded-md shadow-lg">
              {user ? (
                <button onClick={handleLogout} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
                  Log Out
                </button>
              ) : (
                <>
                  <button onClick={handleLoginClick} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
                    Login
                  </button>
                  <button onClick={handleSignupClick} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* User Icon for Mobile */}
      </div>

      {/* Mobile Side Menu */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-64 h-full p-4 border border-gray-300 shadow-lg rounded-lg">
            <IoMdClose className="text-3xl mb-4" onClick={() => setMenu(false)} />
            <ul className="space-y-6 text-xl text-yellow-800/100"> {/* Increased space-y-4 to space-y-6 */}
              <li>
                <Link to="/" onClick={() => setMenu(false)} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  Home
                </Link>
              </li>
              <li>
                <Link to="/About" onClick={handleMobileAboutClick} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  About Us
                </Link>
                {About && (
                  <div className="bg-slate-100 shadow-custom-light border flex flex-col p-3">
                    <Link className="border-b-2 border-solid border-yellow-800" to="/Vision" onClick={() => setMenu(false)}>
                      <h1 className="my-2">Vision, Mission And Core Values</h1>
                    </Link>
                    <Link className="border-b-2 border-solid border-yellow-800" to="/Approach" onClick={() => setMenu(false)}>
                      <h1 className="my-2">Our Approach</h1>
                    </Link>
                    <Link onClick={() => setMenu(false)}>
                      <h1 className="my-2">Our Product And Services</h1>
                    </Link>
                  </div>
                )}
              </li>
              <li>
                <Link to="/Portfolio" onClick={handleMobilePortfolioClick} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  Portfolio
                </Link>
                {Portfolio && (
                  <div className="bg-slate-100 shadow-custom-light border flex flex-col p-3">
                    <Link className="border-b-2 border-solid border-yellow-800" to="/PrivateHouse" onClick={() => setMenu(false)}>
                      <h1 className="my-2">Private House</h1>
                    </Link>
                  </div>
                )}
              </li>
              <li>
                <Link to="/curtains" onClick={() => setMenu(false)} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  Curtains
                </Link>
              </li>
              <li>
                <Link to="/shears" onClick={() => setMenu(false)} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  Shears
                </Link>
              </li>
              <li>
                <Link to="/carpets" onClick={() => setMenu(false)} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  Carpets
                </Link>
              </li>
              <li>
                <Link to="/pillows" onClick={() => setMenu(false)} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  Pillows
                </Link>
              </li>
              <li>
                <Link to="/duvets" onClick={() => setMenu(false)} className="border-b border-gray-300 shadow-md p-2 rounded"> {/* Add border and shadow */}
                  Duvets
                </Link>
              </li>

              <div className="relative lg:hidden">
                {user ? (
                  <div onClick={toggleDropdown} className="w-10 h-10 flex items-center justify-center text-xl rounded-full bg-blue-500 text-white cursor-pointer">
                    {displayNameInitial}
                  </div>
                ) : (
                  <MdAccountCircle onClick={toggleDropdown} className="text-4xl text-yellow-800/100 cursor-pointer" />
                )}
                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 w-32 bg-white border rounded-md shadow-lg">
                    {user ? (
                      <button onClick={handleLogout} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
                        Log Out
                      </button>
                    ) : (
                      <>
                        <button onClick={handleLoginClick} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
                          Login
                        </button>
                        <button onClick={handleSignupClick} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </ul>
          </div>
          <div className="flex-1" onClick={() => setMenu(false)} />
        </div>
      )}
    </motion.nav>
  );
}

export default Header;
