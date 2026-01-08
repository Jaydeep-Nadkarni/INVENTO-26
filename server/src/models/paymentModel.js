// models/paymentModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  orderId: String,
  eventId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);