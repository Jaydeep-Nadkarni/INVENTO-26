import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import dotenv from "dotenv";
import { verifyGoogleIdToken } from "../services/authService.js";
import { processProfilePhoto } from "../services/imageService.js";
import { generateToken } from "../services/jwtService.js";

dotenv.config();

// ================= GOOGLE AUTH =================
/**
 * @route   POST /api/users/auth/google
 * @desc    Verify Firebase ID Token and handle user login/registration
 * @access  Public
 */
export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    return res.status(400).json({ message: "ID Token is required." });
  }

  try {
    const { uid, email, emailVerified } = await verifyGoogleIdToken(idToken);
    
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // Check if user exists by email (legacy transition)
      user = await User.findOne({ email });
      if (user) {
        // Link existing account to Firebase UID
        user.firebaseUid = uid;
        user.emailVerified = emailVerified;
        await user.save();
      } else {
        // Create new minimal user for onboarding
        // Using placeholders for required fields until onboarding is complete
        user = new User({
          firebaseUid: uid,
          email,
          emailVerified,
          onboardingCompleted: false,
          name: "New Agent", // Placeholder
          phone: "0000000000", // Placeholder
          clgName: "Invento Academy", // Placeholder
          gender: "Other", // Placeholder
        });
        await user.save();
      }
    }

    // Generate token only if onboarding is already completed
    let token = null;
    if (user.onboardingCompleted) {
      token = generateToken(user);
    }

    res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        name: user.name,
        clgName: user.clgName,
        profilePhoto: user.profilePhoto,
        firebaseUid: user.firebaseUid
      }
    });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(401).json({ message: "Verification failed: " + error.message });
  }
};

// ================= COMPLETE ONBOARDING =================
/**
 * @route   POST /api/users/auth/onboarding
 * @desc    Complete user profile after Google sign-in
 * @access  Public (Validated via firebaseUid)
 */
export const completeOnboarding = async (req, res) => {
  const { firebaseUid, name, phone, clgName, gender } = req.body;
  
  if (!firebaseUid || !name || !phone || !clgName || !gender) {
    return res.status(400).json({ message: "All fields are required for onboarding." });
  }

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.onboardingCompleted) {
       return res.status(400).json({ message: "Onboarding already completed." });
    }

    // Update profile photo if uploaded
    if (req.file) {
      try {
        const photoPath = await processProfilePhoto(req.file.buffer, user._id);
        user.profilePhoto = photoPath;
      } catch (error) {
        console.error("Error processing profile photo:", error);
      }
    }

    user.name = name;
    user.phone = phone;
    user.clgName = clgName;
    user.gender = gender;
    user.onboardingCompleted = true;

    await user.save();

    // Now generate the application JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Onboarding completed successfully.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        clgName: user.clgName,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error("Onboarding Error:", error.message);
    res.status(500).json({ message: "Onboarding failed: " + error.message });
  }
};

//===============GET USER PROFILE================
/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Fetch details for registered events
    const events = await Event.find({ name: { $in: user.registeredEvents } });

    const eventDetails = events.map(e => ({
      name: e.name,
      whatsappLink: e.whatsappLink,
      type: e.type
    }));

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

// 🎫 Public validation endpoint for event pass verification
export const validateUser = async (req, res) => {
  try {
    let { userId } = req.params;

    // Handle ID formatting (e.g., inv00108)
    const digits = userId.match(/\d+/);
    if (digits) {
      const seqNum = parseInt(digits[0]).toString().padStart(5, "0");
      userId = `inv${seqNum}`;
    }

    const user = await User.findById(userId).select('name email clgName profilePhoto passType onboardingCompleted');

    if (!user) {
      return res.status(404).json({
        verified: false,
        message: 'Agent not found in central directory',
      });
    }

    return res.status(200).json({
      verified: true,
      message: user.passType === 'VIP' ? 'VIP Guest Identified' : 'Agent identified',
      data: user
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
      return res.status(400).json({ message: "Name and Email are required." });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.passType = "VIP";
      await user.save();
    } else {
      user = new User({
        name,
        email,
        phone: "0000000000",
        clgName: clgName || "VIP Guest",
        passType: "VIP",
        onboardingCompleted: true,
        emailVerified: true,
        firebaseUid: `vip-${Date.now()}` // Bypass UID for manually invited VIPs
      });
      await user.save();
    }

    res.json({ success: true, message: "VIP designation granted.", id: user._id });
  } catch (error) {
    console.error("Error in inviteVIP:", error);
    res.status(500).json({ message: "Error granting VIP status." });
  }
};
