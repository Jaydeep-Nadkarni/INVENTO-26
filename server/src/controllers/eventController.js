import mongoose from "mongoose";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import ContingentKey from "../models/contingentKeyModel.js";
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
    pass: process.env.EMAIL_PASS,
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
<body style="margin:0; padding:40px; background:#020617; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

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

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const isValid = expectedSignature === signature;
  if (!isValid) {
    console.warn(`[verifyRazorpayPayment] Mismatch!`);
    console.warn(`Order: ${orderId}, Payment: ${paymentId}`);
    console.warn(`Expected: ${expectedSignature}`);
    console.warn(`Received: ${signature}`);
  }
  return isValid;
};


// Create order for event payment
export const createOrder = async (req, res) => {
  try {
    const { eventId } = req.body;
    console.log(`[createOrder] Request for eventId: ${eventId}`);

    // Robust find: _id (as string) OR id field
    let event = await Event.findOne({ $or: [{ _id: eventId }, { id: eventId }] });

    if (!event) {
      console.error(`[createOrder] Event not found for ID: ${eventId}`);
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.price === 0) {
      return res.json({ free: true });
    }

    const razorpay = getRazorpayInstance();
    const options = {
      amount: event.price * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ message: "Razorpay order creation failed" });

    // Assuming user ID is available in req.user from auth middleware, or passed in body?
    // The route '/create-order' in eventRoutes doesn't seem to use 'protect' middleware.
    // So we just return the order.

    // Return keyId so frontend uses the same key
    res.json({
      ...order,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: error.message });
  }
};


