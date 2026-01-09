import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";

dotenv.config();

connectDB();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------- Middleware ----------
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("Invento 2026 is running");
});
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// ---------- 404 Handler (must be before global error handler) ----------
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ---------- Global Error Handler (ONE place, no repetition) ----------
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // expose stack only in dev
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
