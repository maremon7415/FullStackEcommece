import express from "express";
import {
  addToCart,
  updateCart,
  getUserCart,
} from "../controllers/cartController.js";
import userAuth from "../middleWare/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", userAuth, addToCart);
cartRouter.post("/get", userAuth, getUserCart);
cartRouter.post("/update", userAuth, updateCart);

export default cartRouter;
