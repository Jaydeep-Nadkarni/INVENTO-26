import express from "express";
import {
  googleAuth,
  completeOnboarding,
  getProfile,
  validateUser,
  inviteVIP
} from "../controllers/userController.js";
import { protect, requireOnboarding, isMaster } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🔑 Google OAuth Flow (Public)
router.post("/auth/google", googleAuth);

// 👤 Profile Setup (Public - validates firebaseUid internally)
router.post("/auth/onboarding", upload.single("profilePhoto"), completeOnboarding);

// 🔐 Private Profile (Requires Auth + Onboarding)
router.get("/profile", protect, requireOnboarding, getProfile);

// 🎫 Protected validation endpoint (Prevents PII leak)
router.get("/validate/:userId", protect, validateUser);

// 🌟 VIP Designation (Master Admin Only)
router.post("/invite-vip", protect, isMaster, inviteVIP);

export default router;