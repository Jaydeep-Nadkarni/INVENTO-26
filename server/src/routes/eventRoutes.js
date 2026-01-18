import express from "express";
import { registerForEvent, createOrder, validateKey, addContingentKey } from "../controllers/eventController.js";
import { protect, requireOnboarding } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Event Routes] ${req.method} ${req.url}`);
    next();
});

// 🏆 Event Registration (Requires Auth + Onboarding)
router.post("/register/:id", protect, requireOnboarding, registerForEvent);

// 💸 Payment (Requires Auth + Onboarding)
router.post("/create-order", protect, requireOnboarding, createOrder);

// 🔑 Contingent Key (Public validation)
router.post("/validate-key", validateKey);
router.post("/add-key", addContingentKey);

export default router;
