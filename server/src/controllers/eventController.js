import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import ContingentKey from "../models/contingentKeyModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Razorpay from "razorpay";

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

    <p style="margin: 8px 0;"><b>Operation:</b> <span style="color:#38bdf8">${eventName}</span></p>
    <p style="margin: 8px 0;"><b>Agent Name:</b> ${userName}</p>
    <p style="margin: 8px 0;"><b>Invento ID:</b> <span style="font-family: monospace; background: #1e293b; padding: 2px 6px; rounded: 4px;">${id}</span></p>

    <div style="margin-top:28px; padding:16px; background:#020617; border-radius:10px; border:1px solid #1e293b">
      <p style="margin:0; font-size:13px; letter-spacing:1px; color:#94a3b8">
        Status: <span style="color:#22c55e; font-weight:600">ACCESS GRANTED</span>
      </p>
    </div>

    <p style="margin-top:30px; font-size:14px; color:#cbd5f5">
      See you at <b>INVENTO 2026</b>
    </p>

    <p style="font-size:11px; color:#64748b; margin-top:32px">
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

  try {
    let { inventoId, // leader for team | participant for solo
      teamName, members, razorpay_order_id, razorpay_payment_id, razorpay_signature,
      isOfficial, contingentKey } = req.body;

    const eventIdParam = req.params.id.trim();

    // Robust find
    let event = await Event.findOne({ $or: [{ _id: eventIdParam }, { id: eventIdParam }] });

    if (!event) {
      console.warn(`[registerForEvent:${reqId}] Event not found in DB: ${eventIdParam}`);
      return res.status(404).json({ message: "Event not found" });
    }

    /* ================= PAYMENT VERIFICATION ================= */
    if (isOfficial) {
      if (!contingentKey) {
        console.warn(`[registerForEvent:${reqId}] Missing Contingent Key`);
        return res.status(400).json({ message: "Contingent Key required for official registration." });
      }

      const keyDoc = await ContingentKey.findOne({ key: contingentKey });
      if (!keyDoc) {
        console.warn(`[registerForEvent:${reqId}] Invalid Contingent Key: ${contingentKey}`);
        return res.status(400).json({ message: "Invalid Contingent Key. Official authorization denied." });
      }
    } else if (event.price > 0) {
      if (!verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        console.warn(`[registerForEvent:${reqId}] Payment Verification Failed`);
        return res.status(400).json({
          message: "Payment verification failed",
        });
      }

      /* ---------- PREVENT PAYMENT REUSE ---------- */
      const usedPayment = await Payment.findOne({ paymentId: razorpay_payment_id, eventId: event._id });
      if (usedPayment) {
        console.warn(`[registerForEvent:${reqId}] Payment Reused: ${razorpay_payment_id}`);
        return res.status(400).json({ message: "Payment already used" });
      }


      /* ---------- AMOUNT VERIFICATION ---------- */
      const razorpay = getRazorpayInstance();
      const order = await razorpay.orders.fetch(razorpay_order_id);
      if (order.status !== "paid" || order.currency !== "INR") {
        console.warn(`[registerForEvent:${reqId}] Payment status invalid: ${order.status}`);
        return res.status(400).json({
          message: "Payment not completed",
        });
      }
      const expectedAmount = event.price * 100; // Razorpay uses paise

      if (order.amount !== expectedAmount) {
        console.warn(`[registerForEvent:${reqId}] Amount Mismatch. Expected: ${expectedAmount}, Got: ${order.amount}`);
        return res.status(400).json({
          message: "Payment amount mismatch for this event",
        });
      }
    }

    // SOLO
    if (event.type === "solo" || (event.maxTeamSize === 1)) {
      if (!inventoId) {
        console.warn(`[registerForEvent:${reqId}] Missing InventoId`);
        return res.status(400).json({ message: "Invento ID required" });
      }

      const user = await User.findById(inventoId);
      if (!user) {
        console.warn(`[registerForEvent:${reqId}] Invalid User: ${inventoId}`);
        return res.status(400).json({ message: "Invalid Invento ID" });
      }

      const already = event.participants.some(p => p.inventoId === user._id.toString());
      if (already) {
        console.warn(`[registerForEvent:${reqId}] User already registered: ${user.name}`);
        return res.status(400).json({ message: "Already registered" });
      }

      event.participants.push({
        inventoId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        clgName: user.clgName,
        paid: true,
        isOfficial: !!isOfficial,
        contingentKey: contingentKey
      });
      await event.save();

      // Update User Profile
      user.registeredEvents.push(event.name);
      user.payment = true;

      // Update passType logic
      if (isOfficial) {
        user.passType = "AAA";
      } else if (user.passType !== "AAA") {
        user.passType = "A";
      }

      await user.save();

      if (event.price > 0) {
        await Payment.create({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          eventId: event._id
        });
      }

      await transporter.sendMail({
        from: `"Invento 2026" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Registered for ${event.name}`,
        html: spaceMail("REGISTRATION CONFIRMED", "You are successfully registered!", event.name, user.name, user._id)
      });

      return res.status(200).json({
        message: "Solo registration successful",
        eventId: event._id,
        whatsappLink: event.whatsappLink
      });
    }

    // TEAM
    else {
      // Parse members safely (important)
      try {
        members = Array.isArray(members) ? members : JSON.parse(members);
      } catch {
        console.warn(`[registerForEvent:${reqId}] Invalid members JSON`);
        return res.status(400).json({ message: "Invalid members format" });
      }

      if (!teamName || !members || members.length < event.minTeamSize || members.length > event.maxTeamSize) {
        console.warn(`[registerForEvent:${reqId}] Invalid team size/format. Size: ${members ? members.length : 0}`);
        return res.status(400).json({ message: `Team must have ${event.minTeamSize}-${event.maxTeamSize} members` });
      }

      // Leader must be part of team
      if (!members.includes(inventoId)) {
        console.warn(`[registerForEvent:${reqId}] Leader not in members list`);
        return res.status(400).json({
          message: "Leader must be included in members list",
        });
      }

      const memberData = await Promise.all(members.map(id => User.findById(id)));
      const missingMembers = memberData.filter(u => !u);
      if (missingMembers.length > 0) {
        console.warn(`[registerForEvent:${reqId}] Missing members in DB. Count: ${missingMembers.length}`);
        return res.status(400).json({
          message: `Registration Denied: One or more IDs were not found in the directory.`
        });
      }

      // Check for already registered members in any team of this event
      const alreadyRegistered = event.teams.some(team =>
        team.members.some(m => members.includes(m.inventoId))
      );
      if (alreadyRegistered) {
        console.warn(`[registerForEvent:${reqId}] Members already registered`);
        return res.status(400).json({ message: "One or more members are already registered for this event." });
      }

      const teamMembers = memberData.map(u => ({
        inventoId: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        clgName: u.clgName
      }));

      event.teams.push({
        teamName,
        leaderId: inventoId,
        paid: true,
        isOfficial: !!isOfficial,
        contingentKey: contingentKey,
        members: teamMembers
      });
      await event.save();

      // Update all members users
      for (const u of memberData) {
        u.registeredEvents.push(event.name);
        // If official, upgrade ALL members to AAA
        if (isOfficial) {
          u.passType = "AAA";
        } else if (u.passType !== "AAA") {
          u.passType = "A";
        }
        await u.save();
      }

      if (event.price > 0) {
        await Payment.create({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          eventId: event._id
        });
      }

      // Email Leader
      const leader = memberData.find(u => u._id.toString() === inventoId);
      await transporter.sendMail({
        from: `"Invento 2026" <${process.env.EMAIL_USER}>`,
        to: leader.email,
        subject: `Team Registered for ${event.name}`,
        html: spaceMail("TEAM REGISTRATION CONFIRMED", `Team ${teamName} is successfully registered!`, event.name, leader.name, leader._id)
      });


      return res.status(200).json({
        message: "Team registration successful",
        eventId: event._id,
        whatsappLink: event.whatsappLink
      });
    }

  } catch (error) {
    console.error("Error in registerForEvent:", error);
    return res.status(500).json({ message: error.message });
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