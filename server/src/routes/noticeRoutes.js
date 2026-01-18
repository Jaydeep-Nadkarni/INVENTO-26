import express from "express";
import { getNotices, createNotice } from "../controllers/noticeController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📢 Public Notices
router.get("/", getNotices);

// 🛠️ Admin/Official (Protected)
router.post("/", protect, createNotice);

export default router;
