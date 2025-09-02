import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ShopContextsProvider = ({ children }) => {
  const [mobileNavLinks, setMobileNavLinks] = useState(false);
  const currency = "$";
  const deliveryFee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size ");
      return;
    }
    setCartItem((prevCart) => {
      const cartData = structuredClone(prevCart);
      cartData[itemId] = cartData[itemId] ?? {};
      cartData[itemId][size] = (cartData[itemId][size] ?? 0) + 1;
      return cartData;
    });
    toast.success("Item Added to Cart");
  };
  const getCartCount = () => {
    return Object.values(cartItem)
      .flatMap((sizes) => Object.values(sizes))
      .reduce((total, qty) => total + qty, 0);
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    Object.entries(cartItem ?? {}).forEach(([id, sizes]) => {
      const itemInfo = products.find((product) => product._id === id);

      if (!itemInfo) return; // skip if product not found

      Object.entries(sizes ?? {}).forEach(([size, qty]) => {
        if (qty > 0) {
          totalAmount += itemInfo.price * qty;
        }
      });
    });

    return totalAmount;
  };

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

  useEffect(() => {
    fetchProducts();
  }, []);

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
    user,
    backendUrl,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextsProvider;
