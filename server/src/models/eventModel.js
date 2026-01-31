import mongoose from "mongoose";

const slotCategorySchema = new mongoose.Schema({
  // General
  total: { type: Number, default: 0 },
  available: { type: Number, default: 0 },

  // Gender Specific Nested
  gender: {
    male: { type: Number, default: 0 },
    female: { type: Number, default: 0 }
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  _id: {
    type: String, // slugs like 'raga-solo-singing-eastern'
  },
  id: { type: String, unique: true, sparse: true }, // numeric IDs like '1'
  name: { type: String, required: true }, // maps to title/themeName
  club: { type: String }, // Now a simple String for consistency
  eventType: { type: String }, // SOLO, TEAM, etc.
  whatsapplink: { type: String },
  isGenderSpecific: { type: Boolean, default: false },
  isPricePerPerson: { type: Boolean, default: false },

  // Dynamic fields
  price: { type: Number, required: true }, // maps to registrationfee
  slots: {
    open: { type: slotCategorySchema, default: () => ({}) },
    official: { type: slotCategorySchema, default: () => ({}) }
  },
  // specificSlots: { type: Map, of: Number, default: {} }, // Deprecated/Removed in favor of nested slots

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
        paymentId: { type: String },
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
        paymentId: { type: String },
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
