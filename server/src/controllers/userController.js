import nodemailer from "nodemailer";
import crypto from "crypto";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
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
    const { name, email, password, phone, clgName, profilePhoto } = req.body;

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
      isVerified: true, // Auto-verify as requested
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
      }
    } else {
      await newUser.save();
    }

    // Generate JWT for direct login
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // 📧 Send Welcome email
    await transporter.sendMail({
      from: `"Invento 2026" <temp.sandesh372@gmail.com>`,
      to: email,
      subject: "🚀 Welcome to Invento 2026!",
      html: spaceMail(
        "WELCOME AGENT",
        "Your clearance has been granted. Your Invento account is now active. Access the command center to begin your mission.",
        "ACCESS",
        name,
        newUser._id
      ),
    });

    res.status(201).json({
      message: "Registration successful. Welcome agent.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePhoto: newUser.profilePhoto,
        clgName: newUser.clgName
      }
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        clgName: user.clgName,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        passType: user.passType,
        registeredEvents: user.registeredEvents
      }
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

    // Fetch details for registered events to get WhatsApp links
    const events = await Event.find({ name: { $in: user.registeredEvents } });

    // Map events to a simplified format with WhatsApp links
    const eventDetails = events.map(e => ({
      name: e.name,
      whatsappLink: e.whatsappLink,
      type: e.type
    }));

    // Double check passType based on actual participation
    let finalPassType = user.passType || "G";

    // If not VIP and not AAA, check if they are registered for anything
    if (finalPassType !== "VIP" && finalPassType !== "AAA") {
      if (user.registeredEvents.length > 0) {
        finalPassType = "A";
      } else {
        finalPassType = "G";
      }
    }

    if (finalPassType !== user.passType) {
      user.passType = finalPassType;
      await user.save();
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        ...user.toObject(),
        eventDetails
      },
    });
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
// 🎫 Validate user for event pass (public endpoint)
export const validateUser = async (req, res) => {
  try {
    let { userId } = req.params;

    // Extract digits and handle flexible formats (e.g., "2", "0108", "inv108")
    const digits = userId.match(/\d+/);
    if (digits) {
      const seqNum = parseInt(digits[0]).toString().padStart(5, "0");
      userId = `inv${seqNum}`;
    }
    console.log(`[DEBUG] Validating User ID: ${userId}`);

    // Find user by processed ID
    const user = await User.findById(userId).select('name email clgName profilePhoto passType');

    if (!user) {
      return res.status(404).json({
        verified: false,
        message: 'Agent not found in central directory',
      });
    }

    // Return user data for validation
    return res.status(200).json({
      verified: true,
      message: user.passType === 'VIP' ? 'VIP Guest Identified' : 'Agent identified',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.clgName || 'Not specified',
        profilePhoto: user.profilePhoto || null,
        passType: user.passType,
      },
    });
  } catch (error) {
    console.error('Error in validateUser:', error.message);
    return res.status(500).json({
      verified: false,
      message: 'Server error',
    });
  }
};

// 🌟 Invite VIP Guests
export const inviteVIP = async (req, res) => {
  try {
    const { name, email, clgName } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required for VIP invitations." });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.passType = "VIP";
      await user.save();
    } else {
      // Create a dummy user for VIP
      const dummyPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword = await bcrypt.hash(dummyPassword, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        phone: "0000000000",
        clgName: clgName || "Invited Guest",
        isVerified: true,
        passType: "VIP",
        payment: true
      });
      await user.save();
    }

    // 📧 Send VIP Invitation email
    await transporter.sendMail({
      from: `"Invento 2026" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎟️ Exclusive Invitation: Invento 2026 VIP Access",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>VIP Invitation</h2>
          <p>Dear ${name},</p>
          <p>We are honored to invite you to Invento 2026 as a VIP Guest.</p>
          <p>Your digital pass is attached to your account. You can access it by logging in with your email.</p>
          <p style="font-weight: bold;">Your Secret Entry ID: ${user._id}</p>
          <p>See you at the Spyverse!</p>
        </div>
      `
    });

    res.json({ success: true, message: "VIP invitation sent.", id: user._id });
  } catch (error) {
    console.error("Error in inviteVIP:", error);
    res.status(500).json({ message: "Error sending VIP invitation." });
  }
};

// ==========================================
// 🔑 Passwordless Login (OTP)
// ==========================================

export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No agent found with this email frequency." });

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const hashedOTP = await bcrypt.hash(otp, 10);
    user.otp = hashedOTP;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await transporter.sendMail({
      from: `"Invento 2026 Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Priority Access Code - INVENTO 2026",
      html: spaceMail("ACCESS CODE REQUESTED", "Use the following One-Time Password to access your dossier.", otp, user.name, user._id),
    });

    res.status(200).json({ message: "Access code transmitted to secure channel (Email)." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Transmission failed." });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Agent not found." });
    if (!user.otp || !user.otpExpiresAt || Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ message: "Access code expired. Request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid access code." });

    // Clear OTP and Verify User
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    return res.status(200).json({
      message: "Access Granted.",
      token,
      payment: user.payment,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        clgName: user.clgName,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        passType: user.passType,
        registeredEvents: user.registeredEvents
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login verification failed." });
  }
};