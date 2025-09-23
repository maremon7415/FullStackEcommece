import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiTag,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

const Cart = () => {
  const { products, cartItem, currency, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]); // Flattened cart for UI
  const [isUpdating, setIsUpdating] = useState({}); // Tracks quantity update states
  const [removingItems, setRemovingItems] = useState(new Set()); // Tracks removing animation

  // Helper to generate unique key for each item-size
  const getItemKey = (id, size) => `${id}-${size}`;

  // Rebuild cartData whenever cartItem changes
  useEffect(() => {
    const tempData = Object.entries(cartItem ?? {}).flatMap(([id, sizes]) =>
      Object.entries(sizes ?? {})
        .filter(([size, qty]) => qty > 0)
        .map(([size, qty]) => ({ _id: id, size, quantity: qty }))
    );
    setCartData(tempData);
  }, [cartItem]);

  // Handle quantity updates
  const handleQuantityUpdate = async (itemId, size, newQuantity) => {
    const key = getItemKey(itemId, size);
    setIsUpdating((prev) => ({ ...prev, [key]: true }));

    try {
      await updateQuantity(itemId, size, newQuantity);
    } finally {
      // Small delay to keep UI smooth
      setTimeout(() => {
        setIsUpdating((prev) => ({ ...prev, [key]: false }));
      }, 500);
    }
  };

  // Handle item removal with animation
  const handleRemoveItem = async (itemId, size) => {
    const key = getItemKey(itemId, size);
    setRemovingItems((prev) => new Set(prev).add(key));

    setTimeout(async () => {
      await updateQuantity(itemId, size, 0); // Remove from cart
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 300);
  };

  // Empty cart UI
  const EmptyCart = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
          <FiShoppingBag className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Looks like you haven't added any items to your cart yet. Start
          exploring our products and find something you love!
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
        >
          <FiShoppingBag className="w-5 h-5" />
          Start Shopping
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Single Cart Item
  const CartItem = ({ item, productData }) => {
    const itemKey = getItemKey(item._id, item.size);
    const isRemoving = removingItems.has(itemKey);
    const isItemUpdating = isUpdating[itemKey];

    if (!productData) return null; // Safeguard for missing product

    return (
      <div
        className={`bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
          isRemoving ? "opacity-50 scale-95" : ""
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Image */}
          <div className="relative group">
            <img
              className="w-full lg:w-32 h-32 lg:h-32 object-cover rounded-xl bg-gray-100"
              src={productData?.image?.[0]?.url}
              alt={productData?.name || "Product"}
              onError={(e) => {
                if (e.currentTarget) e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {productData?.name || "Unknown Product"}
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-gray-400" />
                    <span className="text-2xl font-bold text-gray-900">
                      {currency}
                      {productData?.price || 0}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                    Size: {item.size}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">
                    Subtotal: {currency}
                    {((productData?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                  <button
                    onClick={() =>
                      handleQuantityUpdate(
                        item._id,
                        item.size,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    disabled={item.quantity <= 1 || isItemUpdating}
                    className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center min-w-[60px] relative">
                    {isItemUpdating ? (
                      <FiRefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0 && val <= 999) {
                            handleQuantityUpdate(item._id, item.size, val);
                          } else {
                            e.target.value = item.quantity; // reset invalid entry
                          }
                        }}
                        className="w-full text-center bg-transparent text-lg font-semibold focus:outline-none"
                        min="1"
                        max="999"
                      />
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleQuantityUpdate(
                        item._id,
                        item.size,
                        item.quantity + 1
                      )
                    }
                    disabled={isItemUpdating || item.quantity >= 999}
                    className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item._id, item.size)}
                  disabled={isRemoving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pageW py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <Title text1="Shopping" text2="Cart" />
          {cartData.length > 0 && (
            <p className="text-gray-600 mt-2">
              {cartData.length} {cartData.length === 1 ? "item" : "items"} in
              your cart
            </p>
          )}
        </div>

        {cartData.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-6">
              {cartData.map((item) => {
                const productData = products.find((p) => p._id === item._id);
                return (
                  <CartItem
                    key={getItemKey(item._id, item.size)}
                    item={item}
                    productData={productData}
                  />
                );
              })}

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl p-6 border">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Why shop with us?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiTruck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-gray-500">
                        On orders over $50
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiShield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Secure Payment</p>
                      <p className="text-xs text-gray-500">SSL encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiRefreshCw className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Easy Returns</p>
                      <p className="text-xs text-gray-500">30-day policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Cart Total */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>
                  <CartTotal />
                </div>

                {/* Checkout Button */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <button
                    onClick={() => navigate("/place-order")}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] mb-4"
                  >
                    <span>Proceed to Checkout</span>
                    <FiArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => navigate("/collection")}
                    className="w-full flex items-center justify-center gap-3 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <span>Continue Shopping</span>
                  </button>
                </div>

                {/* Security Badge */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <FiShield className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        Secure Checkout
                      </p>
                      <p className="text-sm text-green-700">
                        Your information is protected with SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
