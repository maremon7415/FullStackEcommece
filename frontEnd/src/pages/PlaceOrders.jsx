import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useContext, useState } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArrowLeft, FiLock, FiTruck } from "react-icons/fi";

const InputField = ({ name, value, onChange, placeholder }) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required
    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black"
  />
);

const PlaceOrders = () => {
  const [method, setMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    navigate,
    token,
    setCartItem,
    cartItem,
    getCartAmount,
    deliveryFee,
    products,
    backendUrl,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build order items only from cart
      let orderItems = [];
      for (const itemId in cartItem) {
        for (const size in cartItem[itemId]) {
          if (cartItem[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            );
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItem[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (!token) {
        toast.error("Please login to place an order");
        navigate("/login");
        return;
      }

      // Payload to backend
      const orderData = {
        userId: token,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + deliveryFee,
        paymentMethod: method,
      };

      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItem({});
        toast.success("Order placed successfully!");
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderSummary = Object.entries(cartItem).flatMap(([itemId, sizes]) =>
    Object.entries(sizes)
      .filter(([size, qty]) => qty > 0)
      .map(([size, qty]) => {
        const product = products.find((p) => p._id === itemId);
        return { ...product, size, quantity: qty };
      })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pageW py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="text-gray-600 hover:text-black flex items-center gap-2"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <Title text1="Secure" text2="Checkout" />
        </div>

        <form
          onSubmit={submitHandler}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          {/* Form Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FiTruck /> Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  placeholder="First Name"
                />
                <InputField
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  placeholder="Last Name"
                />
              </div>
              <InputField
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                placeholder="Email"
              />
              <InputField
                name="street"
                value={formData.street}
                onChange={onChangeHandler}
                placeholder="Street"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="city"
                  value={formData.city}
                  onChange={onChangeHandler}
                  placeholder="City"
                />
                <InputField
                  name="state"
                  value={formData.state}
                  onChange={onChangeHandler}
                  placeholder="State"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={onChangeHandler}
                  placeholder="Zip Code"
                />
                <InputField
                  name="country"
                  value={formData.country}
                  onChange={onChangeHandler}
                  placeholder="Country"
                />
              </div>
              <InputField
                name="phone"
                value={formData.phone}
                onChange={onChangeHandler}
                placeholder="Phone"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border space-y-4">
              <h2 className="text-2xl font-semibold">Payment Method</h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMethod("COD")}
                  className={`p-4 border rounded-xl ${
                    method === "COD" ? "border-black" : "border-gray-300"
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  disabled
                  className="p-4 border rounded-xl opacity-60 cursor-not-allowed"
                >
                  bKash (Coming Soon)
                </button>
                <button
                  type="button"
                  disabled
                  className="p-4 border rounded-xl opacity-60 cursor-not-allowed"
                >
                  Nagad (Coming Soon)
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {orderSummary.map((item, index) => (
                    <div
                      key={`${item._id}-${item.size}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.image?.[0].url || "/placeholder.png"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100 mb-4"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <CartTotal />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiLock className="w-5 h-5" />
                {isSubmitting ? "Processing..." : "Place Order Securely"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrders;
