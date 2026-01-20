import { verifyToken } from "../services/jwtService.js";
import User from "../models/userModel.js";

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

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      req.user = user; // attach full user
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
 */
export const requireOnboarding = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
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

  if (req.user.role !== "ADMIN" && req.user.role !== "COORDINATOR") {
    return res.status(403).json({
      message: "Access forbidden. Admin or Coordinator privileges required."
    });
  }

  next();
};
