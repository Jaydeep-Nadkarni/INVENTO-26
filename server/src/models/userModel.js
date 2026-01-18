import mongoose from "mongoose";
import Counter from "./counterModel.js";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Custom Invento ID (inv00001, inv00002…)
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      alias: "googleId", // Legacy/Alias support for googleId
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    clgName: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String, // Relative path to the uploaded image file
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    isOfficial: {
      type: Boolean,
      default: false,
    },
    registeredEvents: {
      type: [String],
      default: [],
    },
    pendingDues: {
      type: Number,
      default: 0,
    },
    // Payment flag
    payment: {
      type: Boolean,
      default: false,
    },
    // Pass type (AAA, A, G, VIP)
    passType: {
      type: String,
      enum: ["AAA", "A", "G", "VIP"],
      default: "G",
    },
    // Attendance flag
    present: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * MIGRATION NOTES:
 * 1. Password-based auth has been replaced by Firebase Google OAuth.
 * 2. fields `password`, `otp`, `otpExpiresAt`, `resetOTP`, `resetOTPExpires` are removed.
 * 3. `isVerified` has been replaced by `emailVerified`.
 * 4. Existing users from the previous system will need to be re-authenticated via Google 
 *    to populate the `firebaseUid`.
 */

// ✅ Auto-generate custom Invento ID before saving
userSchema.pre("save", async function (next) {
  if (this.isNew && !this._id) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqNum = counter.seq.toString().padStart(5, "0"); // → 00001
    this._id = `inv${seqNum}`;
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;