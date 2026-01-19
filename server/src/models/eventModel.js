import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  _id: {
    type: String, // ✅ allow custom string IDs like evt0001
  },
  id: { type: String, unique: true, sparse: true },
  name: { type: String, required: true }, // maps to title
  subtitle: { type: String },
  description: { type: String },
  eventType: { type: String, enum: ["SOLO", "TEAM"], required: true },
  minTeamSize: { type: Number, default: 1 },
  maxTeamSize: { type: Number, default: 1 },
  club: [{ type: String }],
  price: { type: Number, required: true }, // maps to registrationfee
  rounds: { type: Number, default: 1 },
  rounddetails: [
    {
      round: Number,
      description: String
    }
  ],
  rules: [String],
  contact: [
    {
      name: String,
      phone: String
    }
  ],
  slots: {
    totalSlots: { type: Number, default: 0 },
    availableSlots: { type: Number, default: 0 }
  },
  specificSlots: { type: Map, of: Number, default: {} },
  registration: {
    isOpen: { type: Boolean, default: true },
    deadline: { type: Date },
    officialTeamsPerCollege: { type: Number, default: 1 }
  },

  registrations: {
    participants: [
      {
        inventoId: { type: String, required: true },
        name: String,
        email: String,
        phone: String,
        clgName: String,
        paid: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"],
          default: "PENDING"
        },
        isOfficial: { type: Boolean, default: false },
        contingentKey: { type: String },
        isPresent: { type: Boolean, default: false }
      }
    ],
    teams: [
      {
        teamName: String,
        leaderId: { type: String, required: true },
        paid: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"],
          default: "PENDING"
        },
        isOfficial: { type: Boolean, default: false },
        contingentKey: { type: String },
        members: [
          {
            inventoId: { type: String, required: true },
            name: String,
            email: String,
            phone: String,
            clgName: String,
            isPresent: { type: Boolean, default: false }
          }
        ]
      }
    ]
  },
  logistics: {
    venue: String,
    date: String,
    time: String,
    whatsappLink: String
  },

  whatsappLink: { type: String } // Keeping for backward compatibility
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;
