import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

//place order using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: { orderData } });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//place order using COD Method
const placeOrderBkash = async (req, res) => {};

//All order data for admin panel
const allOrders = async (req, res) => {};

//user order data for fronend
const userOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
    console.log(userId);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update order status from Admin panel
const orderStatus = async (req, res) => {};

export { placeOrder, placeOrderBkash, allOrders, userOrders, orderStatus };
