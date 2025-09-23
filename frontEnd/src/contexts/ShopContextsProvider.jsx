import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextsProvider = ({ children }) => {
  // ----------------- GLOBAL STATES -----------------
  const [mobileNavLinks, setMobileNavLinks] = useState(false); // Mobile navbar toggle
  const [search, setSearch] = useState(""); // Search input value
  const [showSearch, setShowSearch] = useState(false); // Toggle search bar visibility
  const [cartItem, setCartItem] = useState({}); // User cart state
  const [products, setProducts] = useState([]); // Product list
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Auth token
  const [loading, setLoading] = useState(false); // Loading state

  // ----------------- CONSTANTS -----------------
  const navigate = useNavigate();
  const currency = "$"; // Global currency symbol
  const deliveryFee = 10; // Fixed delivery fee
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API base URL

  // ----------------- API CALLS -----------------

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Added to cart");
          setCartItem(response.data); // ⚠️ Double-check: does backend return full `cartData` here?
          getUserCart(token); // Refresh cart after adding
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error(error.response?.data?.message || error.message);
      }
    } else {
      toast.error("Please log in to add products to your cart");
    }
  };

  // Get user cart from backend
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItem(response.data.cartData || {});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Get cart error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (itemId, size, quantity) => {
    // Update UI immediately for responsiveness
    const cartData = structuredClone(cartItem);

    if (quantity === 0) {
      // Remove item if quantity = 0
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      // Otherwise update or add item
      cartData[itemId] = cartData[itemId] || {};
      cartData[itemId][size] = quantity;
    }
    setCartItem(cartData);

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { token } }
      );

      if (!response.data.success) {
        toast.error(response.data.message);
        getUserCart(token); // Re-sync cart with backend if update failed
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error(error.response?.data?.message || error.message);
      getUserCart(token); // Recover from error
    }
  };

  // ----------------- CART HELPERS -----------------

  // Count total items in cart
  const getCartCount = () =>
    Object.values(cartItem)
      .flatMap((sizes) => Object.values(sizes))
      .reduce((total, qty) => total + qty, 0);

  // Calculate total amount of cart items
  const getCartAmount = () => {
    let totalAmount = 0;

    Object.entries(cartItem ?? {}).forEach(([id, sizes]) => {
      const itemInfo = products.find((product) => product._id === id);
      if (!itemInfo) return; // Skip if product info not found (edge case)

      Object.entries(sizes ?? {}).forEach(([_, qty]) => {
        if (qty > 0) {
          totalAmount += itemInfo.price * qty;
        }
      });
    });

    return totalAmount;
  };

  // ----------------- AUTH & SESSION -----------------

  // Auto-logout after 24 hours
  useEffect(() => {
    const expiryTime = localStorage.getItem("expiryTime");
    if (token && expiryTime && Date.now() > Number(expiryTime)) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiryTime");
      setToken("");
      setCartItem({});
      toast.info("Session expired. Please log in again.");
    }
  }, []);

  // Initial product load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Load user cart when token changes
  useEffect(() => {
    if (token) {
      getUserCart(token);
    } else {
      setCartItem({});
    }
  }, [token]);

  // ----------------- CONTEXT VALUE -----------------
  const value = {
    mobileNavLinks,
    setMobileNavLinks,
    products,
    currency,
    backendUrl,
    deliveryFee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    token,
    setToken,
    setCartItem,
    getUserCart,
    loading,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextsProvider;
