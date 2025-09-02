import React from "react";
import Title from "../components/Title";
import NewsLatter from "../components/NewsLatter";
import { assets } from "../assets/imgs";

const Contact = () => {
  return (
    <div className="pageW py-10">
      <div className="text-3xl text-center">
        <Title text1={"contact "} text2={"us"} />
      </div>
      <div className="my-10 flex flex-col justify-center lg:flex-row gap-10 mb-20 ">
        <img
          className="w-full lg:max-w-[480px]"
          src={assets.contact_image}
          alt="Conatct image"
        />
        <div className="flex flex-col items-start justify-center gap-6">
          <p className="font-semibold text-xl to-gray-600">Our Store</p>
          <p className="text-gray-500">
            565656 Willms Statiton <br /> Suite , Washington
          </p>
          <p className="text-gray-500">
            Tel: +123 123 123 <br />
            Email: admin@myshop.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at MyShop
          </p>
          <p className="text-gray-500">Learn more about our Job openings.</p>
          <button className="border border-gray-600 bg-white text-black hover:bg-black hover:text-white transform transition-all ease-in-out duration-500 px-4 py-2">
            Explore Jobs
          </button>
        </div>
      </div>
      <NewsLatter />
    </div>
  );
};

export default Contact;
