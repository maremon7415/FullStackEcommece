import React, { useContext } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import Title from "./Title";

const CartTotal = () => {
  const { getCartAmount, deliveryFee, currency } = useContext(ShopContext);

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-2xl shadow-md bg-white">
      {/* Title */}
      <div className="text-xl sm:text-2xl mb-4 text-center sm:text-left">
        <Title text1={"Cart "} text2={"Total"} />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 text-sm sm:text-base">
        {/* Sub Total */}
        <div className="flex justify-between items-center">
          <p className="font-medium">Sub Total</p>
          <p className="font-semibold">
            {currency}
            {getCartAmount()}.00
          </p>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <p className="font-medium">Shipping Charge</p>
          <p className="font-semibold">
            {currency}
            {deliveryFee}
          </p>
        </div>

        <hr className="w-full border-gray-300 my-2" />

        {/* Total */}
        <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
          <p>Total</p>
          <p>
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount() + deliveryFee}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
