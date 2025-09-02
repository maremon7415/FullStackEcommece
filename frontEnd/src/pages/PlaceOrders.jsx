import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/imgs";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";

const PlaceOrders = () => {
  const [method, setMethod] = useState("cod");
  const { navigate } = useContext(ShopContext);

  return (
    <div className="pageW flex flex-col sm:flex-row justify-center lg:gap-10 md:gap-6 sm:gap-4 pt-5 sm:pt-14 mb-10">
      {/* Left ----------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 ">
          <Title text1={"Delivery"} text2={"Information"} />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded  p-1.5 w-full"
            type="text"
            placeholder="First Name"
          />
          <input
            className="border border-gray-300 rounded p-1.5 w-full"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          className="border border-gray-300 rounded p-1.5 w-full"
          type="email"
          placeholder="Enter Youre Email Address"
        />
        <input
          className="border border-gray-300 rounded p-1.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded  p-1.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            className="border border-gray-300 rounded p-1.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded  p-1.5 w-full"
            type="number"
            placeholder="Zip code"
          />
          <input
            className="border border-gray-300 rounded p-1.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          className="border border-gray-300 rounded  p-1.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>
      {/* Right----------------  */}
      <div className="mt-8 ">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-10 text-lg">
          <Title text1={"payment"} text2={"Method"} />

          <div className="flex gap-3 flex-col lg:flex-row">
            {/* Bkash */}
            <div
              onClick={() => setMethod("bkash")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`h-3.5 w-3.5 rounded-full border ${
                  method === "bkash" ? "bg-green-300" : "bg-white"
                }`}
              ></p>
              <img className="w-16" src={assets.bkash_logo} alt="Bkash" />
            </div>

            {/* Nagad */}
            <div
              onClick={() => setMethod("nagad")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`h-3.5 w-3.5 rounded-full border ${
                  method === "nagad" ? "bg-green-300" : "bg-white"
                }`}
              ></p>
              <img className="w-16" src={assets.nagad_logo} alt="Nagad" />
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`h-3.5 w-3.5 rounded-full border ${
                  method === "cod" ? "bg-green-300" : "bg-white"
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Cash on Delivery
              </p>
            </div>
          </div>
        </div>
        <div className="w-full text-end mt-8">
          <button
            onClick={() => navigate("/orders")}
            className="bg-black text-white px-16 py-3 text-sm uppercase cursor-pointer "
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrders;
