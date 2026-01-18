import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import volunteerRoutes from "./src/routes/volunteerRoutes.js";
import { validateEnvironmentVariables } from "./src/utils/envValidator.js";

dotenv.config();

// Validate environment variables on startup
validateEnvironmentVariables();

connectDB();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ========== SECURITY MIDDLEWARE ==========

// Helmet middleware for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// CORS Configuration - Restrict to allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
}));

// Rate limiting middleware for general API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/';
  }
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute
  message: 'Too many authentication attempts from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, not just failures
  handler: (req, res) => {
    console.warn(`[RATE_LIMIT] Auth endpoint rate limit exceeded from IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again in a minute.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// ---------- Body Parsing Middleware ----------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Serve static files from uploads directory with proper CORS headers
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("Invento 2026 is running");
});

// Debug endpoint to check if uploads are accessible
app.get("/api/debug/check-uploads", (req, res) => {
  res.json({
    message: "Uploads endpoint is accessible",
    uploadDir: path.join(__dirname, "uploads"),
    note: "Access images at: {API_URL}/uploads/profiles/{userId}.jpg"
  });
});

// Apply strict auth rate limiting to authentication endpoints
app.use("/api/users/auth", authLimiter);

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/volunteers", volunteerRoutes);

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
