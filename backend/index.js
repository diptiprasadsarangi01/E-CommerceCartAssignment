import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();

// ✅ Must come before routes
app.use(cors());
app.use(express.json()); // parses JSON bodies

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Register routes after middleware
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log("🚀 Server running...")
);