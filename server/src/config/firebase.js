import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

/**
 * Initialize Firebase Admin SDK
 */
let auth;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!serviceAccountPath) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH is not defined in environment variables.");
  }

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  auth = admin.auth();
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("❌ Firebase Admin initialization failed:", error.message);
  // We don't exit the process here to allow the rest of the server to start, 
  // but auth-dependent features will fail.
}

export const firebaseAuth = auth;
export default admin;
