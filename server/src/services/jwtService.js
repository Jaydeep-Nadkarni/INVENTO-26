import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

/**
 * Generates an application-specific JWT for a user
 * @param {Object} user - The user document from MongoDB
 * @returns {string} - Signed JWT
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      isOfficial: user.isOfficial || false,
      role: user.role || "USER",
      passType: user.passType,
      onboardingCompleted: user.onboardingCompleted,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verifies an application JWT
 * @param {string} token - The JWT to verify
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Refreshes an existing token if valid
 * @param {string} token - The current JWT
 * @returns {string|null} - New signed JWT or null if refresh failed
 */
export const refreshToken = (token) => {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Remove exp and iat to generate a fresh token
  const { iat, exp, ...payload } = decoded;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
