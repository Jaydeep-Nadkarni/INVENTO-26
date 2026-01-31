# INVENTO 2026 - Technical Audit Report

**System:** Fest Registration Platform  
**Date:** January 31, 2026  
**Auditor:** Senior Backend Engineer / System Auditor  
**Stack:** Node.js, Express, MongoDB (Mongoose), Razorpay  

---

## Executive Summary

This audit evaluates the INVENTO 2026 registration system across 9 key areas. The system demonstrates solid foundational architecture with MongoDB transactions for concurrency safety and proper separation of open/official slot pools. However, critical issues exist around **seeding data safety**, **stale validation middleware**, and **missing database indexes** that must be addressed before production deployment.

**Overall Readiness Score: 6.5/10**

---

## 1. Database Schema Review

### 1.1 Event Schema Analysis

**File:** `server/src/models/eventModel.js`

#### ✅ Implemented Well

| Feature | Status | Notes |
|---------|--------|-------|
| Nested slot structure (`slots.open`, `slots.official`) | ✅ Good | Correctly separates open and official pools |
| Gender-specific slots (`male`, `female`, `availableMale`, `availableFemale`) | ✅ Good | Nested within each category |
| `isGenderSpecific` flag | ✅ Good | Allows conditional logic |
| `isPricePerPerson` flag | ✅ Good | Supports per-member pricing for teams |
| `paymentId` on participants and teams | ✅ Good | Audit trail for payments |
| Registration status enum | ✅ Good | Well-defined states |
| `contingentKey` storage | ✅ Good | Links official registrations to colleges |

#### ⚠️ Risks & Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| **16MB Document Limit Risk** | 🔴 HIGH | With embedded `registrations.participants[]` and `registrations.teams[]`, large events (100+ teams × 12 members) could approach limits. Each participant ~500 bytes, 1000 participants = ~500KB. Safe for 5000 participants, but risky for extremely popular events with large teams. |
| **Deprecated `specificSlots` reference** | 🟡 MEDIUM | Line 33 comments out `specificSlots`, but middleware (`eventValidationMiddleware.js` line 85-87) still references it. Mismatch! |
| **No `amountPaid` field** | 🟡 MEDIUM | Amount paid is calculated, not stored immutably. If price changes after registration, audit trail is lost. |
| **String `_id` for events** | 🟢 LOW | Using slugs as `_id` is acceptable but non-standard. Queries work correctly. |

#### Recommendations

```javascript
// Add to participant/team schema:
amountPaid: { type: Number, required: false }, // Store actual amount paid
registeredAt: { type: Date, default: Date.now } // Explicit timestamp
```

### 1.2 Other Schemas

| Schema | Status | Notes |
|--------|--------|-------|
| `userModel.js` | ✅ Good | Custom ID generation, Firebase auth, proper indexes |
| `paymentModel.js` | ⚠️ Basic | Missing `amount`, `userId`, `status` fields for full audit trail |
| `contingentKeyModel.js` | ✅ Good | Simple, effective |
| `adminModel.js` | ✅ Good | Granular access control via `access[]` array |

---

## 2. Slot Management Logic

### 2.1 Slot Pool Separation

**Status:** ✅ Correctly Implemented

The system properly maintains separate pools:
- `event.slots.open.available` for public registrations
- `event.slots.official.available` for official/contingent registrations

**Evidence:** `eventController.js` lines 598, 606-609, 642

```javascript
const category = isOfficial ? "official" : "open";
event.slots[category].available -= 1;
```

### 2.2 Concurrency & Race Conditions

**Status:** ✅ Well Protected

| Protection | Implementation | Location |
|------------|----------------|----------|
| MongoDB Transactions | `session.withTransaction()` | Lines 563, 730, 838 |
| Atomic slot check + decrement | Within transaction | Lines 606-609, 642 |
| Payment double-use prevention | `Payment.findOne()` check | Line 592 |

**Critical Observation:** Slot availability is checked AND decremented atomically within the same transaction. This prevents overselling.

### 2.3 Issues Found

