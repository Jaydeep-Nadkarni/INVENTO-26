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
import { protect, isAdminOrCoordinator } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authAdmin);

// Protected routes
router.use(protect);
router.use(isAdminOrCoordinator);

router.route("/")
    .get(getAdmins)
    .post(createAdmin);

// Global Settings
router.route("/settings/global")
    .get(getGlobalSettings)
    .put(updateGlobalSettings);

router.route("/:id")
    .put(updateAdmin)
    .delete(deleteAdmin);

export default router;
