import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300";

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-md">
      <nav className="flex flex-col gap-2 p-4 text-gray-900">
        {/* Add Item */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive
              ? `${linkClass} bg-black text-white`
              : `${linkClass} bg-gray-100`
          }
        >
          <AiOutlinePlus size={20} />
          <span>Add Item</span>
        </NavLink>

        {/* Product List */}
        <NavLink
          to="/list"
          className={({ isActive }) =>
            isActive
              ? `${linkClass} bg-black text-white`
              : `${linkClass} bg-gray-200`
          }
        >
          <AiOutlineUnorderedList size={20} />
          <span>Product List</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? `${linkClass} bg-black text-white`
              : `${linkClass} bg-gray-100`
          }
        >
          <FaShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
