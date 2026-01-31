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
        amountPaid: { type: Number, default: 0 }, // Immutable audit trail
        status: {
          type: String,
          enum: ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"],
          default: "PENDING"
        },
        isOfficial: { type: Boolean, default: false },
        contingentKey: { type: String },
        isPresent: { type: Boolean, default: false },
        registeredAt: { type: Date, default: Date.now } // Explicit timestamp
      }
    ],
    teams: [
      {
        teamName: String,
        leaderId: { type: String, required: true },
        paid: { type: Boolean, default: false },
        amountPaid: { type: Number, default: 0 }, // Immutable audit trail
        status: {
          type: String,
          enum: ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"],
          default: "PENDING"
        },
        isOfficial: { type: Boolean, default: false },
        contingentKey: { type: String },
        paymentId: { type: String },
        registeredAt: { type: Date, default: Date.now }, // Explicit timestamp
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

// ========== VALIDATION HOOKS ==========
// Prevent available > total slot corruption
eventSchema.pre('save', function (next) {
  // Validate open category
  if (this.slots?.open) {
    if (this.slots.open.available > this.slots.open.total) {
      return next(new Error(`Open available slots (${this.slots.open.available}) cannot exceed total (${this.slots.open.total})`));
    }
    if (this.slots.open.available < 0) {
      return next(new Error(`Open available slots cannot be negative`));
    }

    // Validate gender slots if gender-specific
    if (this.isGenderSpecific && this.slots.open.gender) {
      const male = this.slots.open.gender.male || 0;
      const female = this.slots.open.gender.female || 0;
      if (male < 0 || female < 0) {
        return next(new Error(`Gender-specific slots cannot be negative`));
      }
      const totalGender = male + female;
      if (totalGender > this.slots.open.total) {
        return next(new Error(`Gender-specific slots (${totalGender}) cannot exceed open total (${this.slots.open.total})`));
      }
    }
  }

  // Validate official category
  if (this.slots?.official) {
    if (this.slots.official.available > this.slots.official.total) {
      return next(new Error(`Official available slots (${this.slots.official.available}) cannot exceed total (${this.slots.official.total})`));
    }
    if (this.slots.official.available < 0) {
      return next(new Error(`Official available slots cannot be negative`));
    }

    if (this.isGenderSpecific && this.slots.official.gender) {
      const male = this.slots.official.gender.male || 0;
      const female = this.slots.official.gender.female || 0;
      if (male < 0 || female < 0) {
        return next(new Error(`Gender-specific slots cannot be negative`));
      }
      const totalGender = male + female;
      if (totalGender > this.slots.official.total) {
        return next(new Error(`Gender-specific slots (${totalGender}) cannot exceed official total (${this.slots.official.total})`));
      }
    }
  }

  next();
});

// ========== INDEXES FOR PERFORMANCE ==========
// Index on club for filtering events by club
eventSchema.index({ club: 1 });

// Index on registration.isOpen for filtering open/closed events
eventSchema.index({ 'registration.isOpen': 1 });

// Compound index for participant lookups
eventSchema.index({ 'registrations.participants.inventoId': 1 });
eventSchema.index({ 'registrations.participants.paymentId': 1 });
eventSchema.index({ 'registrations.participants.status': 1 });

// Compound index for team member lookups
eventSchema.index({ 'registrations.teams.members.inventoId': 1 });
eventSchema.index({ 'registrations.teams.paymentId': 1 });
eventSchema.index({ 'registrations.teams.status': 1 });

// Index on createdAt for sorting/filtering by date
eventSchema.index({ createdAt: 1 });
eventSchema.index({ updatedAt: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
