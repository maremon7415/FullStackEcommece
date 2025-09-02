import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3 uppercase">
      <h2 className="text-gray-500 ">
        {text1} <span className="text-gray-700 font-medium">{text2}</span>
      </h2>
      <p className="sm-w-12 lg:w-8 h-[1px] bg-gray-700"></p>
    </div>
  );
};

export default Title;
