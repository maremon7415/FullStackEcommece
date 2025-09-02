import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import Title from "../components/Title";
import { ImBin } from "react-icons/im";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, cartItem, currency, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = Object.entries(cartItem ?? {}).flatMap(([id, sizes]) =>
      Object.entries(sizes ?? {})
        .filter(([_, qty]) => qty > 0)
        .map(([size, qty]) => ({ _id: id, size, quantity: qty }))
    );
    setCartData(tempData);
  }, [cartItem]);

  return (
    <div className="pageW py-10">
      <div>
        <div className="text-2xl font-semibold mb-6">
          <Title text1="Your" text2="Cart" />
        </div>

        {cartData.length === 0 ? (
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartData.map((item) => {
              const productData = products.find(
                (product) => product._id === item._id
              );
              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Product Info */}
                  <div className="flex items-start gap-4 w-full sm:w-auto">
                    <img
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                      src={productData.image[0].url}
                      alt={productData.name}
                    />
                    <div>
                      <h3 className="text-base sm:text-lg font-medium">
                        {productData.name}
                      </h3>
                      <div className="flex gap-4 mt-1">
                        <p className="font-semibold text-gray-700">
                          {currency}
                          {productData.price}
                        </p>
                        <p className="px-2 py-1 border bg-slate-100 text-sm rounded">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <input
                      onChange={(e) =>
                        e.target.value === "" || e.target.value === "0"
                          ? null
                          : updateQuantity(
                              item._id,
                              item.size,
                              Number(e.target.value)
                            )
                      }
                      className="border rounded w-16 text-center py-1 focus:ring focus:ring-blue-200"
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                    />
                    <ImBin
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="text-red-500 cursor-pointer text-xl hover:text-red-600 transition"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {cartData.length > 0 ? (
          <div className="mt-6 w-full">
            <CartTotal />
            <div className="w-full text-end">
              <button
                onClick={() => navigate("/place-order")}
                className="bg-black text-white text-sm my-y px-8 py-3 uppercase mt-6 cursor-pointer"
              >
                Procced to Checkout
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Cart;
