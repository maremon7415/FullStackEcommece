import { useContext, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContextsProvider";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Collections", to: "/collections" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const MobileNavLinks = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const { mobileNavLinks, setMobileNavLinks } = useContext(ShopContext);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setMobileNavLinks(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [setMobileNavLinks]);

  const closeMenu = () => setMobileNavLinks(false);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          mobileNavLinks ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Mobile Nav Panel */}
      <div
        ref={navRef}
        className={`fixed min-h-screen w-[65%] max-w-sm bg-white shadow-lg z-50 right-0 top-0 p-4 tranEseOut lg:hidden ${
          mobileNavLinks ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!mobileNavLinks}
      >
        <div className="w-full mx-auto h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <p className="text-xl font-semibold text-gray-800">Menu</p>
            <button
              onClick={closeMenu}
              className="text-2xl text-gray-500 hover:text-gray-900"
              aria-label="Close menu"
            >
              <IoClose />
            </button>
          </div>

          <hr className="mb-8" />

          {/* NavLinks*/}
          <div className="flex flex-col space-y-3">
            {navLinks.map((item, index) => (
              <div key={index}>
                <Link
                  onClick={closeMenu}
                  to={item.to}
                  className={`block w-full rounded-md px-4 py-3 font-medium transition-colors duration-200 ${
                    (
                      item.to === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.to)
                    )
                      ? "bg-gray-100 text-black"
                      : "text-gray-700 hover:bg-gray-50 hover:text-black"
                  }`}
                  aria-current={
                    (
                      item.to === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.to)
                    )
                      ? "page"
                      : undefined
                  }
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavLinks;
