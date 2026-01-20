import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  _id: {
    type: String, // slugs like 'raga-solo-singing-eastern'
  },
  id: { type: String, unique: true, sparse: true }, // numeric IDs like '1'
  name: { type: String, required: true }, // maps to title/themeName

  // Dynamic fields
  price: { type: Number, required: true }, // maps to registrationfee
  slots: {
    totalSlots: { type: Number, default: 0 },
    availableSlots: { type: Number, default: 0 }
  },
  specificSlots: { type: Map, of: Number, default: {} },
  registration: {
    isOpen: { type: Boolean, default: true },
    deadline: { type: Date },
    officialTeamsPerCollege: { type: Number, default: 1 },
    officialOnly: { type: Boolean, default: false }
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
  }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;
