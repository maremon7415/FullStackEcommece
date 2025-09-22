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

    // Save to separate order collection (optional)
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Update user: push to orderData and clear cartData
    const user = await userModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.orderData.push(orderData); // push order into orderData array
    user.cartData = {}; // clear cart after placing order
    await user.save();

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//place order using COD Method
const placeOrderBkash = async (req, res) => {};

//All order data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//user order data for frontend
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
const orderStatus = async (req, res) => {
  try {
    const { userId, status } = req.body; // Keep userId to match frontend

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    // Update the order by ID (userId is actually the orderId from frontend)
    const updatedOrder = await orderModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true } // Return updated document
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Status Updated Successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("Error updating order status:", error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, placeOrderBkash, allOrders, userOrders, orderStatus };
