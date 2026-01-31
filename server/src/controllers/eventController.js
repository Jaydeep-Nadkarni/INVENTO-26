import "dotenv/config";
import mongoose from "mongoose";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import ContingentKey from "../models/contingentKeyModel.js";
import GlobalSettings from "../models/globalSettingsModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Razorpay from "razorpay";
import {
  SlotFullError,
  InvalidGenderError,
  DuplicateRegistrationError,
  ContingentLimitError,
  EventNotFoundError,
  RegistrationClosedError,
  TeamSizeError
} from "../utils/customErrors.js";
import { getStaticEvent } from "../utils/staticData.js";

/* ================= RAZORPAY ================= */
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'missing_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing_secret',
  });
};

/* ================= MAIL TRANSPORT ================= */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const transporter = createTransporter();

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Mail server connection error ❌:", error.message);
  } else {
    console.log("Mail server connection successful ✅");
  }
});

/**
 * Sends an email using the centralized transporter
 * @param {Object} options - { to, subject, html }
 */
export const sendMail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Mail credentials missing in environment variables!");
      return null;
    }

    const mailOptions = {
      from: `"Invento 2026" <${process.env.EMAIL_USER.trim()}>`,
      ...options,
      to: options.to.trim()
    };

    console.log(`Attempting to send email to: ${mailOptions.to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${mailOptions.to}: ${info.messageId} ✅`);
    return info;
  } catch (error) {
    console.error(`Mail Sending Failed to ${options.to}:`, error.message);
    // Don't throw error to prevent breaking the main application flow
    return null;
  }
};


