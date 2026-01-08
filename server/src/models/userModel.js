import mongoose from "mongoose";
import Counter from "./counterModel.js";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Custom Invento ID (inv00001, inv00002…)
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
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    clgName: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String, // Base64 encoded image string
    },
    registeredEvents: {
      type: [String],
      default: [],
    },
    pendingDues: {
      type: Number,
      default: 0,
    },

    // 🔹 OTP for registration/verification
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // // 🔹 Password reset fields
    resetOTP: {
      type: String,
    },
    resetOTPExpires: { // ✅ updated name to match your controllers
      type: Date,
    },
  },
  { timestamps: true }
);

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