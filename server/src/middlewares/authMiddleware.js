import { verifyToken } from "../services/jwtService.js";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Extract actual token
    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      // Backward compatibility: check for both 'userId' (new) and 'id' (legacy)
      const userId = decoded.userId || decoded.id;

      // Check in Users first
      let user = await User.findById(userId);

      // If not found in Users, check in Admins
      if (!user) {
        user = await Admin.findById(userId);
      }

      if (!user) return res.status(404).json({ message: "User/Admin not found." });

      // Determine if it is a user or admin object (Admin model has 'access' field)
      const isAdmin = !!user.access || user.role === 'ADMIN';

      req.user = user; // attach full user/admin
      req.isAdmin = isAdmin; // easy flag
      return next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      return res.status(401).json({ message: "Authentication failed." });
    }
  }

  return res.status(401).json({ message: "No token provided, authorization denied." });
};

/**
 * Middleware to ensure the user has completed the onboarding process.
 * Should be used AFTER 'protect' middleware.
 * Skips for Admins.
 */
export const requireOnboarding = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  // Admins don't need onboarding
  if (req.isAdmin || req.user.role === 'ADMIN') {
    return next();
  }

  if (req.user.onboardingCompleted !== true) {
    return res.status(403).json({
      message: "Access forbidden. Please complete your profile onboarding.",
      onboardingCompleted: false
    });
  }

  next();
};

/**
 * Middleware to restrict access to Admins or Coordinators.
 * Should be used AFTER 'protect' middleware.
 */
export const isAdminOrCoordinator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const role = req.user.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "COORDINATOR" && role !== "MASTER") {
    return res.status(403).json({
      message: "Access forbidden. Admin or Coordinator privileges required."
    });
  }

  next();
};

/**
 * Check if Admin has access to specific Event
 * Use this on routes with :eventId param
 */
export const checkEventAccess = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  const role = req.user.role?.toUpperCase();
  // Super Admins or registration admins get global access
  if (role === 'MASTER' || req.user.isRegistration) return next();

  // If user is basic User, deny
  if (role === 'USER') return res.status(403).json({ message: "Forbidden" });

  const eventId = req.params.eventId;

  // If accessing fest-wide analytics/overview
  if (!eventId) return next();

  // Master Admin (No access array, usually just role)
  if (req.user.role === 'ADMIN' && !req.user.access) return next();

  // Check access for granular admins
  if (req.user.access) {
    // 1. Full Access if event in access array
    if (req.user.access.includes(eventId)) {
      return next();
    }

    // 2. Registration Admin: Read-only access to all participants
    // Exception: Mark attendance (usually a PATCH to /attendance)
    if (req.user.isRegistration) {
      const isReadOp = req.method === 'GET';
      const isAttendanceOp = req.url.includes('attendance') && req.method === 'PATCH';

      if (isReadOp || isAttendanceOp) {
        return next();
      }
    }
  } else if (req.user.role === 'COORDINATOR') {
    // COORDINATORS must have an access array to proceed
    return res.status(403).json({
      message: "Access Denied: COORDINATOR role requires explicit event assignment."
    });
  } else if (req.user.role === 'MASTER' || req.user.role === 'ADMIN') {
    // Explicitly allowed roles that might not hit the access check above (e.g. Master without access array)
    return next();
  }

  return res.status(403).json({
    message: "Access Denied: You do not have permission for this event protocol."
  });
};
