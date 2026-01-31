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
    body("inventoId").optional().matches(/^inv\d{5}$/i).withMessage("Invalid Invento ID format (expected: inv00001)"),
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

        // Determine slot category based on registration type
        const category = isOfficial ? "official" : "open";
        const isGenderSpecific = event.isGenderSpecific === true;

        // 3. Check slots availability (General check for non-gender events)
        if (!isGenderSpecific) {
            if (event.slots[category].available <= 0) {
                return res.status(409).json({
                    error: "SlotFullError",
                    message: `No ${category} slots available for this event`
                });
            }
        }

        // SOLO Event Logic
        if (event.eventType === "SOLO") {
            if (!inventoId) {
                return res.status(400).json({ message: "Invento ID is required for SOLO events" });
            }

            // Validate inventoId format
            if (!/^inv\d{5}$/i.test(inventoId)) {
                return res.status(400).json({ message: "Invalid Invento ID format (expected: inv00001)" });
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

            // 5. Gender-Specific Slot Check
            if (isGenderSpecific) {
                const gender = user.gender?.toLowerCase();
                const slotKey = (gender === "male") ? "male" : (gender === "female") ? "female" : null;

                if (!slotKey) {
                    throw new InvalidGenderError("Gender must be Male or Female for this event");
                }

                if (event.slots[category].gender[slotKey] <= 0) {
                    return res.status(409).json({
                        error: "SlotFullError",
                        message: `No ${category} ${gender} slots available`
                    });
                }
            }
        }

        // TEAM Event Logic
        else if (event.eventType === "TEAM") {
            if (!teamName || !teamName.trim()) {
                return res.status(400).json({ message: "Team name is required for TEAM events" });
            }

            // Check team name uniqueness within this event
            const teamExists = event.registrations.teams.some(t =>
                t.teamName.toLowerCase() === teamName.trim().toLowerCase()
            );
            if (teamExists) {
                return res.status(400).json({ message: "Team name already exists for this event" });
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

            // Validate all member IDs format
            for (const memberId of memberList) {
                if (!/^inv\d{5}$/i.test(memberId)) {
                    return res.status(400).json({
                        message: `Invalid Invento ID format for member: ${memberId} (expected: inv00001)`
                    });
                }
            }

            // 6. Team Size Check
            const minSize = event.minTeamSize || 1;
            const maxSize = event.maxTeamSize || 10;

            if (memberList.length < minSize || memberList.length > maxSize) {
                throw new TeamSizeError(`Team size must be between ${minSize} and ${maxSize}`);
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
