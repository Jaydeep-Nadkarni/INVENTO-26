// models/paymentModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderId: {
    type: String,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  eventId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['captured', 'failed', 'refunded', 'pending'],
    default: 'captured'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;