| Issue | Severity | Description |
|-------|----------|-------------|
| **Status change slot math** | 🟡 MEDIUM | When changing status from CANCELLED → CONFIRMED, slot is decremented. When CONFIRMED → CANCELLED, slot is incremented. This is correct, but `WAITLIST` is treated as inactive—if you confirm a waitlisted participant, they get a slot. This may be intentional but needs explicit documentation. |
| **No total slot validation** | 🟡 MEDIUM | `available` can exceed `total` if an admin manually increments. No guard: `Math.min(available, total)` |

### 2.4 Slot Recalculation Risk

**Status:** ✅ Safe

The system does NOT recalculate slots from registration counts. It maintains running `available` counters. This is the correct approach.

---

## 3. Registration Flow

### 3.1 Participant Registration (Solo)

**Status:** ✅ Good

| Check | Implemented | Location |
|-------|-------------|----------|
| User exists | ✅ | Line 369-372 |
| Duplicate prevention | ✅ | Line 404 |
| Slot availability | ✅ | Lines 416-421 |
| Gender slot check | ✅ | Lines 411-419 |
| Payment verification | ✅ | Lines 588-594 |
| Official limit per college | ✅ | Lines 382-390 |

### 3.2 Team Registration

**Status:** ✅ Good

| Check | Implemented | Location |
|-------|-------------|----------|
| Team name required | ✅ | Lines 446-448 |
| Member validation | ✅ | Lines 466-475 |
| Team size constraints | ✅ | Lines 460-464 |
| Leader in members | ✅ | Lines 477-480 |
| Member duplicate check | ✅ | Lines 483-488 |
| Slot availability | ✅ | Lines 492-495 |

### 3.3 Issues Found

| Issue | Severity | Description |
|-------|----------|-------------|
| **Team name uniqueness** | 🟡 MEDIUM | No validation that team names are unique within an event. Two teams could have the same name. |
| **Member cross-event check** | 🟢 LOW | A member can register for the same event in multiple teams if registered in different transactions (unlikely but possible timing attack). |

### 3.4 Cancellation & Slot Corruption

**Status:** ⚠️ Needs Verification

When status changes to `CANCELLED`:
- `updateParticipantStatus` (line 764-783) correctly increments slots
- `updateTeamStatus` (line 859-866) correctly increments slots

**Risk:** No explicit "delete registration" endpoint exists. If a registration is deleted directly from the database, slots would NOT be reclaimed. **Recommend: Add a soft-delete pattern or explicit delete endpoint that adjusts slots.**

---

## 4. Pricing & Payments

### 4.1 `isPricePerPerson` Logic

**Status:** ✅ Correctly Implemented

```javascript
// createOrder - Line 544
const quantity = event.isPricePerPerson ? (validatedMembers ? validatedMembers.length : 1) : 1;
const options = {
  amount: Math.round(event.price * quantity * 100),
  ...
};
```

### 4.2 Payment Storage

| Field | Status | Notes |
|-------|--------|-------|
| `paymentId` on registration | ✅ Stored | Lines 618, 633 |
| `Payment` collection entry | ✅ Created | Line 656 |
| `amountPaid` | ❌ NOT STORED | Only `paymentId` is stored, not the actual amount |

### 4.3 Security Concerns

| Issue | Severity | Description |
|-------|----------|-------------|
| **Amount not stored** | 🔴 HIGH | If `event.price` is changed after registration, there's no audit trail of what was actually paid. Critical for financial reconciliation. |
| **Razorpay signature verified** | ✅ Good | Line 317-341, uses HMAC-SHA256 |
| **Payment double-use check** | ✅ Good | Line 592-593 |
| **Official bypass payment** | ⚠️ Design | Official registrations skip payment. Ensure contingent keys are distributed securely. |

### 4.4 Recommendation

```javascript
// In Payment model:
const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  orderId: String,
  eventId: String,
  userId: String,           // ADD: Who paid
  amount: Number,           // ADD: Amount in paise
  status: { type: String, enum: ['captured', 'failed', 'refunded'] }, // ADD
  createdAt: { type: Date, default: Date.now }
});

// In registration:
event.registrations.participants.push({
  ...
  amountPaid: event.price * quantity, // Store immutably
});
```

---

## 5. Seeding & Data Safety

### 5.1 Current Implementation

**File:** `server/seedDynamicEvents.js`

**Status:** 🔴 CRITICAL ISSUE

