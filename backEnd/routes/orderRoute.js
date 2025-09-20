import express from "express";
import {
  placeOrder,
  placeOrderBkash,
  allOrders,
  userOrders,
  orderStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleWare/adminAuth.js";
import userAuth from "../middleWare/auth.js";

const orderRouter = express.Router();

//Admin feature
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, orderStatus);

//Payent features
orderRouter.post("/place", userAuth, placeOrder);
orderRouter.post("/bkash", userAuth, placeOrderBkash);

//user Fature
orderRouter.post("/userorders", userAuth, userOrders);

export default orderRouter;
