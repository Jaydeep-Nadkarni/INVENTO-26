import express from "express";
import { registerForEvent, createOrder } from "../controllers/eventController.js";

const router = express.Router();

// Register solo/team
router.post("/register/:id", registerForEvent);

// payment create order
router.post("/create-order", createOrder);

export default router;