/* ================= HTML MAIL ================= */
export const spaceMail = (title, message, eventName, userName, id, paymentId, whatsappLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed - INVENTO 2026</title>
  <style>
    /* Reset styles for email clients */
    body, table, td, p, h1 {
      margin: 0;
      padding: 0;
    }
    body {
      width: 100% !important;
      height: 100% !important;
      background-color: #000000;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    /* App-like interactions for the intelligence hub */
    .intel-box {
      background: #0a0a0a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 20px;
      margin-top: 40px;
      text-align: left;
    }
    .chat-display {
      height: 150px;
      overflow-y: auto;
      background: #000;
      border: 1px solid #334155;
      padding: 10px;
      border-radius: 8px;
      font-size: 13px;
      color: #38bdf8;
      font-family: monospace;
      margin-bottom: 10px;
    }
    .input-group {
      display: flex;
      gap: 10px;
    }
    input {
      flex-grow: 1;
      background: #111827;
      border: 1px solid #334155;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      outline: none;
    }
    button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: opacity 0.2s;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; color: #e5e7eb;">

  <!-- Main Wrapper Table -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="background-color: #000000; border-radius: 12px;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Content Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 600px; width: 100%;">
          
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <img
                src="https://i.postimg.cc/vTBzkb7R/logo.png"
                alt="INVENTO 2026"
                width="180"
                style="display: block; border: 0;"
              />
            </td>
          </tr>

          <!-- Title Section -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; font-weight: 700;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Message Section -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #cbd5e1; max-width: 480px;">
                ${message}<br><br>
                Your payment and registration have been successfully verified. Kindly keep this email for the records.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td align="center" style="padding-bottom: 35px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                  <td height="1" style="font-size: 1px; line-height: 1px; background: linear-gradient(to right, transparent, #ef4444, transparent);">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Details Table -->
          <tr>
            <td align="center" style="padding-bottom: 35px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="max-width: 400px; margin: 0 auto;">
                <tr>
                  <td width="40%" align="left" style="padding: 10px 0; font-size: 14px; color: #94a3b8; border-bottom: 1px solid #1f2937;">Event</td>
                  <td width="60%" align="right" style="padding: 10px 0; font-size: 14px; color: #ffffff; font-weight: 600; border-bottom: 1px solid #1f2937;">
                    ${eventName}
                  </td>
                </tr>
                <tr>
                  <td width="40%" align="left" style="padding: 10px 0; font-size: 14px; color: #94a3b8; border-bottom: 1px solid #1f2937;">Participant</td>
                  <td width="60%" align="right" style="padding: 10px 0; font-size: 14px; color: #ffffff; border-bottom: 1px solid #1f2937;">
                    ${userName}
                  </td>
                </tr>
                <tr>
                  <td width="40%" align="left" style="padding: 10px 0; font-size: 14px; color: #94a3b8; border-bottom: 1px solid #1f2937;">Payment ID / UTR</td>
                  <td width="60%" align="right" style="padding: 10px 0; font-size: 14px; color: #ffffff; font-weight: 600; border-bottom: 1px solid #1f2937;">
                    ${paymentId || "N/A (Official/Free)"}
                  </td>
                </tr>
                <tr>
                  <td width="40%" align="left" style="padding: 15px 0 10px 0; font-size: 14px; color: #94a3b8;">Invento ID</td>
                  <td width="60%" align="right" style="padding: 15px 0 10px 0;">
                    <span id="invento-id" style="font-family: 'Courier New', Courier, monospace; background-color: #111827; padding: 6px 12px; border-radius: 6px; color: #38bdf8; border: 1px solid #1e293b; text-transform: uppercase;">
                      ${id}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WhatsApp Section (Conditional) -->
          ${whatsappLink ? `
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #cbd5e1;">
                Join the official event WhatsApp group for updates:
              </p>
              <a href="${whatsappLink}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #25d366; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; border: 1px solid #128c7e;">
                Join WhatsApp Group
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- Status Badge -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                  <td align="center" style="padding: 12px 24px; border: 1px solid #16a34a; border-radius: 50px; background-color: rgba(22, 163, 74, 0.05);">
                    <span style="font-size: 13px; letter-spacing: 1.5px; color: #22c55e; font-weight: 700;">
                      ✔ REGISTRATION SUCCESSFUL
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Text -->
          <tr>
            <td align="center" style="padding-top: 40px; padding-bottom: 25px;">
              <p style="font-size: 15px; color: #ffffff;">
                See you at INVENTO 2026.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <p style="font-size: 13px; line-height: 1.5; color: #94a3b8;">
                Technical Team,<br>
                <strong>INVENTO 2026</strong>
              </p>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td align="center">
              <p style="font-size: 11px; color: #475569; letter-spacing: 0.5px;">
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const verifyRazorpayPayment = (orderId, paymentId, signature) => {
  console.log(`[verifyRazorpayPayment] Checking: Order=${orderId}, Payment=${paymentId}, Sig=${signature ? 'Present' : 'MISSING'}`);
  const body = `${orderId}|${paymentId}`;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error("[verifyRazorpayPayment] RAZORPAY_KEY_SECRET is missing!");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const isValid = expectedSignature === signature;
  if (!isValid) {
    console.warn(`[verifyRazorpayPayment] Mismatch!`);
    console.warn(`Order: ${orderId}, Payment: ${paymentId}`);
    // Only log first 4 chars of expected signature for debugging
    console.warn(`Expected starts with: ${expectedSignature.substring(0, 4)}...`);
    console.warn(`Received starts with: ${signature ? signature.substring(0, 4) : 'NULL'}...`);
  }
  return isValid;
};


// Shared validation for registration and order creation


// Extracted Helper for validation to be reused or cleaner
const validateHelper = async (event, inventoId, members, teamName, isOfficial, contingentKey, session) => {
  const staticEvent = getStaticEvent(event._id || event.id);
  const rawType = staticEvent?.type ? String(staticEvent.type) : "Solo";
  let eventType = rawType.trim().toUpperCase();

  const minTeamSize = Number(staticEvent?.team?.min) || 1;
  const maxTeamSize = Number(staticEvent?.team?.max) || 1;

  if (minTeamSize === 1 && maxTeamSize === 1) {
    eventType = "SOLO";
  }

  if (event.registration?.officialOnly && !isOfficial) {
    throw new Error("Registration for this event is restricted to official entries only.");
  }

  // if (!mongoose.Types.ObjectId.isValid(inventoId)) {
  //   throw new Error("Invalid Invento ID format.");
  // }

  // Handle session properly - it can be null during createOrder
  const user = session
    ? await User.findById(inventoId).session(session)
    : await User.findById(inventoId);
  if (!user) throw new Error("Invalid Invento ID.");

  // Official Key Validation
  if (isOfficial) {
    if (!contingentKey) throw new Error("Contingent Key required for official registration.");
    const keyDoc = session
      ? await ContingentKey.findOne({ key: contingentKey }).session(session)
      : await ContingentKey.findOne({ key: contingentKey });
    if (!keyDoc) throw new Error("Invalid Contingent Key.");

    const currentOfficialCount = [
      ...event.registrations.participants,
      ...event.registrations.teams
    ].filter(r => r.isOfficial && r.contingentKey === contingentKey).length;

    const limit = event.registration?.officialTeamsPerCollege || 1;
    if (currentOfficialCount >= limit) {
      throw new ContingentLimitError(`Limit reached: Maximum ${limit} official registration(s) allowed per college for this event.`);
    }
  }

  // Determine if this is a solo event - more robust detection
  const hasNoMembers = !members ||
    (Array.isArray(members) && members.length === 0) ||
    (typeof members === 'string' && members.trim() === '');

  const isSoloEvent = eventType === "SOLO" ||
    (minTeamSize === 1 && maxTeamSize === 1) ||
    hasNoMembers;
  // SOLO Logic
  if (isSoloEvent) {
    // Solo event logic
    if (event.registrations.participants.some(p => p.inventoId === inventoId)) {
      throw new DuplicateRegistrationError();
    }

    const isGenderSpecific = event.isGenderSpecific || staticEvent?.isGenderSpecific;
    const category = isOfficial ? "official" : "open";

    if (isGenderSpecific) {
      const gender = user.gender?.toLowerCase();
      const slotKey = (gender === "male") ? "availableMale" : (gender === "female" ? "availableFemale" : null);
      if (!slotKey) throw new InvalidGenderError("Gender required for this event (Male/Female).");

      const currentGenderSlots = event.slots[category][slotKey];
      if (currentGenderSlots <= 0) {
        throw new SlotFullError(`No more ${category} slots for ${user.gender} participants.`);
      }
    } else {
      if (event.slots[category].available <= 0) throw new SlotFullError(`No ${category} slots available.`);
    }

    return { user, staticEvent, eventType, minTeamSize, maxTeamSize, members: [user._id] };
  }
  // TEAM Logic
  // TEAM Logic - only if not solo
  else {
    let parsedMembers = [];

    // Parse members input
    if (typeof members === 'string') {
      try {
        parsedMembers = JSON.parse(members);
      } catch (err) {
        console.error(`[validateHelper] JSON parse error for members: ${err.message}`);
        throw new Error("Invalid members JSON format.");
      }
    } else if (Array.isArray(members)) {
      parsedMembers = members;
    } else {
      throw new Error("Members must be provided as an array or valid JSON string for team events.");
    }

    // Validate team name
    if (!teamName || teamName.trim() === "") {
      throw new Error("Team Name is required for team events.");
    }

    // Validate members array
    if (!Array.isArray(parsedMembers) || parsedMembers.length === 0) {
      throw new Error("Members list is required and cannot be empty for team events.");
    }

    // Get unique member IDs
    const uniqueMembers = [...new Set(parsedMembers.map(m => m.toString()))];
    const memberCount = uniqueMembers.length;

    // Validate team size
    if (memberCount < minTeamSize || memberCount > maxTeamSize) {
      throw new TeamSizeError(
        `Team must have between ${minTeamSize} and ${maxTeamSize} members. Current team has ${memberCount} member(s).`
      );
    }

    // Verify all members exist in Database
    const memberDocs = session
      ? await User.find({ _id: { $in: uniqueMembers } }).session(session)
      : await User.find({ _id: { $in: uniqueMembers } });

    if (memberDocs.length !== uniqueMembers.length) {
      const foundIds = memberDocs.map(d => d._id.toString());
      const missingIds = uniqueMembers.filter(id => !foundIds.includes(id));
      throw new Error(`One or more team members do not have valid accounts: ${missingIds.join(", ")}`);
    }

    // Validate leader is included in members
    if (!uniqueMembers.includes(inventoId.toString())) {
      throw new Error("Team leader must be included in the members list.");
    }

    // Check for duplicate registrations
    const alreadyRegistered = event.registrations.teams.some(team =>
      team.members.some(m => uniqueMembers.includes(m.inventoId.toString()))
    );
    if (alreadyRegistered) {
      throw new DuplicateRegistrationError("One or more team members are already registered for this event.");
    }

    // Check available slots
    // Check available slots
    const category = isOfficial ? "official" : "open";
    if (event.slots[category].available <= 0) {
      throw new SlotFullError(`No ${category} slots available for team registration.`);
    }

    return {
      user,
      staticEvent,
      eventType,
      minTeamSize,
      maxTeamSize,
      members: uniqueMembers
    };
  }
};

// Wrapper for existing function signature compatibility
const validateEventRegistration = async (event, { inventoId, members, teamName, isOfficial, contingentKey }, session = null) => {
  return validateHelper(event, inventoId, members, teamName, isOfficial, contingentKey, session);
};

export const createOrder = async (req, res) => {
  const { eventId, inventoId, members, teamName, isOfficial, contingentKey } = req.body;
  if (!eventId) return res.status(400).json({ message: "Event ID required" });

  try {
    const event = await Event.findOne({ $or: [{ _id: eventId }, { id: eventId }] });
    if (!event) throw new EventNotFoundError();

    // Perform validation BEFORE creating order (pass null for session)
    let validatedMembers = [];
    let eventType = "SOLO";
    try {
      const valResult = await validateEventRegistration(event, { inventoId, members, teamName, isOfficial, contingentKey }, null);
      validatedMembers = valResult.members;
      eventType = valResult.eventType;
    } catch (valErr) {
      return res.status(valErr.statusCode || 400).json({ error: valErr.name, message: valErr.message });
    }

    if (event.price === 0) {
      return res.json({ free: true });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id === 'missing_key') {
      return res.status(500).json({ message: "Payment gateway is not configured on server" });
    }

    const razorpay = new Razorpay({ key_id, key_secret });
    const quantity = event.isPricePerPerson ? (validatedMembers ? validatedMembers.length : 1) : 1;
    const options = {
      amount: Math.round(event.price * quantity * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${eventId.slice(0, 20)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ ...order, keyId: key_id });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  const reqId = Date.now();
  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      // Global Registration Check
      const globalSettings = await GlobalSettings.getSettings();
      if (!globalSettings.registrationsOpen) {
        throw new Error("All event registrations are currently closed by administration.");
      }

      const {
        inventoId, teamName, members, razorpay_order_id, razorpay_payment_id, razorpay_signature,
        isOfficial, contingentKey, paymentId
      } = req.body;

      const eventIdParam = req.params.id.trim();
      const event = await Event.findOne({ $or: [{ _id: eventIdParam }, { id: eventIdParam }] }).session(session);
      if (!event) throw new EventNotFoundError();

      // Shared Validation
      const { user, staticEvent, eventType, members: validatedMembers } = await validateEventRegistration(
        event, { inventoId, members, teamName, isOfficial, contingentKey }, session
      );

      const whatsappLink = event.whatsapplink || staticEvent?.whatsapplink || "";
      const finalPaymentId = razorpay_payment_id || paymentId;

      // Payment Verification
      if (!isOfficial && event.price > 0) {
        if (!verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
          throw new Error("Payment verification failed");
        }
        const usedPayment = await Payment.findOne({ paymentId: razorpay_payment_id, eventId: event._id }).session(session);
        if (usedPayment) throw new Error("Payment already used.");
      }

      const status = (event.price > 0 && !isOfficial) ? "CONFIRMED" : "PENDING";
      const isGenderSpecific = event.isGenderSpecific || staticEvent?.isGenderSpecific;
      const category = isOfficial ? "official" : "open";

      if (eventType === "SOLO") {
        if (isGenderSpecific) {
          const gender = user.gender?.toLowerCase();
          const slotKey = (gender === "male") ? "male" : (gender === "female") ? "female" : null;
          if (!slotKey) throw new InvalidGenderError("Gender required for this event (Male/Female).");

          if (event.slots[category].gender[slotKey] <= 0) {
            throw new SlotFullError(`No more ${category} slots for ${user.gender} participants.`);
          }
          event.slots[category].gender[slotKey] -= 1;
        } else {
          event.slots[category].available -= 1;
        }

        event.registrations.participants.push({
          inventoId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          clgName: user.clgName,
          paid: (event.price > 0 && !isOfficial),
          paymentId: finalPaymentId,
          status,
          isOfficial: !!isOfficial,
          contingentKey
        });
      }
      else {
        // TEAM Registration logic (Atomic)
        const memberData = await User.find({ _id: { $in: validatedMembers } }).session(session);
        event.registrations.teams.push({
          teamName,
          leaderId: inventoId,
          status,
          isOfficial: !!isOfficial,
          contingentKey,
          paymentId: finalPaymentId,
          members: memberData.map(u => ({
            inventoId: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            clgName: u.clgName
          }))
        });
        event.slots[category].available -= 1;
      }

      await event.save({ session });

      // Update users' registeredEvents and passType
      const userList = eventType === "SOLO" ? [user] : await User.find({ _id: { $in: validatedMembers } }).session(session);
      for (const u of userList) {
        if (!u.registeredEvents.includes(event.name)) u.registeredEvents.push(event.name);
        u.passType = isOfficial ? "AAA" : (u.passType === "G" ? "A" : u.passType);
        await u.save({ session });
      }

      if (event.price > 0 && !isOfficial) {
        await Payment.create([{ paymentId: razorpay_payment_id, orderId: razorpay_order_id, eventId: event._id }], { session });
      }

      return { type: eventType, user, eventName: event.name, whatsappLink, teamName, userList, paymentId: finalPaymentId };
    });

    // Send Mail to all participants
    if (result.userList && result.userList.length > 0) {
      console.log(`[Registration] Sending confirmation emails to ${result.userList.length} participant(s) for event: ${result.eventName}`);
      const mailPromises = result.userList.map(recipient => {
        console.log(`[Registration] Queueing mail for: ${recipient.email} (${recipient.name})`);
        return sendMail({
          to: recipient.email,
          subject: `Registration Success: ${result.eventName}`,
          html: spaceMail(
            result.type === "SOLO" ? "REGISTRATION CONFIRMED" : "TEAM REGISTRATION CONFIRMED",
            result.type === "SOLO" ? "You are successfully registered!" : `Team ${result.teamName} is successfully registered!`,
            result.eventName, recipient.name, recipient._id, result.paymentId, result.whatsappLink
          )
        }).catch(err => console.error(`[Registration] Mail Error for ${recipient.email}:`, err.message));
      });

      // We don't necessarily need to await all mails before responding to the user, 
      // but we do it to maintain current behavior of ensuring mail attempt.
      await Promise.all(mailPromises);
    }

    res.json({ message: "Registration successful", whatsappLink: result.whatsappLink });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(error.statusCode || 400).json({ error: error.name, message: error.message });
  } finally {
    session.endSession();
  }
};

export const validateKey = async (req, res) => {
  try {
    const { key } = req.body;
    const keyDoc = await ContingentKey.findOne({ key });
    if (!keyDoc) {
      return res.status(404).json({ success: false, message: "Invalid Contingent Key" });
    }
    res.json({ success: true, clgName: keyDoc.clgName });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error validating key" });
  }
};

// Add new contingent key (Admin only)
export const addContingentKey = async (req, res) => {
  try {
    const { clgName, key } = req.body;
    const newKey = await ContingentKey.create({ clgName, key });
    res.status(201).json({ success: true, data: newKey });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= STATUS & ATTENDANCE ================= */

// Update individual participant status
export const updateParticipantStatus = async (req, res) => {
  const { eventId, inventoId } = req.params;
  const { status } = req.body;

  const validStatuses = ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const event = await Event.findOne({
        $or: [{ _id: eventId }, { id: eventId }]
      }).session(session);

      if (!event) throw new Error("Event not found");

      const participant = event.registrations.participants.find(p => p.inventoId === inventoId);
      if (!participant) throw new Error("Participant not found");

      const isGenderSpecific = event.isGenderSpecific;
      let slotKey = null;
      if (isGenderSpecific) {
        // Fetch user to check gender
        const user = await User.findById(inventoId).session(session);
        if (user) {
          const gender = user.gender?.toLowerCase();
          if (gender === "male") slotKey = "male";
          else if (gender === "female") slotKey = "female";
        }
      }

      const oldStatus = participant.status;
      const isActive = (s) => ["CONFIRMED", "PENDING"].includes(s);

      const wasActive = isActive(oldStatus);
      const nowActive = isActive(status);

      // Handle slot logic (Exclusive: Gender vs General)
      // Handle slot logic (Exclusive: Gender vs General)
      // Determine category (default open if not specified, but we should check participant.isOfficial)
      const isOfficial = participant.isOfficial;
      const category = isOfficial ? "official" : "open";

      if (nowActive && !wasActive) {
        if (slotKey) {
          // New Structure: slots[category].gender[slotKey]
          if (event.slots[category].gender[slotKey] <= 0) {
            throw new Error(`No ${category} ${slotKey} slots available in ${event.name}`);
          }
          event.slots[category].gender[slotKey] -= 1;
        } else {
          if (event.slots[category].available <= 0) {
            throw new Error(`No ${category} slots available to activate this participant`);
          }
          event.slots[category].available -= 1;
        }
      } else if (!nowActive && wasActive) {
        if (slotKey) {
          event.slots[category].gender[slotKey] += 1;
        } else {
          event.slots[category].available += 1;
        }
      }

      participant.status = status;
      // Mark modified to ensure updatedAt is bumped even if only subdocs changed
      event.markModified('registrations.participants');
      event.markModified('specificSlots');
      await event.save({ session });
    });

    res.status(200).json({ message: `Participant status updated to ${status}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Update individual participant attendance
export const updateParticipantAttendance = async (req, res) => {
  const { eventId, inventoId } = req.params;
  const { isPresent } = req.body;

  try {
    const event = await Event.findOne({
      $or: [{ _id: eventId }, { id: eventId }]
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    const participant = event.registrations.participants.find(p => p.inventoId === inventoId);
    if (!participant) return res.status(404).json({ message: "Participant not found" });

    participant.isPresent = isPresent;
    event.markModified('registrations.participants');
    await event.save();

    res.status(200).json({ message: `Participant attendance updated to ${isPresent}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update team status
export const updateTeamStatus = async (req, res) => {
  const { eventId, teamName } = req.params;
  const { status } = req.body;

  const validStatuses = ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const event = await Event.findOne({
        $or: [{ _id: eventId }, { id: eventId }]
      }).session(session);

      if (!event) throw new Error("Event not found");

      const team = event.registrations.teams.find(t => t.teamName === teamName);
      if (!team) throw new Error("Team not found");

      const oldStatus = team.status;
      const isActive = (s) => ["CONFIRMED", "PENDING"].includes(s);

      const wasActive = isActive(oldStatus);
      const nowActive = isActive(status);

      // Handle slot logic
      const isOfficial = team.isOfficial;
      const category = isOfficial ? "official" : "open";

      // Handle slot logic
      if (nowActive && !wasActive) {
        if (event.slots[category].available <= 0) {
          throw new Error(`No ${category} slots available to activate this team`);
        }
        event.slots[category].available -= 1;
      } else if (!nowActive && wasActive) {
        event.slots[category].available += 1;
      }

      team.status = status;
      event.markModified('registrations.teams');
      await event.save({ session });
    });

    res.status(200).json({ message: `Team status updated to ${status}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Update team member attendance
export const updateMemberAttendance = async (req, res) => {
  const { eventId, teamName, inventoId } = req.params;
  const { isPresent } = req.body;

  try {
    const event = await Event.findOne({
      $or: [{ _id: eventId }, { id: eventId }]
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    const team = event.registrations.teams.find(t => t.teamName === teamName);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const member = team.members.find(m => m.inventoId === inventoId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.isPresent = isPresent;
    event.markModified('registrations.teams');
    await event.save();

    res.status(200).json({ message: `Member attendance updated to ${isPresent}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ANALYTICS ================= */

// GET /api/events/:eventId/stats
export const getEventStats = async (req, res) => {
  const { eventId } = req.params;
  try {
    const eventDoc = await Event.findOne({ $or: [{ _id: eventId }, { id: eventId }] }).lean();
    if (!eventDoc) return res.status(404).json({ message: "Event not found" });

    const staticEvent = getStaticEvent(eventDoc._id || eventDoc.id);
    const eventType = (staticEvent?.type || "Solo").toUpperCase();

    const results = await Event.aggregate([
      { $match: { _id: eventDoc._id } },
      {
        $facet: {
          participation: [
            {
              $project: {
                regs: {
                  $cond: [
                    { $eq: [eventType, "SOLO"] },
                    "$registrations.participants",
                    "$registrations.teams"
                  ]
                }
              }
            },
            { $unwind: "$regs" },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                official: { $sum: { $cond: ["$regs.isOfficial", 1, 0] } },
                nonOfficial: { $sum: { $cond: ["$regs.isOfficial", 0, 1] } },
                collegeWise: {
                  $push: {
                    clg: {
                      $cond: [
                        { $eq: [eventType, "SOLO"] },
                        "$regs.clgName",
                        { $arrayElemAt: ["$regs.members.clgName", 0] }
                      ]
                    }
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    const participation = results[0].participation[0] || { total: 0, official: 0, nonOfficial: 0, collegeWise: [] };

    const collegeCounts = participation.collegeWise.reduce((acc, curr) => {
      const clg = curr.clg || "Unknown";
      acc[clg] = (acc[clg] || 0) + 1;
      return acc;
    }, {});

    // Helper to calculate used slots
    const calcUsed = (total, available) => Math.max(0, (total || 0) - (available || 0));

    // Construct detailed slot stats
    const openSlots = eventDoc.slots.open || {};
    const officialSlots = eventDoc.slots.official || {};

    const stats = {
      name: eventDoc.name,
      // Aggregates
      totalSlots: (openSlots.total || 0) + (officialSlots.total || 0),
      availableSlots: (openSlots.available || 0) + (officialSlots.available || 0),
      usedSlots: calcUsed((openSlots.total || 0), (openSlots.available || 0)) + calcUsed((officialSlots.total || 0), (officialSlots.available || 0)),

      // Registration Counts
      totalRegistrations: participation.total,
      officialCount: participation.official,
      nonOfficialCount: participation.nonOfficial,

      // Detailed Breakdown
      slots: {
        open: {
          total: openSlots.total || 0,
          available: openSlots.available || 0,
          used: calcUsed(openSlots.total, openSlots.available),
          male: {
            available: (openSlots.gender?.male || 0),
            // Since we only maintain one number for gender specific (available/total combined semantically as 'remaining'), 
            // let's just show that value as 'available'. Total logic might need more fields if tracking is required.
            // For now, mirroring user's structure.
          },
          female: {
            available: (openSlots.gender?.female || 0),
          }
        },
        official: {
          total: officialSlots.total || 0,
          available: officialSlots.available || 0,
          used: calcUsed(officialSlots.total, officialSlots.available),
          male: {
            available: (officialSlots.gender?.male || 0)
          },
          female: {
            available: (officialSlots.gender?.female || 0)
          }
        }
      },

      collegeWise: collegeCounts
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/:eventId/participants (For SOLO)
export const getEventParticipants = async (req, res) => {
  const { eventId } = req.params;
  const { status, college, isOfficial, isPresent } = req.query;

  try {
    const matchStage = {};
    if (status) matchStage["status"] = status;
    if (college) matchStage["clgName"] = college;
    if (isOfficial !== undefined) matchStage["isOfficial"] = isOfficial === "true";
    if (isPresent !== undefined) matchStage["isPresent"] = isPresent === "true";

    const results = await Event.aggregate([
      { $match: { $or: [{ _id: eventId }, { id: eventId }] } },
      { $unwind: "$registrations.participants" },
      { $replaceRoot: { newRoot: "$registrations.participants" } },
      { $match: matchStage }
    ]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/:eventId/teams (For TEAM)
export const getEventTeams = async (req, res) => {
  const { eventId } = req.params;
  const { status, college, isOfficial } = req.query;

  try {
    const matchStage = {};
    if (status) matchStage["status"] = status;
    if (isOfficial !== undefined) matchStage["isOfficial"] = isOfficial === "true";
    if (college) matchStage["members.clgName"] = college;

    const results = await Event.aggregate([
      { $match: { $or: [{ _id: eventId }, { id: eventId }] } },
      { $unwind: "$registrations.teams" },
      { $replaceRoot: { newRoot: "$registrations.teams" } },
      { $match: matchStage }
    ]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/
export const getEvents = async (req, res) => {
  console.log("[getEvents] Requested - Fetching full event directory...");
  try {
    // We return all fields EXCEPT the registrations list (to keep it lightweight and private)
    // This ensures any live updates to slots, venues, or rules are sent to the frontend.
    const events = await Event.find({}, { "registrations": 0 }).lean();

    // Process events to nullify general slots for gender-based events as per request
    const processedEvents = events.map(event => {
      const isGenderSpecific = event.isGenderSpecific;
      if (isGenderSpecific) {
        return {
          ...event,
          slots: { ...event.slots, availableSlots: null }
        };
      }
      return event;
    });

    console.log(`[getEvents] Sending ${processedEvents.length} events to client.`);
    res.json(processedEvents);
  } catch (error) {
    console.error("[getEvents] CRITICAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event data accurately",
      error: error.message
    });
  }
};

// GET /api/events/analytics/overview
export const getFestOverview = async (req, res) => {
  try {
    const role = req.user.role?.toUpperCase();
    const isMaster = role === 'MASTER' || (role === 'ADMIN' && !req.user.access?.length);
    const isRegistration = (req.user.isRegistration === true) || (req.user.team === 'Registration');

    // Build filter
    const matchFilter = {};
    if (!isMaster && !isRegistration && req.user.access) {
      matchFilter.$or = [
        { _id: { $in: req.user.access.map(id => mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id) } },
        { id: { $in: req.user.access } }
      ];
    } else if (!isMaster && !isRegistration) {
      // If no access array and not master/reg, they shouldn't see anything
      return res.json({ totals: [], eventLeaderboard: [], collegeParticipation: [] });
    }

    const stats = await Event.aggregate([
      { $match: matchFilter },
      {
        $facet: {
          totals: [
            {
              $project: {
                price: 1,
                participants: "$registrations.participants",
                teams: "$registrations.teams"
              }
            },
            {
              $project: {
                soloCount: { $size: "$participants" },
                teamCount: { $size: "$teams" },
                soloRevenue: {
                  $multiply: [
                    { $size: { $filter: { input: "$participants", as: "p", cond: { $eq: ["$$p.paid", true] } } } },
                    "$price"
                  ]
                },
                teamRevenue: {
                  $multiply: [
                    { $size: { $filter: { input: "$teams", as: "t", cond: { $eq: ["$$t.paid", true] } } } },
                    "$price"
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalSoloRegistrations: { $sum: "$soloCount" },
                totalTeamRegistrations: { $sum: "$teamCount" },
                totalRevenue: { $sum: { $add: ["$soloRevenue", "$teamRevenue"] } }
              }
            }
          ],
          eventLeaderboard: [
            {
              $project: {
                name: 1,
                registrationCount: { $add: [{ $size: "$registrations.participants" }, { $size: "$registrations.teams" }] }
              }
            },
            { $sort: { registrationCount: -1 } },
            { $limit: 10 }
          ],
          collegeParticipation: [
            {
              $project: {
                clgs: {
                  $concatArrays: [
                    "$registrations.participants.clgName",
                    {
                      $reduce: {
                        input: "$registrations.teams",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this.members.clgName"] }
                      }
                    }
                  ]
                }
              }
            },
            { $unwind: "$clgs" },
            { $group: { _id: "$clgs", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          clubUnique: [
            {
              $project: {
                clubName: { $ifNull: ["$club", "General"] },
                allParticipants: {
                  $concatArrays: [
                    "$registrations.participants.inventoId",
                    {
                      $reduce: {
                        input: "$registrations.teams",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this.members.inventoId"] }
                      }
                    }
                  ]
                }
              }
            },
            { $unwind: "$allParticipants" },
            {
              $group: {
                _id: "$clubName",
                uniqueIds: { $addToSet: "$allParticipants" }
              }
            },
            {
              $project: {
                club: "$_id",
                count: { $size: "$uniqueIds" }
              }
            },
            { $sort: { count: -1 } }
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/registrations/all
export const getFestRegistrations = async (req, res) => {
  try {
    // Determine if we should filter events
    const role = req.user.role?.toUpperCase();
    const isMaster = role === 'MASTER' || (role === 'ADMIN' && !req.user.access?.length);
    const isRegistration = (req.user.isRegistration === true) || (req.user.team === 'Registration');

    // Build query
    const query = {};
    if (!isMaster && !isRegistration && req.user.access) {
      const objectIdAccess = req.user.access
        .filter(id => mongoose.isValidObjectId(id))
        .map(id => new mongoose.Types.ObjectId(id));

      query.$or = [
        { _id: { $in: objectIdAccess } },
        { id: { $in: req.user.access } }
      ];
    }

    const events = await Event.find(query, { name: 1, id: 1, eventType: 1, club: 1, registrations: 1 });
    let allParticipants = [];

    events.forEach(event => {
      const staticEvent = getStaticEvent(event._id || event.id);
      const eventType = (staticEvent?.type || "Solo").toUpperCase();

      const participants = event.registrations.participants.map(p => ({
        ...p.toObject(),
        eventName: event.name,
        eventId: event._id,
        eventType: eventType,
        team: event.club || 'General'
      }));

      const teams = event.registrations.teams.map(t => ({
        ...t.toObject(),
        eventName: event.name,
        eventId: event._id,
        eventType: eventType,
        team: event.club || 'General',
        isTeam: true
      }));

      allParticipants = [...allParticipants, ...participants, ...teams];
    });

    res.json(allParticipants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event details (Admin)
export const updateEventDetails = async (req, res) => {
  const { eventId } = req.params;
  const {
    price,
    slotsChange, // Legacy: assumed to be for 'open' category if not specific
    totalSlots,  // Legacy: assumed to be for 'open' category
    officialTotalSlots,
    officialSlotsChange,
    isOpen,
    officialOnly,
    specificSlotsUpdate,
    club,
    eventType
  } = req.body;

  try {
    const event = await Event.findOne({ $or: [{ _id: eventId }, { id: eventId }] });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Update Basic Info
    if (club !== undefined) event.club = club;
    if (eventType !== undefined) event.eventType = eventType;

    // Update Price
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: "Price must be a non-negative number" });
      }
      event.price = price;
    }

    // --- Slot Update Logic ---

    // Helper to update a specific slot category
    const updateSlotCategory = (category, change, absoluteTotal) => {
      const currentTotal = event.slots[category].total;
      const currentAvailable = event.slots[category].available;

      let delta = 0;
      if (absoluteTotal !== undefined) {
        const targetTotal = Number(absoluteTotal);
        if (Number.isNaN(targetTotal) || !Number.isFinite(targetTotal) || targetTotal < 0) {
          throw new Error(`Total slots for ${category} must be a non-negative number`);
        }
        delta = targetTotal - currentTotal;
      } else if (change !== undefined) {
        delta = Number(change);
        if (Number.isNaN(delta)) throw new Error(`Invalid change value for ${category}`);
      }

      if (delta !== 0) {
        const newTotal = currentTotal + delta;
        const newAvailable = currentAvailable + delta;

        if (newTotal < 0) throw new Error(`${category} total slots cannot be negative`);
        if (newAvailable < 0) throw new Error(`Cannot reduce ${category} capacity below occupied slots (Negative availability).`);

        event.slots[category].total = newTotal;
        event.slots[category].available = newAvailable;
      }
    };

    // 1. Update Open Slots (using specific or legacy fields)
    if (totalSlots !== undefined || slotsChange !== undefined) {
      updateSlotCategory('open', slotsChange, totalSlots);
    }

    // 2. Update Official Slots
    if (officialTotalSlots !== undefined || officialSlotsChange !== undefined) {
      updateSlotCategory('official', officialSlotsChange, officialTotalSlots);
    }

    // Update Registration Status
    if (isOpen !== undefined) event.registration.isOpen = isOpen;
    if (officialOnly !== undefined) event.registration.officialOnly = officialOnly;

    // Update Specific Slots (Gender Based)
    // Note: This logic assumes these specific slots belong to 'open', unless we want to support 'official' specific slots too.
    // For now, keeping it simpler or inferring based on structure updates if needed.
    // The previous implementation used event.specificSlots (Map) which is deprecated. 
    // We should now update event.slots.open.totalMale/availableMale etc.

    if (specificSlotsUpdate) {
      // TODO: Refactor this to support new schema if specificSlotsUpdate is used for gender counts
      // Currently, mapped to root-level specificSlots in previous code, checking if we need to migrate or redirect.
      // The new schema has slots.open.male/female etc.

      const ALLOWED_SLOT_KEYS = ["male", "female"];

      // Let's assume updates are for 'open' category unless specified in key? 
      // Or usually gender specific events are just one pool split by gender.
      // If isGenderSpecific is true, we might need to update open.male/female.

      for (const [key, value] of Object.entries(specificSlotsUpdate)) {
        if (!ALLOWED_SLOT_KEYS.includes(key)) continue;

        const numValue = Number(value); // This is absolute value usually? Or change?
        // Looking at previous code, it set the value directly: event.specificSlots[key] = numValue.

        // Let's treat it as setting the TOTAL for that gender in OPEN category for now
        // and adjusting available accordingly.

        const category = 'open'; // Defaulting to open
        const fieldTotal = key; // 'male' or 'female'
        const fieldAvailable = key === 'male' ? 'availableMale' : 'availableFemale';

        const oldTotal = event.slots[category][fieldTotal];
        const oldAvailable = event.slots[category][fieldAvailable];

        const diff = numValue - oldTotal;

        event.slots[category][fieldTotal] = numValue;
        event.slots[category][fieldAvailable] = oldAvailable + diff;
      }
    }

    // Ensure we mark modified
    event.markModified('slots');
    event.markModified('registration');
    event.markModified('club');
    event.markModified('eventType');

    await event.save();

    res.json({ success: true, message: "Event updated successfully", event });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/events/settings/global
export const getPublicGlobalSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.getSettings();
    res.json({
      registrationsOpen: settings.registrationsOpen,
      passControl: settings.passControl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/analytics/detailed
export const getDetailedAnalytics = async (req, res) => {
  try {
    const role = req.user.role?.toUpperCase();
    const isMaster = role === 'MASTER' || (role === 'ADMIN' && !req.user.access?.length);
    const isRegistration = (req.user.isRegistration === true) || (req.user.team === 'Registration');

    // Build filter
    const matchFilter = {};
    if (!isMaster && !isRegistration && req.user.access) {
      matchFilter.$or = [
        { _id: { $in: req.user.access.map(id => mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id) } },
        { id: { $in: req.user.access } }
      ];
    } else if (!isMaster && !isRegistration) {
      return res.status(403).json({ success: false, message: "No access assigned" });
    }

    const statsPromise = Event.aggregate([
      { $match: matchFilter },
      {
        $facet: {
          overview: [
            {
              $project: {
                soloCount: { $size: "$registrations.participants" },
                teamCount: { $size: "$registrations.teams" },
                confirmedSolo: { $size: { $filter: { input: "$registrations.participants", as: "p", cond: { $eq: ["$$p.status", "CONFIRMED"] } } } },
                confirmedTeam: { $size: { $filter: { input: "$registrations.teams", as: "t", cond: { $eq: ["$$t.status", "CONFIRMED"] } } } },
                pendingSolo: { $size: { $filter: { input: "$registrations.participants", as: "p", cond: { $eq: ["$$p.status", "PENDING"] } } } },
                pendingTeam: { $size: { $filter: { input: "$registrations.teams", as: "t", cond: { $eq: ["$$t.status", "PENDING"] } } } },
                revenue: {
                  $add: [
                    { $multiply: [{ $size: { $filter: { input: "$registrations.participants", as: "p", cond: { $eq: ["$$p.paid", true] } } } }, "$price"] },
                    { $multiply: [{ $size: { $filter: { input: "$registrations.teams", as: "t", cond: { $eq: ["$$t.paid", true] } } } }, "$price"] }
                  ]
                },
                pendingRevenue: {
                  $add: [
                    { $multiply: [{ $size: { $filter: { input: "$registrations.participants", as: "p", cond: { $and: [{ $eq: ["$$p.status", "PENDING"] }, { $eq: ["$$p.paid", false] }] } } } }, "$price"] },
                    { $multiply: [{ $size: { $filter: { input: "$registrations.teams", as: "t", cond: { $and: [{ $eq: ["$$t.status", "PENDING"] }, { $eq: ["$$t.paid", false] }] } } } }, "$price"] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalSolo: { $sum: "$soloCount" },
                totalTeam: { $sum: "$teamCount" },
                confirmedSolo: { $sum: "$confirmedSolo" },
                confirmedTeam: { $sum: "$confirmedTeam" },
                pendingSolo: { $sum: "$pendingSolo" },
                pendingTeam: { $sum: "$pendingTeam" },
                totalRevenue: { $sum: "$revenue" },
                totalPendingRevenue: { $sum: "$pendingRevenue" }
              }
            }
          ],
          clubStats: [
            {
              $project: {
                clubName: { $ifNull: ["$club", "General"] },
                registrations: { $add: [{ $size: "$registrations.participants" }, { $size: "$registrations.teams" }] },
                revenue: {
                  $add: [
                    { $multiply: [{ $size: { $filter: { input: "$registrations.participants", as: "p", cond: { $eq: ["$$p.paid", true] } } } }, "$price"] },
                    { $multiply: [{ $size: { $filter: { input: "$registrations.teams", as: "t", cond: { $eq: ["$$t.paid", true] } } } }, "$price"] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: "$clubName",
                totalRegistrations: { $sum: "$registrations" },
                totalRevenue: { $sum: "$revenue" },
                eventCount: { $sum: 1 }
              }
            },
            { $sort: { totalRegistrations: -1 } }
          ],
          eventStats: [
            {
              $project: {
                name: 1,
                club: 1,
                totalRegistrations: { $add: [{ $size: "$registrations.participants" }, { $size: "$registrations.teams" }] },
                // Calculate capacity as sum of open and official totals
                capacity: { $add: [{ $ifNull: ["$slots.open.total", 0] }, { $ifNull: ["$slots.official.total", 0] }] },
                // Calculate occupancy based on available slots in both categories
                occupancy: {
                  $cond: [
                    { $gt: [{ $add: [{ $ifNull: ["$slots.open.total", 0] }, { $ifNull: ["$slots.official.total", 0] }] }, 0] },
                    {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $subtract: [
                                { $add: [{ $ifNull: ["$slots.open.total", 0] }, { $ifNull: ["$slots.official.total", 0] }] },
                                { $add: [{ $ifNull: ["$slots.open.available", 0] }, { $ifNull: ["$slots.official.available", 0] }] }
                              ]
                            },
                            { $add: [{ $ifNull: ["$slots.open.total", 0] }, { $ifNull: ["$slots.official.total", 0] }] }
                          ]
                        },
                        100
                      ]
                    },
                    0
                  ]
                },
                revenue: {
                  $add: [
                    { $multiply: [{ $size: { $filter: { input: "$registrations.participants", as: "p", cond: { $eq: ["$$p.paid", true] } } } }, "$price"] },
                    { $multiply: [{ $size: { $filter: { input: "$registrations.teams", as: "t", cond: { $eq: ["$$t.paid", true] } } } }, "$price"] }
                  ]
                }
              }
            },
            { $sort: { totalRegistrations: -1 } }
          ],
          collegeStats: [
            {
              $project: {
                clgs: {
                  $concatArrays: [
                    "$registrations.participants.clgName",
                    {
                      $reduce: {
                        input: "$registrations.teams",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this.members.clgName"] }
                      }
                    }
                  ]
                }
              }
            },
            { $unwind: "$clgs" },
            { $group: { _id: "$clgs", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
          ]
        }
      }
    ]);

    const userStatsPromise = User.aggregate([
      {
        $facet: {
          genderDist: [
            // Only global admins see full demographics
            ...(isMaster || isRegistration ? [] : [{ $match: { _id: { $exists: false } } }]),
            { $group: { _id: "$gender", count: { $sum: 1 } } }
          ],
          onboarding: [
            ...(isMaster || isRegistration ? [] : [{ $match: { _id: { $exists: false } } }]),
            { $group: { _id: "$onboardingCompleted", count: { $sum: 1 } } }
          ],
          userGrowth: [
            ...(isMaster || isRegistration ? [] : [{ $match: { _id: { $exists: false } } }]),
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
          ]
        }
      }
    ]);

    const paymentTrendPromise = Payment.aggregate([
      // Filter by accessible events for coordinators
      ...(isMaster || isRegistration ? [] : [{
        $match: {
          eventId: { $in: req.user.access.map(id => mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id) }
        }
      }]),
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventInfo"
        }
      },
      { $unwind: { path: "$eventInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: { $ifNull: ["$eventInfo.price", 0] } }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    const [stats, userStats, paymentTrend] = await Promise.all([
      statsPromise,
      userStatsPromise,
      paymentTrendPromise
    ]);

    res.json({
      overview: stats[0].overview[0] || {},
      clubStats: stats[0].clubStats,
      eventStats: stats[0].eventStats,
      collegeStats: stats[0].collegeStats,
      userStats: userStats[0],
      paymentTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

