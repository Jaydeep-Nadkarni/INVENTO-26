import { body, param, validationResult } from "express-validator";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import {
    SlotFullError,
    InvalidGenderError,
    DuplicateRegistrationError,
    EventNotFoundError,
    RegistrationClosedError,
    TeamSizeError
} from "../utils/customErrors.js";

// Basic request structure validation using express-validator
export const registrationSchema = [
    param("id").notEmpty().withMessage("Event ID is required"),
    body("isOfficial").optional().isBoolean(),
    body("contingentKey").optional().isString(),

    // Conditional validation based on eventType (we'll check it in the logic middleware)
];

// Middleware to catch express-validator errors
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Comprehensive logic validation
export const validateRegistrationLogic = async (req, res, next) => {
    try {
        const eventId = req.params.id.trim();
        const { inventoId, teamName, members, isOfficial } = req.body;

        // 1. Check if event exists
        const event = await Event.findOne({ $or: [{ _id: eventId }, { id: eventId }] });
        if (!event) {
            throw new EventNotFoundError();
        }

        // 2. Check if registrations are open
        if (event.registration?.isOpen === false) {
            throw new RegistrationClosedError();
        }

        // 5. Check Gender-based Event Type (Master/Miss/Mr/Ms)
        const isMasterMiss = /master|miss|mr\.|ms\./i.test(event.name);

        // 3. Check slots availability (Soft check)
        // For gender-based events, we skip this and check specific slots later
        if (!isMasterMiss && event.slots.availableSlots <= 0) {
            throw new SlotFullError();
        }

        // SOLO Event Logic
        if (event.eventType === "SOLO") {
            if (!inventoId) {
                return res.status(400).json({ message: "Invento ID is required for SOLO events" });
            }

            const user = await User.findById(inventoId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // 4. Duplicate Check
            const isRegistered = event.registrations.participants.some(p => p.inventoId === inventoId);
            if (isRegistered) {
                throw new DuplicateRegistrationError();
            }

            // 5b. Gender Check (Master/Miss)
            if (isMasterMiss) {
                let slotKey = null;
                const gender = user.gender?.toLowerCase();
                if (gender === "male") slotKey = "male";
                else if (gender === "female") slotKey = "female";

                if (!slotKey) {
                    throw new InvalidGenderError("Gender must be Male or Female for this event");
                }

                const availableGenderSlots = (typeof event.specificSlots?.get === "function" 
                    ? event.specificSlots.get(slotKey) 
                    : event.specificSlots?.[slotKey]) || 0;

                if (availableGenderSlots <= 0) {
                    throw new SlotFullError(`No slots available for ${user.gender} participants`);
                }
            }
        }

        // TEAM Event Logic
        else if (event.eventType === "TEAM") {
            if (!teamName) {
                return res.status(400).json({ message: "Team name is required for TEAM events" });
            }

            let memberList = members;
            try {
                if (typeof members === 'string') memberList = JSON.parse(members);
            } catch (e) {
                return res.status(400).json({ message: "Invalid members format" });
            }

            if (!Array.isArray(memberList)) {
                return res.status(400).json({ message: "Members must be an array" });
            }

            // 6. Team Size Check
            if (memberList.length < (event.minTeamSize || 1) || memberList.length > (event.maxTeamSize || 10)) {
                throw new TeamSizeError(`Team size must be between ${event.minTeamSize || 1} and ${event.maxTeamSize || 10}`);
            }

            // 7. Duplicate Check for Team Members
            const alreadyRegistered = event.registrations.teams.some(team =>
                team.members.some(m => memberList.includes(m.inventoId))
            );
            if (alreadyRegistered) {
                throw new DuplicateRegistrationError("One or more team members are already registered for this event");
            }
        }

        // Attach event to request for use in controller
        req.validatedEvent = event;
        next();
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.name,
                message: error.message
            });
        }
        next(error);
    }
};