// Register for event (solo/team)
export const registerForEvent = async (req, res) => {
  const reqId = Date.now();
  console.log(`[registerForEvent:${reqId}] HIT. Params ID: ${req.params.id}`);

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      let {
        inventoId, teamName, members, razorpay_order_id, razorpay_payment_id, razorpay_signature,
        isOfficial, contingentKey
      } = req.body;

      const eventIdParam = req.params.id.trim();
      const event = await Event.findOne({ $or: [{ _id: eventIdParam }, { id: eventIdParam }] }).session(session);

      if (!event) throw new EventNotFoundError();
      if (event.registration?.isOpen === false) throw new RegistrationClosedError();

      // SOLO/TEAM constraint enforcement
      if (event.eventType === "SOLO") {
        if (event.registrations.teams && event.registrations.teams.length > 0) {
          throw new Error("Integrity Error: SOLO event already contains team registrations.");
        }
      } else if (event.eventType === "TEAM") {
        if (event.registrations.participants && event.registrations.participants.length > 0) {
          throw new Error("Integrity Error: TEAM event already contains solo registrations.");
        }
      }

      // Payment/Official Verification
      if (isOfficial) {
        if (!contingentKey) throw new Error("Contingent Key required for official registration.");
        const keyDoc = await ContingentKey.findOne({ key: contingentKey }).session(session);
        if (!keyDoc) throw new Error("Invalid Contingent Key.");

        // Official teams limit enforcement (per college using contingentKey)
        const currentOfficialCount = [
          ...event.registrations.participants,
          ...event.registrations.teams
        ].filter(r => r.isOfficial && r.contingentKey === contingentKey).length;

        const limit = event.registration?.officialTeamsPerCollege || 1;
        if (currentOfficialCount >= limit) {
          throw new ContingentLimitError(`Limit reached: Maximum ${limit} official registration(s) allowed per college for this event.`);
        }
      } else if (event.price > 0) {
        if (!verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
          throw new Error("Payment verification failed");
        }
        const usedPayment = await Payment.findOne({ paymentId: razorpay_payment_id, eventId: event._id }).session(session);
        if (usedPayment) throw new Error("Payment already used for this event.");

        const razorpay = getRazorpayInstance();
        const order = await razorpay.orders.fetch(razorpay_order_id);
        if (order.status !== "paid") throw new Error("Payment not completed or verified by Razorpay.");
        if (order.amount !== event.price * 100) throw new Error("Payment amount mismatch for this event.");
      }

      const isMasterMiss = /master|miss/i.test(event.name);
      // "Update status to 'CONFIRMED' after successful payment, 'PENDING' for free events"
      let status = (event.price > 0 && !isOfficial) ? "CONFIRMED" : "PENDING";

      // SOLO Logic
      if (event.eventType === "SOLO") {
        if (!inventoId) throw new Error("Invento ID required for solo registration.");
        const user = await User.findById(inventoId).session(session);
        if (!user) throw new Error("Invalid Invento ID.");

        if (event.registrations.participants.some(p => p.inventoId === user._id)) {
          throw new DuplicateRegistrationError();
        }

        // Gender check for Master/Miss events
        let slotKey = null;
        if (isMasterMiss) {
          if (user.gender === "Male") slotKey = "availableBoysSlots";
          else if (user.gender === "Female") slotKey = "availableGirlsSlots";
          else throw new InvalidGenderError("Gender must be specified as Male or Female for Master/Miss events.");
        }

        // Atomic update for slots and registration
        const updateQuery = { _id: event._id, "slots.availableSlots": { $gt: 0 } };
        if (slotKey) updateQuery[`specificSlots.${slotKey}`] = { $gt: 0 };

        const participantData = {
          inventoId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          clgName: user.clgName,
          paid: (event.price > 0 && !isOfficial),
          status,
          isOfficial: !!isOfficial,
          contingentKey
        };

        const pushUpdate = {
          $push: { "registrations.participants": participantData },
          $inc: { "slots.availableSlots": -1 }
        };
        if (slotKey) pushUpdate.$inc[`specificSlots.${slotKey}`] = -1;

        const updatedEvent = await Event.findOneAndUpdate(updateQuery, pushUpdate, { session, new: true });
        if (!updatedEvent) throw new SlotFullError("No slots available or reservation failed (possible gender limit reached).");

        // Update User Profile
        if (!user.registeredEvents.includes(event.name)) {
          user.registeredEvents.push(event.name);
        }
        user.payment = true; // User has participated in a transaction/registration
        user.passType = isOfficial ? "AAA" : (user.passType === "G" ? "A" : user.passType);
        await user.save({ session });

        if (event.price > 0 && !isOfficial) {
          await Payment.create([{ paymentId: razorpay_payment_id, orderId: razorpay_order_id, eventId: event._id }], { session });
        }

        return { type: "Solo", user, eventName: event.name, whatsappLink: event.whatsappLink };
      }

      // TEAM Logic
      else {
        try {
          members = Array.isArray(members) ? members : JSON.parse(members);
        } catch {
          throw new Error("Invalid members format. Must be an array of IDs.");
        }

        if (!teamName || !members || members.length < (event.minTeamSize || 1) || members.length > (event.maxTeamSize || 10)) {
          throw new TeamSizeError(`Team must have between ${event.minTeamSize || 1} and ${event.maxTeamSize || 10} members.`);
        }
        if (!members.includes(inventoId)) throw new Error("Leader must be included in the members list.");

        const memberData = await User.find({ _id: { $in: members } }).session(session);
        if (memberData.length !== members.length) throw new Error("One or more team members were not found in the directory.");

        const alreadyRegisteredMember = event.registrations.teams.some(team =>
          team.members.some(m => members.includes(m.inventoId))
        );
        if (alreadyRegisteredMember) throw new DuplicateRegistrationError("One or more of your team members are already registered for this event.");

        // Atomic update for slots and registration
        const updatedEvent = await Event.findOneAndUpdate(
          { _id: event._id, "slots.availableSlots": { $gt: 0 } },
          {
            $push: {
              "registrations.teams": {
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
              }
            },
            $inc: { "slots.availableSlots": -1 }
          },
          { session, new: true }
        );

        if (!updatedEvent) throw new SlotFullError();

        for (const u of memberData) {
          if (!u.registeredEvents.includes(event.name)) {
            u.registeredEvents.push(event.name);
          }
          u.passType = isOfficial ? "AAA" : (u.passType === "G" ? "A" : u.passType);
          await u.save({ session });
        }

        if (event.price > 0 && !isOfficial) {
          await Payment.create([{ paymentId: razorpay_payment_id, orderId: razorpay_order_id, eventId: event._id }], { session });
        }

        const leader = memberData.find(u => u._id === inventoId);
        return { type: "Team", user: leader, teamName, eventName: event.name, whatsappLink: event.whatsappLink };
      }
    }, { readPreference: 'primary' }); // Ensure strong consistency for registration

    // Email logic outside of transaction (best practice)
    await transporter.sendMail({
      from: `"Invento 2026" <${process.env.EMAIL_USER}>`,
      to: result.user.email,
      subject: `Registration Success: ${result.eventName}`,
      html: spaceMail(
        result.type === "Solo" ? "REGISTRATION CONFIRMED" : "TEAM REGISTRATION CONFIRMED",
        result.type === "Solo" ? "You are successfully registered!" : `Team ${result.teamName} is successfully registered!`,
        result.eventName, result.user.name, result.user._id
      )
    }).catch(err => console.error("Mail Error (Registration preserved):", err));

    return res.status(200).json({
      message: `${result.type} registration successful`,
      eventId: req.params.id,
      whatsappLink: result.whatsappLink
    });

  } catch (error) {
    console.error(`[registerForEvent:${reqId}] Transaction Aborted:`, error.message);
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({ error: error.name, message: error.message });
  } finally {
    session.endSession();
  }
};


