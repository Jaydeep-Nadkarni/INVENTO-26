import { firebaseAuth } from "../config/firebase.js";
import { logAuthAttempt, validateIdTokenFormat } from "../utils/securityUtils.js";

/**
 * Verifies a Firebase ID token sent from the client.
 * 
 * @param {string} idToken - The Google ID token from Firebase Client SDK
 * @param {string} clientIp - Client IP address for logging
 * @returns {Promise<{uid: string, email: string, emailVerified: boolean}>}
 * @throws {Error} if token is invalid, expired, or verification times out
 */
export const verifyGoogleIdToken = async (idToken, clientIp = 'unknown') => {
  if (!idToken) {
    logAuthAttempt({
      eventType: 'TOKEN_VERIFICATION_FAILED',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: 'No token provided for verification'
    });
    throw new Error("No token provided for verification.");
  }

  // Validate token format
  if (!validateIdTokenFormat(idToken)) {
    logAuthAttempt({
      eventType: 'TOKEN_FORMAT_INVALID',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: 'Invalid token format'
    });
    throw new Error("Invalid token format.");
  }

  if (!firebaseAuth) {
    logAuthAttempt({
      eventType: 'FIREBASE_NOT_INITIALIZED',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: 'Firebase Admin SDK not initialized'
    });
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

    // Log successful verification
    logAuthAttempt({
      eventType: 'TOKEN_VERIFICATION_SUCCESS',
      userId: uid,
      ip: clientIp,
      email: email,
      status: 'success',
      message: 'Google token verified successfully'
    });

    return {
      uid,
      email,
      emailVerified: !!emailVerified,
    };
  } catch (error) {
    let errorMessage = error.message || "Identity verification failed.";
    let errorType = 'TOKEN_VERIFICATION_FAILED';

    // Custom error handling for specialized Firebase errors
    if (error.code === "auth/id-token-expired") {
      errorMessage = "The session has expired. Please sign in again.";
      errorType = 'TOKEN_EXPIRED';
    } else if (error.code === "auth/id-token-revoked") {
      errorMessage = "The token has been revoked. Access denied.";
      errorType = 'TOKEN_REVOKED';
    } else if (error.code === "auth/argument-error") {
      errorMessage = "Malformed authentication token.";
      errorType = 'TOKEN_MALFORMED';
    } else if (errorMessage.includes("timed out")) {
      errorType = 'TOKEN_VERIFICATION_TIMEOUT';
    }

    // Log failed verification
    logAuthAttempt({
      eventType: errorType,
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: errorMessage
    });

    throw new Error(errorMessage);
  }
};
