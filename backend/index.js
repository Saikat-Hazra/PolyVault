import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

import customerRoutes from "./routes/customer.routes.js";
import assetRoutes from "./routes/asset.routes.js";
import creatorRoutes from "./routes/creator.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// ✅ Route Mounts
app.use("/customers", customerRoutes);
app.use("/assets", assetRoutes);
app.use("/creator", creatorRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// ✅ Base Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PolyVault API is operational",
    timestamp: new Date().toISOString(),
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

// ✅ Global Error Handler (Must be last!)
// This catches errors passed to next(err) from middleware and routes
app.use((err, req, res, next) => {
  console.error("🔴 Error:", err.message);

  // Determine status code
  const status = err.statusCode || err.status || 500;

  // Sanitize error message (don't expose internals in production)
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "An error occurred";

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ✅ Database connection & Server Boot
export const startServer = async () => {
  // ✅ Check if MONGO_URI is configured
  if (!process.env.MONGO_URI) {
    console.error(
      "❌ MONGO_URI not configured in .env file"
    );
    console.error("👉 Please add MONGO_URI to backend/.env");
    process.exit(1);
  }

  // ✅ Try to connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("✅ MongoDB connected successfully");
  } catch (dbErr) {
    console.error("❌ MongoDB connection failed:", dbErr.message);
    console.error("👉 Please check your MONGO_URI and MongoDB Atlas settings:");
    console.error("   1. Verify MONGO_URI is correct in .env");
    console.error("   2. Check if MongoDB Atlas cluster is running");
    console.error("   3. Verify your IP is whitelisted in MongoDB Atlas");
    console.error("   4. Check database user credentials");
    process.exit(1); // ✅ Exit if database connection fails
  }

  // ✅ Start Express server
  return app.listen(PORT, () => {
    console.log(`\n🚀 PolyVault API Server`);
    console.log(`📍 Running on http://localhost:${PORT}`);
    console.log(`🌍 Client URL: ${CLIENT_URL}`);
    console.log(`💾 Database: Connected`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? "✅ Configured" : "❌ Missing"}`);
    console.log("\n✨ Ready to receive requests!\n");
  });
};

// ✅ Graceful shutdown
process.on("SIGTERM", () => {
  console.log("📍 SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// ✅ Start when executed directly (not in test mode)
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;