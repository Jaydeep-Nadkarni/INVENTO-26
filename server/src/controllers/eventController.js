import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
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
<div style="font-family:Poppins,Arial; background:#0f172a; color:#e5e7eb; padding:30px; border-radius:12px; max-width:600px; margin:auto">
  <h1 style="color:#38bdf8">${title}</h1>
  <p>${message}</p>
  <h3>Event: ${eventName}</h3>
  <p>Name: <b>${userName}</b></p>
  <p>Invento ID: <b>${id}</b></p>
  <p>See you at <b>Invento 2026 </b></p>
</div>
`;

const verifyRazorpayPayment = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};


// Create order for event payment
export const createOrder = async (req, res) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.price === 0) {
    return res.json({ free: true });
  }

  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: event.price * 100,
    currency: "INR",
    receipt: `evt_${eventId}_${Date.now()}`,
  });

  res.json({
    orderId: order.id,
    amount: order.amount,
  });
};


// Register for event (solo/team)
export const registerForEvent = async (req, res) => {
  try {
    let { inventoId, // leader for team | participant for solo
      teamName, members, razorpay_order_id, razorpay_payment_id, razorpay_signature,
      isOfficial, contingentKey } = req.body;

    const eventId = req.params.id.trim();
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    /* ================= PAYMENT VERIFICATION ================= */
    if (event.price > 0) {
      if (!verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        return res.status(400).json({
          message: "Payment verification failed",
        });
      }

      /* ---------- PREVENT PAYMENT REUSE ---------- */
      const usedPayment = await Payment.findOne({ paymentId: razorpay_payment_id, eventId: event._id });
      if (usedPayment) {
        return res.status(400).json({ message: "Payment already used" });
      }


      /* ---------- AMOUNT VERIFICATION ---------- */
      const razorpay = getRazorpayInstance();
      const order = await razorpay.orders.fetch(razorpay_order_id);
      if (order.status !== "paid" || order.currency !== "INR") {
        return res.status(400).json({
          message: "Payment not completed",
        });
      }
      const expectedAmount = event.price * 100; // Razorpay uses paise

      if (order.amount !== expectedAmount) {
        return res.status(400).json({
          message: "Payment amount mismatch for this event",
        });
      }
    }

    // SOLO
    if (event.type === "solo" || (event.maxTeamSize === 1)) {
      if (!inventoId) return res.status(400).json({ message: "Invento ID required" });

      const user = await User.findById(inventoId);
      if (!user || !user.isVerified) return res.status(400).json({ message: "Invalid or unverified Invento ID" });

      const already = event.participants.some(p => p.inventoId === user._id.toString());
      if (already) return res.status(400).json({ message: "Already registered" });

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
        return res.status(400).json({ message: "Invalid members format" });
      }

      if (!teamName || !members || members.length < event.minTeamSize || members.length > event.maxTeamSize)
        return res.status(400).json({ message: `Team must have ${event.minTeamSize}-${event.maxTeamSize} members` });

      // Leader must be part of team
      if (!members.includes(inventoId)) {
        return res.status(400).json({
          message: "Leader must be included in members list",
        });
      }

      const memberData = await Promise.all(members.map(id => User.findById(id)));
      const missingMembers = memberData.filter(u => !u);
      if (missingMembers.length > 0) {
        return res.status(400).json({
          message: `Registration Denied: One or more IDs were not found in the directory.`
        });
      }

      // Check for already registered members in any team of this event
      const alreadyRegistered = event.teams.some(team =>
        team.members.some(m => members.includes(m.inventoId))
      );
      if (alreadyRegistered) {
        return res.status(400).json({ message: "One or more squad members are already registered for this operation." });
      }

      // Ensure no duplicate IDs in the request itself
      const uniqueMembers = [...new Set(members)];
      if (uniqueMembers.length !== members.length) {
        return res.status(400).json({ message: "Duplicate agents detected in the squad roster." });
      }

      const newTeam = {
        teamName,
        leaderId: inventoId,
        paid: true,
        isOfficial: !!isOfficial,
        contingentKey: contingentKey,
        members: memberData.map(u => ({ inventoId: u._id, name: u.name, email: u.email, phone: u.phone, clgName: u.clgName }))
      };

      event.teams.push(newTeam);
      await event.save();

      // Update ALL team members
      await Promise.all(
        memberData.map(async (u) => {
          u.registeredEvents.push(event.name);
          u.payment = true;
          await u.save();
        })
      );

      if (event.price > 0) {
        await Payment.create({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          eventId: event._id
        });
      }

      // Notify all members
      await Promise.all(memberData.map(u => transporter.sendMail({
        from: `"Invento 2026" <${process.env.EMAIL_USER}>`,
        to: u.email,
        subject: `Team Registered for ${event.name}`,
        html: spaceMail("TEAM REGISTRATION CONFIRMED", `Your team ${teamName} is registered for ${event.name}.`, event.name, u.name, u._id)
      })));

      return res.status(200).json({
        message: "Team registered successfully",
        eventId: event._id,
        whatsappLink: event.whatsappLink
      });
    }
  } catch (error) {
    console.error("Error registering:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};