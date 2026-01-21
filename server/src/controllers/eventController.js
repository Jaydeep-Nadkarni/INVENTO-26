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

const GENDER_SPECIFIC_EVENT_IDS = ["22", "23"];

/* ================= RAZORPAY ================= */
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'missing_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing_secret',
  });
};

/* ================= MAIL TRANSPORT ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


/* ================= HTML MAIL ================= */
const spaceMail = (title, message, eventName, userName, id) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>INVENTO 2026 – Spyverse Email</title>
</head>
<body style="margin:0; padding:0; background:#020617; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

  <div style="background:#0b1220; color:#e5e7eb; padding:32px; border-radius:14px; max-width:600px; margin:auto; border:1px solid #1e293b">

    <h1 style="color:#38bdf8; margin-top:0; margin-bottom:16px; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">
      ${title} — INVENTO 2026
    </h1>

    <p style="line-height:1.7; color: #cbd5e1;">
      ${message}
      <br /><br />
      Please keep this information secure and present your credentials whenever requested during the event.
    </p>

    <hr style="border:none; border-top:1px dashed #334155; margin:24px 0" />

    <p style="margin: 8px 0;"><b>Event Name:</b> <span style="color:#38bdf8">${eventName}</span></p>
    <p style="margin: 8px 0;"><b>Participant Name:</b> ${userName}</p>
    <p style="margin: 8px 0;"><b>Invento ID:</b> <span style="font-family: monospace; background: #1e293b; padding: 2px 6px; rounded: 4px;">${id}</span></p>

    <div style="margin-top:28px; padding:16px; background:#020617; border-radius:10px; border:1px solid #1e293b">
      <p style="margin:0; font-size:13px; letter-spacing:1px; color:#94a3b8">
        Status: <span style="color:#22c55e; font-weight:600">VERIFIED</span>
      </p>
    </div>

    <p style="margin-top:30px; font-size:12px; color:#cbd5f5">
      See you at <b>INVENTO 2026</b>
    </p>

    <p style="font-size:12px; color:#94a3b8; margin-top:24px">
      Technical Team,<br />
      INVENTO 2026
    </p>

    <p style="font-size:11px; color:#64748b; margin-top:12px; text-align: center">
      Please do not reply to this message.
    </p>
    </div>

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

    const isMasterMiss = GENDER_SPECIFIC_EVENT_IDS.includes(String(event.id));
    if (isMasterMiss) {
      const gender = user.gender?.toLowerCase();
      let slotKey = (gender === "male") ? "male" : (gender === "female" ? "female" : null);
      if (!slotKey) throw new InvalidGenderError("Gender required for this event (Male/Female).");

      const currentGenderSlots = (typeof event.specificSlots?.get === "function" ? event.specificSlots.get(slotKey) : event.specificSlots?.[slotKey]);
      if (currentGenderSlots === undefined || currentGenderSlots <= 0) {
        throw new SlotFullError(`No more slots for ${user.gender} participants.`);
      }
    } else {
      if (event.slots.availableSlots <= 0) throw new SlotFullError();
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
    if (event.slots.availableSlots <= 0) {
      throw new SlotFullError("No slots available for team registration.");
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
    try {
      await validateEventRegistration(event, { inventoId, members, teamName, isOfficial, contingentKey }, null);
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
    const options = {
      amount: Math.round(event.price * 100),
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
        isOfficial, contingentKey
      } = req.body;

      const eventIdParam = req.params.id.trim();
      const event = await Event.findOne({ $or: [{ _id: eventIdParam }, { id: eventIdParam }] }).session(session);
      if (!event) throw new EventNotFoundError();

      // Shared Validation
      const { user, staticEvent, eventType, members: validatedMembers } = await validateEventRegistration(
        event, { inventoId, members, teamName, isOfficial, contingentKey }, session
      );

      const whatsappLink = staticEvent?.whatsapplink || "";

      // Payment Verification
      if (!isOfficial && event.price > 0) {
        if (!verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
          throw new Error("Payment verification failed");
        }
        const usedPayment = await Payment.findOne({ paymentId: razorpay_payment_id, eventId: event._id }).session(session);
        if (usedPayment) throw new Error("Payment already used.");
      }

      const status = (event.price > 0 && !isOfficial) ? "CONFIRMED" : "PENDING";
      const isMasterMiss = GENDER_SPECIFIC_EVENT_IDS.includes(String(event.id));

      if (eventType === "SOLO") {
        let slotKey = null;
        if (isMasterMiss) {
          const gender = user.gender?.toLowerCase();
          slotKey = (gender === "male") ? "male" : (gender === "female") ? "female" : null;
          if (!slotKey) throw new InvalidGenderError("Gender required for this event (Male/Female).");
        }

        if (slotKey) {
          const currentGenderSlots = event.specificSlots.get(slotKey);
          event.specificSlots.set(slotKey, currentGenderSlots - 1);
          event.markModified('specificSlots');
        } else {
          event.slots.availableSlots -= 1;
        }

        event.registrations.participants.push({
          inventoId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          clgName: user.clgName,
          paid: (event.price > 0 && !isOfficial),
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
          paid: (event.price > 0 && !isOfficial),
          members: memberData.map(u => ({
            inventoId: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            clgName: u.clgName
          }))
        });
        event.slots.availableSlots -= 1;
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

      return { type: eventType, user, eventName: event.name, whatsappLink, teamName };
    });

    // Send Mail
    await transporter.sendMail({
      from: `"Invento 2026" <${process.env.EMAIL_USER}>`,
      to: result.user.email,
      subject: `Registration Success: ${result.eventName}`,
      html: spaceMail(
        result.type === "SOLO" ? "REGISTRATION CONFIRMED" : "TEAM REGISTRATION CONFIRMED",
        result.type === "SOLO" ? "You are successfully registered!" : `Team ${result.teamName} is successfully registered!`,
        result.eventName, result.user.name, result.user._id
      )
    }).catch(err => console.error("Mail Error:", err));

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

      const isMasterMiss = GENDER_SPECIFIC_EVENT_IDS.includes(String(event.id));
      let slotKey = null;
      if (isMasterMiss) {
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
      if (nowActive && !wasActive) {
        if (slotKey) {
          const currentGenderSlots = (typeof event.specificSlots?.get === "function"
            ? event.specificSlots.get(slotKey)
            : event.specificSlots?.[slotKey]) || 0;

          if (currentGenderSlots <= 0) {
            throw new Error(`No ${slotKey} slots available in ${event.name}`);
          }

          if (typeof event.specificSlots?.set === "function") {
            event.specificSlots.set(slotKey, currentGenderSlots - 1);
          } else {
            event.specificSlots[slotKey] = currentGenderSlots - 1;
          }
        } else {
          if (event.slots.availableSlots <= 0) {
            throw new Error("No slots available to activate this participant");
          }
          event.slots.availableSlots -= 1;
        }
      } else if (!nowActive && wasActive) {
        if (slotKey) {
          const currentGenderSlots = (typeof event.specificSlots?.get === "function"
            ? event.specificSlots.get(slotKey)
            : event.specificSlots?.[slotKey]) || 0;

          if (typeof event.specificSlots?.set === "function") {
            event.specificSlots.set(slotKey, currentGenderSlots + 1);
          } else {
            event.specificSlots[slotKey] = currentGenderSlots + 1;
          }
        } else {
          event.slots.availableSlots += 1;
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
      if (nowActive && !wasActive) {
        if (event.slots.availableSlots <= 0) {
          throw new Error("No slots available to activate this team");
        }
        event.slots.availableSlots -= 1;
      } else if (!nowActive && wasActive) {
        event.slots.availableSlots += 1;
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

    res.json({
      name: eventDoc.name,
      totalSlots: eventDoc.slots.totalSlots,
      availableSlots: eventDoc.slots.availableSlots,
      usedSlots: eventDoc.slots.totalSlots - eventDoc.slots.availableSlots,
      totalRegistrations: participation.total,
      officialCount: participation.official,
      nonOfficialCount: participation.nonOfficial,
      collegeWise: collegeCounts
    });
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
      const isMasterMiss = GENDER_SPECIFIC_EVENT_IDS.includes(String(event.id));
      if (isMasterMiss) {
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
    const isMaster = req.user.role === 'ADMIN' && !req.user.access;
    const isRegistration = req.user.isRegistration === true;

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
                clubName: {
                  $cond: {
                    if: { $isArray: "$club" },
                    then: { $arrayElemAt: ["$club", 0] },
                    else: "$club"
                  }
                },
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
    const isMaster = req.user.role === 'ADMIN' && !req.user.access;
    const isRegistration = req.user.isRegistration === true;

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
        team: Array.isArray(event.club) ? event.club[0] : event.club
      }));

      const teams = event.registrations.teams.map(t => ({
        ...t.toObject(),
        eventName: event.name,
        eventId: event._id,
        eventType: eventType,
        team: Array.isArray(event.club) ? event.club[0] : event.club,
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
  const { price, slotsChange, isOpen, officialOnly, specificSlotsUpdate } = req.body;

  try {
    const event = await Event.findOne({ $or: [{ _id: eventId }, { id: eventId }] });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Update Price
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: "Price must be a non-negative number" });
      }
      event.price = price;
    }

    // Update Slots
    // Update Slots
    let delta = 0;
    if (slotsChange !== undefined) delta = Number(slotsChange);

    // Allow setting absolute totalSlots (overrides slotsChange if both present, or calculates delta)
    if (req.body.totalSlots !== undefined) {
      const targetTotal = Number(req.body.totalSlots);
      if (Number.isNaN(targetTotal) || !Number.isFinite(targetTotal) || targetTotal < 0) {
        return res.status(400).json({ message: "Total slots must be a non-negative number" });
      }
      delta = targetTotal - event.slots.totalSlots;
    }

    if (delta !== 0) {
      const newTotal = event.slots.totalSlots + delta;
      const newAvailable = event.slots.availableSlots + delta;

      if (newTotal < 0) return res.status(400).json({ message: "Total slots cannot be negative" });
      if (newAvailable < 0) return res.status(400).json({ message: "Cannot reduce capacity below the number of currently occupied slots." });

      event.slots.totalSlots = newTotal;
      event.slots.availableSlots = newAvailable;
    }

    // Update Registration Status
    if (isOpen !== undefined) event.registration.isOpen = isOpen;
    if (officialOnly !== undefined) event.registration.officialOnly = officialOnly;

    // Update Specific Slots (Gender Based)
    if (specificSlotsUpdate) {
      const ALLOWED_SLOT_KEYS = ["male", "female"];
      for (const [key, value] of Object.entries(specificSlotsUpdate)) {
        if (!ALLOWED_SLOT_KEYS.includes(key)) {
          console.warn(`[updateEventDetails] Skipping unknown slot key: ${key}`);
          continue;
        }

        const numValue = Number(value);
        if (isNaN(numValue) || !Number.isFinite(numValue) || numValue < 0) {
          console.warn(`[updateEventDetails] Skipping invalid slot value for ${key}: ${value}`);
          continue;
        }

        if (event.specificSlots) {
          // If Map
          if (typeof event.specificSlots.set === 'function') {
            event.specificSlots.set(key, numValue);
          } else {
            event.specificSlots[key] = numValue;
          }
        }
      }
    }

    event.markModified('registration');
    event.markModified('specificSlots');
    await event.save();

    res.json({ success: true, message: "Event updated successfully", event });

  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const isMaster = req.user.role === 'ADMIN' && !req.user.access;
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
                clubName: { $cond: { if: { $isArray: "$club" }, then: { $arrayElemAt: ["$club", 0] }, else: "$club" } },
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
                capacity: "$slots.totalSlots",
                occupancy: {
                  $cond: [
                    { $gt: ["$slots.totalSlots", 0] },
                    { $multiply: [{ $divide: [{ $subtract: ["$slots.totalSlots", "$slots.availableSlots"] }, "$slots.totalSlots"] }, 100] },
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

