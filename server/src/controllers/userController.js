import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import { verifyOTPService } from "../services/userService.js";
import { processProfilePhoto } from "../services/imageService.js";

dotenv.config();

// 📧 Reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📧 Space-themed email template generator
const spaceMail = (title, message, otp, name, id) => `
  <div style="
    font-family: 'Courier New', monospace;
    background: radial-gradient(circle at top, #0b1a12, #000000);
    color: #c9fdd7;
    padding: 45px 28px;
    border-radius: 10px;
    max-width: 620px;
    margin: auto;
    border: 1px solid rgba(0, 255, 128, 0.25);
    box-shadow: 0 0 30px rgba(0, 255, 128, 0.15);
  ">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 28px;">
      <h1 style="
        color: #00ff88;
        font-size: 26px;
        letter-spacing: 3px;
        margin: 0;
        text-transform: uppercase;
      ">
        ${title}
      </h1>
      <p style="
        margin-top: 6px;
        font-size: 13px;
        color: #6affb2;
        opacity: 0.8;
      ">
        🔒 Encrypted Secure Channel
      </p>
    </div>

    <!-- Body -->
    <div style="
      background: rgba(0, 20, 10, 0.85);
      border: 1px dashed rgba(0, 255, 128, 0.35);
      border-radius: 8px;
      padding: 26px;
      text-align: center;
    ">
      <h2 style="
        color: #9dffcb;
        margin-bottom: 14px;
        font-size: 18px;
        font-weight: normal;
      ">
        Agent ${name}, with ID: ${id}
      </h2>

      <p style="
        font-size: 14px;
        line-height: 1.7;
        color: #caffdd;
        margin-bottom: 22px;
      ">
        ${message}
      </p>

      <!-- OTP Box -->
      <div style="
        margin: 24px auto;
        background: #000;
        border: 2px solid #00ff88;
        border-radius: 6px;
        padding: 16px 0;
        width: 260px;
      ">
        <span style="
          font-size: 30px;
          color: #00ff88;
          font-weight: bold;
          letter-spacing: 10px;
        ">
          ${otp}
        </span>
      </div>

      <p style="
        font-size: 13px;
        color: #ff6b6b;
        margin-top: 10px;
      ">
        ⏱ Code expires in <b>5 minutes</b> • Classified access only
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 28px;">
      <p style="
        font-size: 12px;
        color: #6affb2;
        opacity: 0.7;
      ">
        If this transmission was not initiated by you, terminate immediately.<br/>
        <span style="color:#00ff88;">Invento Technical Team</span> 🕶️
      </p>
    </div>

  </div>
`;


// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email,  password, phone, clgName, profilePhoto } = req.body;

    if (!name || !email || !password || !phone || !clgName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      clgName,
      otp,
      otpExpiresAt,
      isVerified: false,
      payment: false,
      present: false,
    });

    // 📸 Handle Profile Photo if uploaded
    if (req.file) {
      // We need the ID first, so we save once to trigger the ID generation hook
      await newUser.save();
      
      try {
        const photoPath = await processProfilePhoto(req.file.buffer, newUser._id);
        newUser.profilePhoto = photoPath;
        await newUser.save();
      } catch (error) {
        console.error("Error processing profile photo:", error);
        // We continue registration even if photo fails, but ideally we should handle it
      }
    } else {
      await newUser.save();
    }

    // 📧 Send Space-styled email
    await transporter.sendMail({
      from: `"Invento 2026" <temp.sandesh372@gmail.com>`,
      to: email,
      subject: "🚀 Invento 2026 - Verify Your Account",
      html: spaceMail(
        "INVENTO 2026",
        "Agent clearance initiated. Use the one-time access code below to verify your identity and activate your Invento account. This transmission is classified.",
        otp,
        name,
        newUser._id
      ),
    });

    res.status(200).json({
      message: `OTP sent to your email ${email}. Please verify to complete registration.`,
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await verifyOTPService(email, otp);

    return res.status(200).json({
      message: "User verified successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        payment: user.payment,
        present: user.present,
      },
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// ================= RESEND VERIFY OTP =================
export const resendVerifyOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    // Generate new OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await transporter.sendMail({
      from: `<temp.sandesh372@gmail.com>`,
      to: email,
      subject: "🔐 Invento 2026 – Verification Code",
      html: spaceMail(
        "ACCOUNT VERIFICATION",
        "Verification retransmission approved. Use the one-time access code below to activate your Invento account.",
        otp,
        user.name,
        user._id
      ),
    });

    return res.status(200).json({
      message: "Verification OTP resent successfully.",
    });
  } catch (error) {
    console.error("Error in resendVerifyOTP:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};


//================LOGIN=========================
const JWT_EXPIRES_IN = "1d";
const JWT_SECRET = process.env.JWT_SECRET;

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT (encode only userId)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
      payment: user.payment,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ================= REQUEST PASSWORD RESET =================
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await transporter.sendMail({
      from: `<temp.sandesh372@gmail.com>`,
      to: email,
      subject: "🔑 Invento 2026 - Password Reset Code",
      html: spaceMail(
        "RESET PASSWORD",
        "We’ve received a request to reset your password. Use the OTP below to continue:",
        otp,
        user.name
      ),
    });

    res.json({ message: "Password reset OTP sent to email." });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.resetOTP !== otp || user.resetOTPExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

//===============GET USER================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
