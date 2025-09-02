import React from "react";
import logo from "../assets/logo.png";

const Navbar = ({ setToken }) => {
  return (
    <div className="h-22 w-full shadow-md z-50 fixed top-0 bg-white">
      <div className="flex items-center justify-between h-full w-[95%] lg:w-[85%] md:w-[90%] sm:w-[95%] mx-auto">
        <div>
          <img className="w-30" src={logo} alt="" />
          <h4 className="text-xl">Admin Panel</h4>
        </div>
        <button
          onClick={() => setToken("")}
          className="rounded px-4 py-2 bg-red-400 text-black cursor-pointer shadow-md"
        >
          Log-Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
