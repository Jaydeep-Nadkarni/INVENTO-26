import express from "express";
import { registerForEvent, createOrder, validateKey, addContingentKey } from "../controllers/eventController.js";

const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Event Routes] ${req.method} ${req.url}`);
    next();
});

// Register solo/team
router.post("/register/:id", registerForEvent);

// payment create order
router.post("/create-order", createOrder);

// Contingent Key Validation
router.post("/validate-key", validateKey);
router.post("/add-key", addContingentKey);

export default router;
