import React from "react";

const Spinner = () => {
  return (
    <div className="p-4 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2 text-gray-600 text-2xl">Loading ...</span>
    </div>
  );
};

export default Spinner;
