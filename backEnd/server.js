import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

// ---------- Config ----------
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// ---------- Database & Cloudinary ----------
connectDB();
connectCloudinary();

// ---------- Middleware ----------
app.use(express.json());

// CORS setup (simpler for Vercel)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://myshop-frontend.vercel.app"],
    credentials: true,
  })
);

// ---------- API Endpoints ----------
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// ---------- Start Server ----------
app.listen(port, () => console.log("Server started on PORT", port));
