import express from "express";
import {
  registerUser,
  verifyOTP,
  resendVerifyOTP,
  loginUser,
  requestPasswordReset,
  resetPassword,
  getProfile,
  validateUser,
  inviteVIP,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-verify-otp", resendVerifyOTP);

// 🔑 Password Reset
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// 🔐 Profile
router.get("/profile", protect, getProfile);

// 🎫 Public validation endpoint for event pass verification
router.get("/validate/:userId", validateUser);

// 🌟 VIP
router.post("/invite-vip", inviteVIP);

export default router;