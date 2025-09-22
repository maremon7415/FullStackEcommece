import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Current cart
    cartData: {
      type: Object,
      default: {}, // { [itemId]: { [size]: quantity } }
    },

    // Past orders
    orderData: {
      type: Array,
      default: [], // [{ items, amount, address, paymentMethod, payment, date }]
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
