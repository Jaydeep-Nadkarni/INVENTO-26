import express from "express";
import {
    registerForEvent,
    createOrder,
    validateKey,
    addContingentKey,
    updateParticipantStatus,
    updateParticipantAttendance,
    updateTeamStatus,
    updateMemberAttendance,
    getEventStats,
    getEventParticipants,
    getEventTeams,
    getFestOverview,
    getDetailedAnalytics,
    getEvents,
    getFestRegistrations,
    updateEventDetails,
    getPublicGlobalSettings
} from "../controllers/eventController.js";


import {
    registrationSchema,
    validateRequest,
    validateRegistrationLogic
} from "../middlewares/eventValidationMiddleware.js";
import { protect, requireOnboarding, isAdminOrCoordinator, checkEventAccess } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Event Routes] ${req.method} ${req.url}`);
    next();
});

/* ================= ANALYTICS & REPORTING (MOVED UP) ================= */

// List all events (basic info) - PUBLIC
router.get("/", getEvents);

// Get Public Global Settings
router.get("/settings/global", getPublicGlobalSettings);

// Fest-wide overview (Put this BEFORE /:eventId routes to avoid conflict)
router.get("/analytics/overview", protect, isAdminOrCoordinator, getFestOverview);

// Detailed Analytics for Dashboard
router.get("/analytics/detailed", protect, isAdminOrCoordinator, getDetailedAnalytics);

// All registrations (Universal registry)
router.get("/registrations/all", protect, isAdminOrCoordinator, getFestRegistrations);

/* ================= EVENT REGISTRATION ================= */

// 🏆 Event Registration (Requires Auth + Onboarding + Validation)
router.post(
    "/register/:id",
    protect,
    requireOnboarding,
    registrationSchema,
    validateRequest,
    validateRegistrationLogic,
    registerForEvent
);

// 💸 Payment (Requires Auth + Onboarding)
router.post("/create-order", protect, requireOnboarding, createOrder);

// 🔑 Contingent Key (Public validation)
router.post("/validate-key", validateKey);
router.post("/add-key", addContingentKey);

/* ================= ADMIN/COORDINATOR ACTIONS ================= */

// Update participant status
router.patch("/:eventId/participants/:inventoId/status", protect, isAdminOrCoordinator, checkEventAccess, updateParticipantStatus);

// Mark participant attendance
router.patch("/:eventId/participants/:inventoId/attendance", protect, isAdminOrCoordinator, checkEventAccess, updateParticipantAttendance);

// Update team status
router.patch("/:eventId/teams/:teamName/status", protect, isAdminOrCoordinator, checkEventAccess, updateTeamStatus);

// Update team member attendance
router.patch("/:eventId/teams/:teamName/members/:inventoId/attendance", protect, isAdminOrCoordinator, checkEventAccess, updateMemberAttendance);

// Update event details (slots, status, etc.)
router.patch("/:eventId", protect, isAdminOrCoordinator, checkEventAccess, updateEventDetails);

// Event specific stats
router.get("/:eventId/stats", protect, isAdminOrCoordinator, checkEventAccess, getEventStats);

// Participant listing (SOLO)
router.get("/:eventId/participants", protect, isAdminOrCoordinator, checkEventAccess, getEventParticipants);

// Team listing (TEAM)
router.get("/:eventId/teams", protect, isAdminOrCoordinator, checkEventAccess, getEventTeams);

export default router;
