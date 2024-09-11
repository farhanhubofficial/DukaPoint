import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import clsx from "clsx";
import { useSelector } from "react-redux";
import Logo from "../Images/Logo.jpg";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function Header() {
  const [isSideMenuOpen, setMenu] = useState(false);
  const [HrMenu, setHrMenu] = useState("");
  const [About, SetAbout] = useState(false);
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
  const handleCurtainsHr = () => setHrMenu("Curtains");
  const handleShearsHr = () => setHrMenu("Shears");
  const handleCarpetsHr = () => setHrMenu("Carpets");
  const handlePillowsHr = () => setHrMenu("Pillows");
  const handleDuvetsHr = () => setHrMenu("Duvets");

  const MouseMove = () => SetAbout(true);
  const MouseLeave = () => SetAbout(false);

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

  return (
    <nav className="flex items-center justify-between max-[500px]:justify-around px-3 relative bg-slate-200 font-[poppins]">
      <div className="flex items-center gap-4">
        <IoMdMenu onClick={() => setMenu(true)} className="text-3xl lg:hidden" />
        <div className="flex">
          <img
            src={Logo}
            alt="Logo"
            className="rounded-full w-12 h-12 bg-black mr-2"
          />
          <Link>
            <h2 className="text-white font-roboto font-bold text-3xl">
              <span className="text-black">DECOR</span>
              <span className="text-yellow-800">POINT</span>
            </h2>
          </Link>
        </div>
      </div>

      {/* Navbar Links */}
      <div className="hidden lg:block font-bold text-yellow-800/100">
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              to="/"
              onMouseEnter={handleHomeHr}
              className={clsx("hover:text-yellow-500", {
                "text-yellow-500": HrMenu === "Home",
              })}
            >
              Home
            </Link>
          </li>
          <div
            className="relative"
            onMouseLeave={MouseLeave}
            onMouseMove={MouseMove}
          >
            <Link to="/About" onClick={handleAboutHr}>
              About Us
              <hr
                className={
                  HrMenu === "About"
                    ? "border-none w-[80%] h-[3px] bg-black"
                    : ""
                }
              />
            </Link>
            <div
              className={
                About
                  ? "bg-slate-100 shadow-custom-light border h-80 w-[270%] left-[-3rem] absolute flex flex-col p-3"
                  : "hidden"
              }
            >
              <Link
                className="border-b-2 border-solid border-yellow-800"
                to="/Vision"
              >
                <h1 className="my-8">
                  Vision, Mission And Core <span>Values</span>
                </h1>
              </Link>
              <Link
                className="border-b-2 border-solid border-yellow-800"
                to="/Approach"
              >
                <h1 className="ml-[-.4rem] my-9">Our Approach</h1>
              </Link>
              <Link className="mt-5">
                <h1>Our Product And Services</h1>
              </Link>
            </div>
          </div>
          <li>
            <Link
              to="/curtains"
              onMouseEnter={handleCurtainsHr}
              className={clsx("hover:text-yellow-500", {
                "text-yellow-500": HrMenu === "Curtains",
              })}
            >
              Curtains
            </Link>
          </li>
          <li>
            <Link
              to="/shears"
              onMouseEnter={handleShearsHr}
              className={clsx("hover:text-yellow-500", {
                "text-yellow-500": HrMenu === "Shears",
              })}
            >
              Shears
            </Link>
          </li>
          <li>
            <Link
              to="/carpets"
              onMouseEnter={handleCarpetsHr}
              className={clsx("hover:text-yellow-500", {
                "text-yellow-500": HrMenu === "Carpets",
              })}
            >
              Carpets
            </Link>
          </li>
          <li>
            <Link
              to="/pillows"
              onMouseEnter={handlePillowsHr}
              className={clsx("hover:text-yellow-500", {
                "text-yellow-500": HrMenu === "Pillows",
              })}
            >
              Pillows
            </Link>
          </li>
          <li>
            <Link
              to="/duvets"
              onMouseEnter={handleDuvetsHr}
              className={clsx("hover:text-yellow-500", {
                "text-yellow-500": HrMenu === "Duvets",
              })}
            >
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

        <div className="relative hidden lg:block">
          {user ? (
            <div
              onClick={toggleDropdown}
              className="w-10 h-10 flex items-center justify-center text-xl rounded-full bg-blue-500 text-white cursor-pointer"
            >
              {displayNameInitial}
            </div>
          ) : (
            <MdAccountCircle
              onClick={toggleDropdown}
              className="text-4xl text-yellow-800/100 cursor-pointer"
            />
          )}
          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-20 bg-white border rounded-md shadow-lg">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignupClick}
                    className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Side Menu */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
          <div className="bg-white w-64 h-full p-4">
            <IoMdClose
              className="text-3xl mb-4"
              onClick={() => setMenu(false)}
            />
            <ul className="space-y-4 font-bold text-yellow-800/100">
              <li>
                <Link to="/" onClick={() => setMenu(false)}>
                  Home
                </Link>
              </li>
              <div className="relative">
                <Link to="/About" onClick={() => setMenu(false)}>
                  About Us
                </Link>
              </div>
              <li>
                <Link to="/curtains" onClick={() => setMenu(false)}>
                  Curtains
                </Link>
              </li>
              <li>
                <Link to="/shears" onClick={() => setMenu(false)}>
                  Shears
                </Link>
              </li>
              <li>
                <Link to="/carpets" onClick={() => setMenu(false)}>
                  Carpets
                </Link>
              </li>
              <li>
                <Link to="/pillows" onClick={() => setMenu(false)}>
                  Pillows
                </Link>
              </li>
              <li>
                <Link to="/duvets" onClick={() => setMenu(false)}>
                  Duvets
                </Link>
              </li>
              {user ? (
                <li>
                  <button onClick={handleLogout} className="text-left">
                    Log Out
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <button onClick={handleLoginClick} className="text-left">
                      Login
                    </button>
                  </li>
                  <li>
                    <button onClick={handleSignupClick} className="text-left">
                      Sign Up
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div
            className="flex-1"
            onClick={() => setMenu(false)}
          />
        </div>
      )}
    </nav>
  );
}

export default Header;
