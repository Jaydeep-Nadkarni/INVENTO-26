import express from "express";
import {
  registerUser,
  verifyOTP,
  resendVerifyOTP,
  loginUser,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updatePaymentStatus,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-verify-otp", resendVerifyOTP);

// 🔑 Password Reset
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// 🔐 Profile
router.get("/profile", protect, getProfile);

export default router;