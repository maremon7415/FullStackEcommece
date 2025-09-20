import userModel from "../models/userModel.js";

//add products to cart
const addToCart = async (req, res) => {
  try {
    console.log("Add to cart request body:", req.body); // Debug log

    const { userId, itemId, size } = req.body;

    // Validate required fields from frontend
    if (!itemId || !size) {
      return res.json({
        success: false,
        message: "Missing required fields: itemId or size",
      });
    }

    // userId is guaranteed to exist from middleware
    console.log("Processing cart for user:", userId);
    const userData = await userModel.findById(userId);

    console.log("Current cartData:", userData.cartData);

    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};

    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }

    console.log("Updated cartData:", cartData);

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    // Validate required fields from frontend
    if (!itemId || !size || quantity === undefined) {
      return res.json({
        success: false,
        message: "Missing required fields: itemId, size, or quantity",
      });
    }

    // userId is guaranteed to exist from middleware
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    // Handle quantity updates
    if (quantity === 0) {
      // Remove item if quantity is 0
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        // Remove itemId if no sizes left
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log("Update cart error:", error);
    res.json({ success: false, message: error.message });
  }
};

//get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // userId is guaranteed to exist from middleware
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.log("Get cart error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
