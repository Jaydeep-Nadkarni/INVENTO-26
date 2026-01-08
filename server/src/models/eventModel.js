import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  _id: {
    type: String, // ✅ allow custom string IDs like evt0001
  },
  name: { type: String, required: true },
  type: { type: String, enum: ["solo", "team"], required: true },
  club: [{ type: String }], // e.g., ["Media"]
  price: {type: Number, required: true},  // Price for THIS event (important for stats & Razorpay)
  minTeamSize: { type: Number, default: 1 }, // 1 for solo
  maxTeamSize: { type: Number, default: 1 }, // 1 for solo
  participants: [
    {
      inventoId: {type: String, required: true},
      name: String,
      email: String,
      phone: String,
      clgName: String,
      paid: { type: Boolean, default: false } //Event-specific payment
    }
  ],
  teams: [
    {
      teamName: String,
      leaderId: {type: String, required: true}, // Leader who paid
      paid: { type: Boolean, default: false }, //Team-level payment
      members: [
        {
          inventoId: {type: String, required: true},
          name: String,
          email: String,
          phone: String,
          clgName: String
        }
      ]
    }
  ]
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;
