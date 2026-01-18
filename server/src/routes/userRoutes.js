import express from "express";
import {
  googleAuth,
  completeOnboarding,
  getProfile,
  validateUser,
  inviteVIP
} from "../controllers/userController.js";
import { protect, requireOnboarding } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🔑 Google OAuth Flow (Public)
router.post("/auth/google", googleAuth);

// 👤 Profile Setup (Public - validates firebaseUid internally)
router.post("/auth/onboarding", upload.single("profilePhoto"), completeOnboarding);

// 🔐 Private Profile (Requires Auth + Onboarding)
router.get("/profile", protect, requireOnboarding, getProfile);

// 🎫 Public validation endpoint for event pass verification
router.get("/validate/:userId", validateUser);

// 🌟 VIP Designation (Public/Internal)
router.post("/invite-vip", inviteVIP);

export default router;