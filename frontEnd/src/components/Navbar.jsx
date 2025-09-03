import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaUserAlt, FaBars, FaShoppingCart } from "react-icons/fa";
import { assets } from "../assets/imgs";
import { ShopContext } from "../contexts/ShopContextsProvider";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Collections", to: "/collections" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const Navbar = () => {
  const {
    showSearch,
    setShowSearch,
    getCartCount,
    setMobileNavLinks,
    token,
    setToken,
    navigate,
    setCartItem,
  } = useContext(ShopContext);
  const location = useLocation();
  const [userMenu, setUserMenu] = useState(false);
  const menuRef = useRef(null);
  const cartCount = useMemo(() => getCartCount(), [getCartCount]);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const macthPath = navLinks.find((link) =>
      link.to === "/" ? currentPath === "/" : currentPath.startsWith(link.to)
    );
    setActiveLink(macthPath?.to || "");
  }, [location]);

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
  };

  const handleUserMenuToggle = () => {
    setUserMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItem({});
    navigate("/login");
  };

  return (
    <header className="w-full h-20 sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="pageW h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="transition-transform">
          <img
            className="w-28 md:w-32 lg:w-36 object-contain"
            src={assets.logo}
            alt="Logo"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6">
            {navLinks.map((item, index) => (
              <li
                key={index}
                className="uppercase text-gray-700 relative group"
              >
                <Link
                  to={item.to}
                  className={`transition-colors hover:text-black ${
                    location.pathname === item.to ? "text-black" : ""
                  }`}
                >
                  {item.name}
                </Link>
                <div className="absolute right-1/2 bottom-[-4px] w-0 h-[3px] group-hover:w-1/2 bg-black transition-all duration-300 ease-out"></div>
                <div className="absolute left-1/2 bottom-[-4px] w-0 h-[3px] group-hover:w-1/2 bg-black transition-all duration-300 ease-out"></div>
                {activeLink === item.to ? (
                  <div className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-black transition-all duration-300 ease-out"></div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons Section */}
        <div className="flexCenter gap-5 text-xl">
          {location.pathname.includes("collections") && (
            <button
              onClick={handleSearchToggle}
              className="transition-transform hover:scale-110"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          )}

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleUserMenuToggle}
              className="transition-transform hover:scale-110 mt-[6px]"
              aria-expanded={userMenu}
              aria-label="User menu"
            >
              <FaUserAlt />
            </button>
            <div
              className={`absolute w-24 bg-white py-2 right-0 top-[calc(100%+1rem)] rounded-xl shadow-lg tranEseOut ${
                userMenu
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <div className="relative">
                <div className="absolute w-3 h-3 bg-white transform rotate-45 right-4 -top-1.5"></div>
                <Link
                  to={"/profile"}
                  className="block px-4 py-1  text-gray-700 text-[16px] hover:bg-gray-50 transition-colors"
                  onClick={() => setUserMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  to={"/orders"}
                  className="block px-4 py-1 text-gray-700 text-[16px] hover:bg-gray-50 transition-colors"
                  onClick={() => setUserMenu(false)}
                >
                  Orders
                </Link>
                {token ? (
                  <div>
                    <Link
                      className="block px-4 py-1  text-red-500 text-[16px] hover:bg-gray-50 transition-colors"
                      onClick={handleLogout}
                    >
                      Log-Out
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link
                      to={"/login"}
                      className="block px-4 py-1 text-gray-700 text-[16px] hover:bg-gray-50 transition-colors"
                    >
                      Log-In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative transition-transform hover:scale-110"
            aria-label="Shopping cart"
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <div className="absolute w-5 h-5 rounded-full bg-black text-white text-sm flexCenter right-[-60%] top-[-60%] transform scale-100 transition-transform">
                {cartCount}
              </div>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileNavLinks(true)}
            className="lg:hidden transition-transform hover:scale-110"
            aria-label="Open mobile menu"
          >
            <FaBars />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
