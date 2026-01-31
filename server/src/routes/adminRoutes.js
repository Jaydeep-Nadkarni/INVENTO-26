import express from "express";
import {
    authAdmin,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getGlobalSettings,
    updateGlobalSettings
} from "../controllers/adminController.js";
import { protect, isAdminOrCoordinator, isMaster } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authAdmin);

// Protected routes (General Admin Access)
router.use(protect);
router.use(isAdminOrCoordinator);

// Master only routes
router.route("/")
    .get(getAdmins)
    .post(isMaster, createAdmin);

// Global Settings (Master Only)
router.route("/settings/global")
    .get(getGlobalSettings)
    .put(isMaster, updateGlobalSettings);

router.route("/:id")
    .put(isMaster, updateAdmin)
    .delete(isMaster, deleteAdmin);

export default router;