// Validate Contingent Key
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

      const oldStatus = participant.status;
      const isActive = (s) => ["CONFIRMED", "PENDING"].includes(s);

      const wasActive = isActive(oldStatus);
      const nowActive = isActive(status);

      // Handle slot logic
      if (nowActive && !wasActive) {
        if (event.slots.availableSlots <= 0) {
          throw new Error("No slots available to activate this participant");
        }
        event.slots.availableSlots -= 1;
      } else if (!nowActive && wasActive) {
        event.slots.availableSlots += 1;
      }

      participant.status = status;
      // Mark modified to ensure updatedAt is bumped even if only subdocs changed
      event.markModified('registrations.participants');
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
    const results = await Event.aggregate([
      { $match: { $or: [{ _id: eventId }, { id: eventId }] } },
      {
        $facet: {
          basicInfo: [{ $project: { name: 1, eventType: 1, slots: 1 } }],
          participation: [
            {
              $project: {
                regs: {
                  $cond: [
                    { $eq: ["$eventType", "SOLO"] },
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
                        { $eq: ["$eventType", "SOLO"] },
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

    if (!results[0].basicInfo.length) return res.status(404).json({ message: "Event not found" });

    const event = results[0].basicInfo[0];
    const participation = results[0].participation[0] || { total: 0, official: 0, nonOfficial: 0, collegeWise: [] };

    const collegeCounts = participation.collegeWise.reduce((acc, curr) => {
      const clg = curr.clg || "Unknown";
      acc[clg] = (acc[clg] || 0) + 1;
      return acc;
    }, {});

    res.json({
      name: event.name,
      totalSlots: event.slots.totalSlots,
      availableSlots: event.slots.availableSlots,
      usedSlots: event.slots.totalSlots - event.slots.availableSlots,
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
  try {
    const events = await Event.find({}, {
      _id: 1,
      id: 1,
      name: 1,
      eventType: 1,
      club: 1,
      slots: 1,
      specificSlots: 1,
      price: 1,
      registration: 1,
      logistics: 1
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/analytics/overview
export const getFestOverview = async (req, res) => {
  try {
    const stats = await Event.aggregate([
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
    const events = await Event.find({}, { name: 1, eventType: 1, club: 1, registrations: 1 });
    let allParticipants = [];

    events.forEach(event => {
      const participants = event.registrations.participants.map(p => ({
        ...p.toObject(),
        eventName: event.name,
        eventId: event._id,
        eventType: event.eventType,
        team: Array.isArray(event.club) ? event.club[0] : event.club
      }));

      const teams = event.registrations.teams.map(t => ({
        ...t.toObject(),
        eventName: event.name,
        eventId: event._id,
        eventType: event.eventType,
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

