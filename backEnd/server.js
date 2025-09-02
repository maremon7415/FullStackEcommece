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

// CORS setup
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://myshop-frontend.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like Postman
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: This origin (${origin}) is not allowed.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
