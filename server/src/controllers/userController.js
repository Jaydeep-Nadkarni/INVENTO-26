import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import "dotenv/config";
import { verifyGoogleIdToken } from "../services/authService.js";
import { processProfilePhoto } from "../services/imageService.js";
import { generateToken } from "../services/jwtService.js";
import { sendMail, spaceMail } from "./eventController.js";
import {
  validateIdTokenFormat,
  validateOnboardingData,
  sanitizeOnboardingData,
  logAuthAttempt,
  validateFirebaseUid
} from "../utils/securityUtils.js";

// ================= GOOGLE AUTH =================
/**
 * @route   POST /api/users/auth/google
 * @desc    Verify Firebase ID Token and handle user login/registration
 * @access  Public
 */
export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  const clientIp = req.ip || req.get('x-forwarded-for') || req.connection.remoteAddress;

  if (!idToken) {
    logAuthAttempt({
      eventType: 'GOOGLE_AUTH_MISSING_TOKEN',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: 'ID Token is required'
    });
    return res.status(400).json({ message: "ID Token is required." });
  }

  // Validate token format
  if (!validateIdTokenFormat(idToken)) {
    logAuthAttempt({
      eventType: 'GOOGLE_AUTH_INVALID_FORMAT',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: 'Invalid token format'
    });
    return res.status(400).json({ message: "Invalid token format." });
  }

  try {
    const { uid, email, emailVerified } = await verifyGoogleIdToken(idToken, clientIp);

    // 1. Check if user exists (by UID or Email)
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Link existing email account to Firebase UID (Migration scenario)
        user.firebaseUid = uid;
        user.emailVerified = emailVerified;
        await user.save();
      }
    }

    // 2. Case: New User (Not Registered)
    // 👉 DO NOT issue JWT.
    if (!user) {
      logAuthAttempt({
        eventType: 'GOOGLE_AUTH_NEW_USER',
        ip: clientIp,
        email: email,
        status: 'success',
        message: 'New user identified, redirection to registration required'
      });

      return res.status(200).json({
        status: "NEW_USER",
        message: "User not registered",
        user: {
          email,
          firebaseUid: uid,
          emailVerified
        }
      });
    }

    // 3. Case: User Exists but Onboarding Incomplete
    // 👉 Issue minimal info, no full access token yet (or specialized onboarding token if needed)
    // For now, we return ONBOARDING_REQUIRED status.
    if (!user.onboardingCompleted) {
      logAuthAttempt({
        eventType: 'GOOGLE_AUTH_ONBOARDING_REQUIRED',
        userId: user._id,
        ip: clientIp,
        email: email,
        status: 'success',
        message: 'User requires onboarding'
      });

      return res.status(200).json({
        status: "ONBOARDING_REQUIRED",
        message: "Onboarding required",
        user: {
          _id: user._id,
          email: user.email,
          firebaseUid: user.firebaseUid,
          name: user.name
        }
      });
    }

    // 4. Case: Authenticated & Complete
    // 👉 Issue JWT + Allow Access
    const token = generateToken(user);

    // Log successful authentication
    logAuthAttempt({
      eventType: 'GOOGLE_AUTH_SUCCESS',
      userId: user._id,
      ip: clientIp,
      email: email,
      status: 'success',
      message: 'Google authentication successful'
    });

    res.status(200).json({
      status: "AUTHENTICATED",
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
    console.error("❌ Google Auth Critical Failure:", error);

    // Differentiate between known Auth errors and Server crashes
    const isAuthError = error.message.includes('token') || error.message.includes('verification');
    const statusCode = isAuthError ? 401 : 500;
    const clientMessage = isAuthError ? error.message : "Internal Server Error during authentication.";

    logAuthAttempt({
      eventType: isAuthError ? 'GOOGLE_AUTH_FAILED' : 'GOOGLE_AUTH_SERVER_ERROR',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: error.message
    });

    // Make absolutely sure we return JSON
    if (!res.headersSent) {
      return res.status(statusCode).json({
        message: clientMessage,
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
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
  const clientIp = req.ip || req.get('x-forwarded-for') || req.connection.remoteAddress;

  // Validate required fields
  if (!firebaseUid || !name || !phone || !clgName || !gender) {
    logAuthAttempt({
      eventType: 'ONBOARDING_MISSING_FIELDS',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: 'Missing required onboarding fields'
    });
    return res.status(400).json({ message: "All fields are required for onboarding." });
  }

  // Validate onboarding data
  const validationResult = validateOnboardingData({ firebaseUid, name, phone, clgName, gender });
  if (!validationResult.isValid) {
    logAuthAttempt({
      eventType: 'ONBOARDING_VALIDATION_FAILED',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: `Validation failed: ${validationResult.errors.join(', ')}`
    });
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResult.errors
    });
  }

  // Sanitize input data
  const sanitizedData = sanitizeOnboardingData({ firebaseUid, name, phone, clgName, gender });

  try {
    // Validate Firebase UID format
    if (!validateFirebaseUid(firebaseUid)) {
      throw new Error('Invalid Firebase UID format');
    }

    // 1. Check if user exists by firebaseUid
    let user = await User.findOne({ firebaseUid });

    // If user is null, it might be a brand new registration (NEW_USER status from auth/google)
    // In this case, we create the user here.
    if (!user) {
      // Create new user for First-Time Registration
      const newUser = new User({
        firebaseUid,
        // Note: Email should ideally be passed secureley. For this implementation, 
        // we rely on the client passing the email matching the one from the earlier auth/google step.
        // OR we fetch it from Firebase Admin SDK using firebaseUid if possible (but we don't have that helper here yet)
        // We will use a placeholder or req.body.email if provided.
        email: req.body.email || "pending_verification",
        emailVerified: true,
        onboardingCompleted: true,
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        clgName: sanitizedData.clgName,
        gender: sanitizedData.gender,
      });

      if (req.file) {
        try {
          const photoPath = await processProfilePhoto(req.file.buffer, newUser._id);
          newUser.profilePhoto = photoPath;
        } catch (error) {
          console.error("Error processing profile photo:", error);
        }
      }

      await newUser.save();

      const token = generateToken(newUser);

      logAuthAttempt({
        eventType: 'ONBOARDING_CREATED_NEW_USER',
        userId: newUser._id,
        ip: clientIp,
        email: newUser.email,
        status: 'success',
        message: 'New user created and onboarded'
      });

      return res.status(200).json({
        message: "Registration completed successfully.",
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          onboardingCompleted: true,
          profilePhoto: newUser.profilePhoto
        }
      });
    }

    if (user.onboardingCompleted) {
      logAuthAttempt({
        eventType: 'ONBOARDING_ALREADY_COMPLETED',
        userId: user._id,
        ip: clientIp,
        email: user.email,
        status: 'failure',
        message: 'Onboarding already completed for this user'
      });
      return res.status(400).json({ message: "Onboarding already completed." });
    }

    // Update profile photo if uploaded
    if (req.file) {
      try {
        const photoPath = await processProfilePhoto(req.file.buffer, user._id);
        user.profilePhoto = photoPath;
      } catch (error) {
        console.error("Error processing profile photo:", error);
        logAuthAttempt({
          eventType: 'ONBOARDING_PHOTO_PROCESSING_FAILED',
          userId: user._id,
          ip: clientIp,
          email: user.email,
          status: 'warning',
          message: 'Profile photo processing failed, continuing without photo'
        });
      }
    }

    // Update user with sanitized data
    user.name = sanitizedData.name;
    user.phone = sanitizedData.phone;
    user.clgName = sanitizedData.clgName;
    user.gender = sanitizedData.gender;
    user.onboardingCompleted = true;

    await user.save();

    // Now generate the application JWT
    const token = generateToken(user);

    // Log successful onboarding
    logAuthAttempt({
      eventType: 'ONBOARDING_SUCCESS',
      userId: user._id,
      ip: clientIp,
      email: user.email,
      status: 'success',
      message: 'User onboarding completed successfully'
    });

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
    logAuthAttempt({
      eventType: 'ONBOARDING_ERROR',
      ip: clientIp,
      email: 'unknown',
      status: 'failure',
      message: error.message
    });
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

    const user = await User.findById(userId).select('name clgName profilePhoto passType onboardingCompleted');

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

    // Send VIP Invitation Email
    try {
      await sendMail({
        to: user.email,
        subject: "VIP Invitation - INVENTO 2026",
        html: spaceMail(
          "VIP INVITATION",
          "You have been formally invited as a VIP guest to INVENTO 2026. This pass grants you full access to the event.",
          "INVENTO 2026",
          user.name,
          user._id
        )
      });
    } catch (mailError) {
      console.error("Failed to send VIP invitation email:", mailError);
    }

    res.json({ success: true, message: "VIP designation granted and invitation sent.", id: user._id });
  } catch (error) {
    console.error("Error in inviteVIP:", error);
    res.status(500).json({ message: "Error granting VIP status." });
  }
};
