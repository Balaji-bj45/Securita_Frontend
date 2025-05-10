import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Show loading state during logout
      await axios.post("http://localhost:3001/api/role/admin/logout", {}, { withCredentials: true });

      // Clear localStorage and cookies
      localStorage.removeItem("token");

      // Redirect to login after clearing session
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if error, still clear session locally
      localStorage.removeItem("token");
      // Show an alert or notification to the user
      alert("Logout failed. Please try again.");

      navigate("/login"); // Redirect on failure as well
    } finally {
      setIsLoggingOut(false); // Hide loading state
    }
  };

  const navLinks = [
    { name: "Active Sessions", href: "/Active-Sessions" },
    { name: "History", href: "/History" },
    { name: "Organization", href: "/Organization" },
    { name: "Users", href: "/Users" },
    { name: "Groups", href: "/Groups" },
    { name: "Connections", href: "/Connections" },
  ];

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/home-page">
              <img
                src="https://www.autointelli.com/assets/img/hero-logo.webp"
                alt="Logo"
                className="h-10 w-auto"
                aria-label="Homepage"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-11">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-green-500 font-medium transition duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Profile */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="rounded-full bg-gray-800 hover:bg-gray-700 p-1 transition duration-300"
                aria-haspopup="true"
                aria-expanded={showDropdown ? "true" : "false"}
              >
                <img
                  src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                  aria-label="Profile"
                />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50"
                  >
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100"
                          aria-label="Profile Settings"
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          disabled={isLoggingOut}
                          aria-label="Logout"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              aria-label="Toggle Navigation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white shadow-lg rounded-b-xl px-4 pb-4 pt-2 space-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-2 text-gray-800 hover:text-green-500 font-medium"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-t" />

              {/* Mobile Profile Options */}
              <div className="flex items-center space-x-3 mt-2">
                <img
                  src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                  aria-label="User Profile"
                />
                <span className="text-gray-800 font-medium">John Doe</span>
              </div>
              <div className="space-y-1">
                <a href="#" className="block text-sm hover:underline">
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="block text-sm text-red-600 hover:underline"
                  disabled={isLoggingOut}
                  aria-label="Logout"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
