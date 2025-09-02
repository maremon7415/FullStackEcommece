import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaUserAlt,
  FaBars,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import { assets } from "../assets/imgs";
import { ShopContext } from "../contexts/ShopContextsProvider";

// Data
const navLinks = [
  { name: "Home", to: "/" },
  { name: "Collections", to: "/collections" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const userMenuItems = [
  { name: "Profile", to: "/profile" },
  { name: "Orders", to: "/orders" },
  { name: "Log Out", to: "#", isRed: true },
];

// Reusable NavLink Component
const NavLinkItem = ({ link, activeLink, closeMenu, mobile }) => {
  const isActive = activeLink === link.to;
  const baseClasses = mobile
    ? `block py-3 px-4 text-lg font-medium rounded-md transition-all duration-200`
    : `group relative uppercase font-medium tracking-wide transition-colors duration-200`;

  return (
    <Link
      to={link.to}
      onClick={closeMenu}
      className={`${baseClasses} ${
        mobile
          ? isActive
            ? "text-black bg-gray-100 font-semibold"
            : "text-gray-700 hover:text-black hover:bg-gray-50"
          : isActive
          ? "text-black"
          : "text-gray-600 hover:text-black"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {link.name}
      {!mobile && (
        <>
          {["left-[50%]", "right-[50%]"].map((pos, i) => (
            <div
              key={i}
              className={`absolute bottom-0 ${pos} h-0.5 bg-black transition-all duration-300 ${
                isActive ? "w-[50%]" : "w-0 group-hover:w-[50%]"
              }`}
            />
          ))}
        </>
      )}
    </Link>
  );
};

// Reusable UserMenu Component
const UserMenu = ({ open, onClose }) => (
  <div
    className={`absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 transition-all duration-200 z-50 ${
      open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    }`}
  >
    <div className="py-1 flex flex-col">
      {userMenuItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.name === "Log Out" && <hr className="border-gray-100 my-1" />}
          <Link
            to={item.to}
            onClick={onClose}
            className={`px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
              item.isRed
                ? "text-red-600 hover:bg-red-50 font-medium"
                : "text-gray-700"
            }`}
          >
            {item.name}
          </Link>
        </React.Fragment>
      ))}
    </div>
  </div>
);

// Main Navbar Component
const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const { showSearch, setShowSearch, getCartCount } = useContext(ShopContext);
  const [user, setUser] = useState(false);

  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Effect for active link
  useEffect(() => {
    const currentPath = location.pathname;
    const match = navLinks.find((link) =>
      link.to === "/" ? currentPath === "/" : currentPath.startsWith(link.to)
    );
    setActiveLink(match?.to || "");
  }, [location]);

  // Effect to close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <header className="w-full h-20 sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="pageW flex items-center justify-between h-full">
        {/* === Logo === */}
        <Link to="/" aria-label="Go to homepage">
          <img
            src={assets.logo}
            alt="Company Logo"
            className="w-28 md:w-32 lg:w-36 object-contain"
          />
        </Link>

        {/* === Desktop Navigation === */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8 xl:gap-10">
            {navLinks.map((link, i) => (
              <li key={i}>
                <NavLinkItem link={link} activeLink={activeLink} />
              </li>
            ))}
          </ul>
        </nav>

        {/* === Right Icons (Search, User, Cart, Mobile Toggle) === */}
        <div className="flex items-center sm:gap-2 lg:gap-4">
          {location.pathname.includes("collections") && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-xl hover:text-gray-600 p-2"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          )}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="text-xl hover:text-gray-600 p-2"
              aria-expanded={userMenuOpen}
              aria-label="User menu"
            >
              <FaUserAlt />
            </button>
            <UserMenu
              open={userMenuOpen}
              onClose={() => setUserMenuOpen(false)}
            />
          </div>

          <Link
            to="/cart"
            className="relative text-xl hover:text-gray-600 p-2"
            aria-label="Shopping cart"
          >
            <FaShoppingCart />
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full text-white text-xs flex items-center justify-center">
              {getCartCount()}
            </span>
          </Link>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-xl hover:text-gray-600 p-2 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label="Mobile menu toggle"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* === Mobile Menu (Overlay and Panel) === */}
        <div
          ref={menuRef}
          onClick={() => setIsMenuOpen(false)}
          className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <img src={assets.logo} alt="Company Logo" className="w-28" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-xl hover:text-gray-600 p-2"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navLinks.map((link, i) => (
                  <li key={i}>
                    <NavLinkItem
                      link={link}
                      activeLink={activeLink}
                      mobile
                      closeMenu={() => setIsMenuOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
