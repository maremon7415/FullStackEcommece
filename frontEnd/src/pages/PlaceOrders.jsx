import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/imgs";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../contexts/ShopContextsProvider";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiShield,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiLock,
} from "react-icons/fi";

const PlaceOrders = () => {
  const [method, setMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

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

  // Check if cart is empty
  useEffect(() => {
    const hasItems = Object.values(cartItem).some((sizes) =>
      Object.values(sizes).some((qty) => qty > 0)
    );

    if (!hasItems) {
      toast.error("Your cart is empty!");
      navigate("/cart");
    }
  }, [cartItem, navigate]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Zip code is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Invalid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
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

      if (orderItems.length === 0) {
        toast.error("Your cart is empty!");
        navigate("/cart");
        return;
      }

      if (!token) {
        toast.error("Please login to place an order");
        navigate("/login");
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + deliveryFee,
      };

      switch (method) {
        case "COD":
          const response = await axios.post(
            backendUrl + "/api/order/place",
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
          break;

        case "bkash":
        case "nagad":
          toast.info(
            `${
              method.charAt(0).toUpperCase() + method.slice(1)
            } payment integration coming soon!`
          );
          break;

        default:
          toast.error("Please select a payment method");
          break;
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ icon: Icon, error, ...props }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        {...props}
        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-200 focus:ring-black hover:border-gray-300"
        }`}
      />
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <FiAlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );

  const PaymentOption = ({
    id,
    selected,
    onClick,
    icon,
    title,
    description,
    comingSoon = false,
  }) => (
    <div
      onClick={!comingSoon ? onClick : undefined}
      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
        selected
          ? "border-black bg-gray-50"
          : "border-gray-200 hover:border-gray-300"
      } ${comingSoon ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-black" : "border-gray-300"
          }`}
        >
          {selected && <div className="w-3 h-3 bg-black rounded-full"></div>}
        </div>

        <div className="flex-1 flex items-center gap-3">
          {typeof icon === "string" ? (
            <img src={icon} alt={title} className="w-12 h-8 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>

        {comingSoon && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );

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
      <div className="pageW py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <Title text1="Secure" text2="Checkout" />
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Cart</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm font-medium text-black">Checkout</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="text-sm text-gray-500">Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Side - Forms */}
            <div className="xl:col-span-2 space-y-8">
              {/* Delivery Information */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-6">
                  <FiTruck className="w-6 h-6 text-black" />
                  <h2 className="text-2xl font-semibold">
                    Delivery Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={FiUser}
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChangeHandler}
                    placeholder="First Name"
                    required
                    error={formErrors.firstName}
                  />
                  <InputField
                    icon={FiUser}
                    name="lastName"
                    value={formData.lastName}
                    onChange={onChangeHandler}
                    placeholder="Last Name"
                    required
                    error={formErrors.lastName}
                  />
                </div>

                <div className="mt-6">
                  <InputField
                    icon={FiMail}
                    name="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    type="email"
                    placeholder="Email Address"
                    required
                    error={formErrors.email}
                  />
                </div>

                <div className="mt-6">
                  <InputField
                    icon={FiMapPin}
                    name="street"
                    value={formData.street}
                    onChange={onChangeHandler}
                    placeholder="Street Address"
                    required
                    error={formErrors.street}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <InputField
                    icon={FiMapPin}
                    name="city"
                    value={formData.city}
                    onChange={onChangeHandler}
                    placeholder="City"
                    required
                    error={formErrors.city}
                  />
                  <InputField
                    icon={FiMapPin}
                    name="state"
                    value={formData.state}
                    onChange={onChangeHandler}
                    placeholder="State"
                    required
                    error={formErrors.state}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <InputField
                    icon={FiMapPin}
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={onChangeHandler}
                    type="number"
                    placeholder="Zip Code"
                    required
                    error={formErrors.zipCode}
                  />
                  <InputField
                    icon={FiMapPin}
                    name="country"
                    value={formData.country}
                    onChange={onChangeHandler}
                    placeholder="Country"
                    required
                    error={formErrors.country}
                  />
                </div>

                <div className="mt-6">
                  <InputField
                    icon={FiPhone}
                    name="phone"
                    value={formData.phone}
                    onChange={onChangeHandler}
                    type="tel"
                    placeholder="Phone Number"
                    required
                    error={formErrors.phone}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="w-6 h-6 text-black" />
                  <h2 className="text-2xl font-semibold">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <PaymentOption
                    id="bkash"
                    selected={method === "bkash"}
                    onClick={() => setMethod("bkash")}
                    icon={assets.bkash_logo}
                    title="bKash"
                    description="Pay with your bKash account"
                    comingSoon={true}
                  />

                  <PaymentOption
                    id="nagad"
                    selected={method === "nagad"}
                    onClick={() => setMethod("nagad")}
                    icon={assets.nagad_logo}
                    title="Nagad"
                    description="Pay with your Nagad account"
                    comingSoon={true}
                  />

                  <PaymentOption
                    id="COD"
                    selected={method === "COD"}
                    onClick={() => setMethod("COD")}
                    icon={<FiTruck className="w-6 h-6 text-gray-600" />}
                    title="Cash on Delivery"
                    description="Pay when you receive your order"
                  />
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FiShield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Secure Payment
                      </p>
                      <p className="text-sm text-green-700">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {orderSummary.map((item, index) => (
                      <div
                        key={`${item._id}-${item.size}-${index}`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={
                            item.image?.[0]?.url ||
                            item.image?.[0] ||
                            "/placeholder.png"
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg bg-gray-100"
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

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiLock className="w-5 h-5" />
                      Place Order Securely
                    </>
                  )}
                </button>

                {/* Trust Indicators */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiShield className="w-4 h-4" />
                      SSL Secured
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTruck className="w-4 h-4" />
                      Fast Delivery
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4" />
                      Easy Returns
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrders;
