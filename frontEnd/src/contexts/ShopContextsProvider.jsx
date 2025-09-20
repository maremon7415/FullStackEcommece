import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextsProvider = ({ children }) => {
  const [mobileNavLinks, setMobileNavLinks] = useState(false);
  const navigate = useNavigate();
  const currency = "$";
  const deliveryFee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Add to cart
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
          setCartItem(response.data);
          getUserCart(token);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log("Add to cart error:", error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Get total cart count
  const getCartCount = () =>
    Object.values(cartItem)
      .flatMap((sizes) => Object.values(sizes))
      .reduce((total, qty) => total + qty, 0);

  // Update cart quantity
  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItem);
    if (quantity === 0) {
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
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
        getUserCart(token);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      getUserCart(token);
    }
  };

  // Get total product amount
  const getCartAmount = () => {
    let totalAmount = 0;

    Object.entries(cartItem ?? {}).forEach(([id, sizes]) => {
      const itemInfo = products.find((product) => product._id === id);
      if (!itemInfo) return;

      Object.entries(sizes ?? {}).forEach(([size, qty]) => {
        if (qty > 0) {
          totalAmount += itemInfo.price * qty;
        }
      });
    });

    return totalAmount;
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
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Logout user after 24 hr
  useEffect(() => {
    const expiryTime = localStorage.getItem("expiryTime");
    if (token && expiryTime && Date.now() > Number(expiryTime)) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiryTime");
      setToken("");
      setCartItem({});
    }
  }, []);

  // Initial setup
  useEffect(() => {
    fetchProducts();
  }, []);

  // Load cart when token changes
  useEffect(() => {
    if (token) {
      getUserCart(token);
    } else {
      setCartItem({});
    }
  }, [token]);

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
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextsProvider;