```javascript
// Line 104-105
console.log("Clearing existing events...");
await Event.deleteMany({});
```

**This is DESTRUCTIVE.** Running the seed script in production will:
1. Delete ALL existing registrations
2. Reset all slot counts
3. Lose all payment associations

### 5.2 Safe Seeding Pattern

**Recommendation: Use UPSERT with field protection**

```javascript
const seed = async () => {
  for (const event of transformedEvents) {
    await Event.findByIdAndUpdate(
      event._id,
      {
        $set: {
          name: event.name,
          club: event.club,
          price: event.price,
          // ... other safe-to-update fields
        },
        $setOnInsert: {
          // Only set these on NEW documents
          slots: event.slots,
          registrations: { participants: [], teams: [] }
        }
      },
      { upsert: true, new: true }
    );
  }
};
```

### 5.3 Other Seeding Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| **Slot values from `events.js`** | 🟡 MEDIUM | Many events have `null` slots which default to 40. This may not match intended capacity. |
| **No validation of source data** | 🟢 LOW | Typos in `events.js` (e.g., `registartionfee`) could cause issues |

---

## 6. Email & Communication

### 6.1 Email Content

**Status:** ✅ Good

The `spaceMail` template (lines 87-315) includes:
- ✅ Event name
- ✅ Participant name
- ✅ Invento ID
- ✅ Payment ID / UTR (with fallback for official/free)
- ✅ WhatsApp group link (conditional)

### 6.2 Email Reliability

| Aspect | Status | Notes |
|--------|--------|-------|
| Fire-and-forget pattern | ✅ Good | `sendMail` doesn't throw, preventing registration failure on email error |
| Gmail SMTP | ⚠️ Risk | Gmail may rate-limit at high volumes. Consider SendGrid/SES for production. |
| No retry mechanism | 🟡 MEDIUM | Failed emails are logged but not retried |
| Blocking response | ⚠️ Risk | `await Promise.all(mailPromises)` blocks response until all emails attempt (line 680). For teams of 12, this adds latency. |

### 6.3 Recommendation

```javascript
// Don't await emails - respond immediately
res.json({ message: "Registration successful", whatsappLink: result.whatsappLink });

// Send emails in background (fire-and-forget)
setImmediate(() => {
  Promise.all(mailPromises).catch(console.error);
});
```

---

## 7. Performance & Scale Readiness

### 7.1 Scale Assessment (3,000–5,000 participants)

| Aspect | Status | Notes |
|--------|--------|-------|
| Document size | ✅ Safe | ~500B/participant × 5000 = 2.5MB (well under 16MB) |
| Query patterns | ⚠️ Concern | Loading full event documents with all registrations for every request |
| Concurrent registrations | ✅ Good | Transactions prevent race conditions |

### 7.2 Missing Indexes

**Status:** 🔴 CRITICAL

No explicit indexes are declared in models (beyond defaults). For production, add:

```javascript
// eventModel.js
eventSchema.index({ 'registrations.participants.inventoId': 1 });
eventSchema.index({ 'registrations.teams.members.inventoId': 1 });
eventSchema.index({ club: 1 });
eventSchema.index({ 'registration.isOpen': 1 });

// paymentModel.js
paymentSchema.index({ paymentId: 1 }); // Already unique but explicit
paymentSchema.index({ eventId: 1 });
paymentSchema.index({ createdAt: -1 });
```

### 7.3 Query Optimization

| Query | Issue | Fix |
|-------|-------|-----|
| `getEvents` (line 1040) | Excludes registrations ✅ | Good |
| `getEventParticipants` | Uses aggregation ✅ | Good |
| `registerForEvent` | Loads full event | Consider projection for validation |

### 7.4 Document Growth

Each registration adds ~500 bytes to the event document. With 100 events averaging 50 registrations each, this is manageable. However, consider:
- Archiving completed events post-fest
- Moving registrations to a separate collection for historical data

---

## 8. Security & Data Integrity

### 8.1 Authentication & Authorization

| Check | Status | Location |
|-------|--------|----------|
| JWT verification | ✅ Good | `authMiddleware.js` lines 5-42 |
| Role-based access | ✅ Good | `isAdminOrCoordinator` middleware |
| Event-specific access | ✅ Good | `checkEventAccess` middleware |
| Onboarding requirement | ✅ Good | `requireOnboarding` middleware |

