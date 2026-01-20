/**
 * MongoDB BSON Validation Schema for the 'events' collection.
 * 
 * Enforces data integrity for:
 * - Event metadata (name, price, club)
 * - Event type (SOLO or TEAM)
 * - Registration slots and logistics
 * - Nested registrations for participants and teams
 * - Status enums for participants/teams
 * - Constraint: SOLO events cannot have teams, TEAM events cannot have participants
 */

export const eventSchemaValidator = {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "eventType", "price", "club", "registrations"],
        properties: {
            _id: { bsonType: "string" },
            id: { bsonType: "string" },
            name: {
                bsonType: "string",
                description: "The name of the event is required and must be a string."
            },
            eventType: {
                enum: ["SOLO", "TEAM"],
                description: "eventType must be either 'SOLO' or 'TEAM' and is required."
            },
            club: {
                bsonType: "array",
                items: { bsonType: "string" },
                description: "club must be an array of strings representing organizing clubs."
            },
            price: {
                bsonType: ["number", "int", "long"],
                minimum: 0,
                description: "price must be a non-negative number."
            },
            slots: {
                bsonType: "object",
                required: ["totalSlots", "availableSlots"],
                properties: {
                    totalSlots: { bsonType: "int", minimum: 0 },
                    availableSlots: { bsonType: "int", minimum: 0 }
                },
                description: "slots must be an object with totalSlots and availableSlots."
            },
            specificSlots: {
                bsonType: "object",
                description: "specificSlots must be an object (e.g., for gender-based allocation)."
            },
            registration: {
                bsonType: "object",
                properties: {
                    isOpen: { bsonType: "boolean" },
                    deadline: { bsonType: "date" },
                    officialTeamsPerCollege: { bsonType: "int", minimum: 0 }
                },
                description: "registration metadata."
            },
            registrations: {
                bsonType: "object",
                required: ["participants", "teams"],
                properties: {
                    participants: {
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            required: ["inventoId", "status"],
                            properties: {
                                inventoId: { bsonType: "string" },
                                name: { bsonType: "string" },
                                email: { bsonType: "string" },
                                phone: { bsonType: "string" },
                                clgName: { bsonType: "string" },
                                paid: { bsonType: "boolean" },
                                status: {
                                    enum: ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"],
                                    description: "Status must be one of: PENDING, CONFIRMED, WAITLIST, CANCELLED, DISQUALIFIED"
                                },
                                isOfficial: { bsonType: "boolean" },
                                contingentKey: { bsonType: "string" }
                            }
                        }
                    },
                    teams: {
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            required: ["leaderId", "status"],
                            properties: {
                                teamName: { bsonType: "string" },
                                leaderId: { bsonType: "string" },
                                paid: { bsonType: "boolean" },
                                status: {
                                    enum: ["PENDING", "CONFIRMED", "WAITLIST", "CANCELLED", "DISQUALIFIED"],
                                    description: "Status must be one of: PENDING, CONFIRMED, WAITLIST, CANCELLED, DISQUALIFIED"
                                },
                                isOfficial: { bsonType: "boolean" },
                                contingentKey: { bsonType: "string" },
                                members: {
                                    bsonType: "array",
                                    items: {
                                        bsonType: "object",
                                        required: ["inventoId"],
                                        properties: {
                                            inventoId: { bsonType: "string" },
                                            name: { bsonType: "string" },
                                            email: { bsonType: "string" },
                                            phone: { bsonType: "string" },
                                            clgName: { bsonType: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            logistics: {
                bsonType: "object",
                properties: {
                    venue: { bsonType: "string" },
                    date: { bsonType: "date" },
                    time: { bsonType: "string" },
                    whatsappLink: { bsonType: "string" }
                }
            },
            whatsappLink: { bsonType: "string" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
        },
        // Conditional constraints using if-then
        allOf: [
            {
                if: {
                    properties: { eventType: { const: "SOLO" } }
                },
                then: {
                    properties: {
                        registrations: {
                            properties: {
                                teams: { maxItems: 0 }
                            }
                        }
                    }
                }
            },
            {
                if: {
                    properties: { eventType: { const: "TEAM" } }
                },
                then: {
                    properties: {
                        registrations: {
                            properties: {
                                participants: { maxItems: 0 }
                            }
                        }
                    }
                }
            }
        ]
    }
};
