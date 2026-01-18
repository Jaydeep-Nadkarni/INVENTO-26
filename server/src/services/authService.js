import { firebaseAuth } from "../config/firebase.js";

/**
 * Verifies a Firebase ID token sent from the client.
 * 
 * @param {string} idToken - The Google ID token from Firebase Client SDK
 * @returns {Promise<{uid: string, email: string, emailVerified: boolean}>}
 * @throws {Error} if token is invalid, expired, or verification times out
 */
export const verifyGoogleIdToken = async (idToken) => {
  if (!idToken) {
    throw new Error("No token provided for verification.");
  }

  if (!firebaseAuth) {
    throw new Error("Firebase Admin SDK not initialized correctly.");
  }

  // Promise for verifyIdToken
  const verificationPromise = firebaseAuth.verifyIdToken(idToken);

  // Promise for 5-second timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Token verification timed out.")), 5000)
  );

  try {
    // Race the verification against the timeout
    const decodedToken = await Promise.race([verificationPromise, timeoutPromise]);

    // Extract claims
    const { uid, email, email_verified: emailVerified } = decodedToken;

    return {
      uid,
      email,
      emailVerified: !!emailVerified,
    };
  } catch (error) {
    // Custom error handling for specialized Firebase errors
    if (error.code === "auth/id-token-expired") {
      throw new Error("The session has expired. Please sign in again.");
    } else if (error.code === "auth/id-token-revoked") {
      throw new Error("The token has been revoked. Access denied.");
    } else if (error.code === "auth/argument-error") {
      throw new Error("Malformed authentication token.");
    }

    // Default or timeout error
    throw new Error(error.message || "Identity verification failed.");
  }
};
