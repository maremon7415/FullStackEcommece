import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("collections")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className=" text-white py-4 flex items-center justify-center max-w-[1280px] w-[95%] mx-auto">
      <div className="flex items-center bg-white text-black rounded-full overflow-hidden shadow-md w-full max-w-md border border-gray-300">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search..."
          className="flex-1 px-4 py-2 text-sm bg-transparent focus:outline-none"
        />
        <button
          className="p-3 text-black hover:text-gray-700 transition-colors"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </div>
      <button
        onClick={() => setShowSearch(false)}
        aria-label="Close"
        className="ml-3 p-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
      >
        <IoClose className="text-xl" />
      </button>
    </div>
  ) : null;
};

export default SearchBar;
