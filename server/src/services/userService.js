import { findUserByEmail } from "../repositories/userRepository.js";

export const verifyOTPService = async (email, otp) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    throw new Error("User already verified.");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP.");
  }

  if (user.otpExpiresAt < new Date()) {
    throw new Error("OTP expired.");
  }

  // ✅ Mark user as verified
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return user;
};