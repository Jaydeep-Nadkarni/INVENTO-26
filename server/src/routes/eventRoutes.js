import express from "express";
import {
    registerForEvent,
    createOrder,
    validateKey,
    addContingentKey,
    updateParticipantStatus,
    updateParticipantAttendance,
    updateTeamStatus,
    updateMemberAttendance
} from "../controllers/eventController.js";
import { protect, requireOnboarding, isAdminOrCoordinator } from "../middlewares/authMiddleware.js";

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

/* ================= ADMIN/COORDINATOR ACTIONS ================= */

// Update participant status
router.patch("/:eventId/participants/:inventoId/status", protect, isAdminOrCoordinator, updateParticipantStatus);

// Mark participant attendance
router.patch("/:eventId/participants/:inventoId/attendance", protect, isAdminOrCoordinator, updateParticipantAttendance);

// Update team status
router.patch("/:eventId/teams/:teamName/status", protect, isAdminOrCoordinator, updateTeamStatus);

// Update team member attendance
router.patch("/:eventId/teams/:teamName/members/:inventoId/attendance", protect, isAdminOrCoordinator, updateMemberAttendance);

export default router;