### 8.2 Input Validation Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| **Stale validation middleware** | 🔴 HIGH | `eventValidationMiddleware.js` references old schema: `event.slots.availableSlots` (line 53), `event.specificSlots` (line 85-87). These fields no longer exist in the new nested slot structure! |
| **inventoId format not validated** | 🟡 MEDIUM | Commented out at line 364-366. Should validate format `inv00001`. |
| **Team name sanitization** | 🟢 LOW | No XSS sanitization on `teamName` (stored as-is). Low risk since admin-only display. |

### 8.3 Official Slot Abuse Prevention

| Protection | Status | Notes |
|------------|--------|-------|
| Contingent key required | ✅ | Line 376 |
| Key existence validation | ✅ | Lines 377-380 |
| Per-college limit enforcement | ✅ | Lines 382-390 |
| **Key distribution security** | ❓ Unknown | Physical security of keys is outside system scope |

### 8.4 Environment Variables

| Variable | Usage | Status |
|----------|-------|--------|
| `RAZORPAY_KEY_ID` | Payment | ✅ Validated before use (line 539) |
| `RAZORPAY_KEY_SECRET` | Signature | ✅ Validated (line 322) |
| `EMAIL_USER` | SMTP | ✅ Validated (line 63) |
| `EMAIL_PASSWORD` | SMTP | ✅ Validated (line 63) |
| `MONGO_URI` | Database | ✅ Validated in seed script |

---

## 9. Overall Verdict

### ✅ Implemented Well

1. **Transaction-based concurrency safety** - Slot management is atomic and race-condition proof
2. **Dual slot pool architecture** - Clean separation of open/official registrations
3. **Gender-specific slot handling** - Correctly implemented for pageant events
4. **Authorization middleware** - Granular admin access control
5. **Payment verification** - Razorpay signature validation is cryptographically sound
6. **Email template** - Professional, includes all required information
7. **Contingent limit enforcement** - Per-college official registration limits work correctly

### ⚠️ Risky (Should Fix)

1. **Validation middleware is STALE** - References old schema fields that no longer exist
2. **Amount paid not stored** - No immutable record of payment amounts
3. **Email blocks response** - Adds latency for team registrations
4. **No database indexes** - Will cause performance issues at scale
5. **Team name not unique** - Could cause confusion in admin panels

### 🔴 Must Fix Before Production

| Issue | Risk | Effort |
|-------|------|--------|
| **Seeding script is destructive** | Data loss | 1 hour |
| **Validation middleware uses old schema** | Registration failures | 2 hours |
| **Add `amountPaid` to schema** | Financial audit failure | 1 hour |
| **Add database indexes** | Performance degradation | 30 mins |

### 💡 Optional Improvements

1. Move to background email sending (queue-based)
2. Add Sentry/error monitoring
3. Implement rate limiting on registration endpoint
4. Add registration export (CSV) functionality
5. Consider separate registrations collection for very large events

---

## Readiness Score: 6.5/10

| Category | Score | Notes |
|----------|-------|-------|
| Schema Design | 7/10 | Good structure, missing `amountPaid` |
| Slot Management | 9/10 | Excellent concurrency handling |
| Registration Flow | 8/10 | Comprehensive validation |
| Payment Security | 7/10 | Verified but incomplete audit trail |
| Seeding Safety | 2/10 | Destructive implementation |
| Email System | 6/10 | Functional but blocking |
| Performance | 5/10 | Missing indexes |
| Security | 7/10 | Stale middleware is critical |

**Verdict:** System is structurally sound but requires 4-5 hours of critical fixes before production deployment.

---

## Appendix: Priority Fix Checklist

- [ ] Update `eventValidationMiddleware.js` to use new `slots.open`/`slots.official` structure
- [ ] Change `seedDynamicEvents.js` to use upsert pattern
- [ ] Add `amountPaid` field to participant/team schemas and populate on registration
- [ ] Add database indexes to Event and Payment models
- [ ] Validate `inventoId` format in registration flow
- [ ] Make email sending non-blocking

---

*Report generated: January 31, 2026*
