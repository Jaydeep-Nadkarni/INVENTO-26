import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Event from "../models/eventModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const EVENTS_FILE_PATH = path.join(__dirname, "../../../client/src/components/Events/events.js");

// Function to safely load the events data from the client-side JS file
const loadEventsData = () => {
    const fileContent = fs.readFileSync(EVENTS_FILE_PATH, "utf-8");
    // Simple extraction of the array from 'const eventsData = [...];'
    // This is safer than eval for this specific structure
    const startIdx = fileContent.indexOf("[");
    const endIdx = fileContent.lastIndexOf("]");
    const arrayStr = fileContent.substring(startIdx, endIdx + 1);

    // We need to handle the fact that it's a JS object literal, not strictly JSON
    // But since it's being used in a script, we can use Function constructor for a bit more safety than eval
    return new Function(`return ${arrayStr}`)();
};

const seed = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not found in environment variables");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected ✅");

        const staticEvents = loadEventsData();
        console.log(`Loaded ${staticEvents.length} events from static file.`);

        console.log("Clearing existing events...");
        await Event.deleteMany({});

        const transformedEvents = staticEvents.map(event => {
            const isSolo = event.type.toLowerCase() === "solo";
            const eventType = isSolo ? "SOLO" : "TEAM";

            // Initialize registrations based on event type
            // Both are initialized as empty arrays, but the BSON validator
            // will enforce maxItems: 0 for the non-applicable one.
            const registrations = {
                participants: [],
                teams: []
            };

            // Logistics mapping
            const logistics = {
                venue: event.venue || "TBD",
                date: null,
                time: event.time || "TBD",
                whatsappLink: event.whatsapplink || ""
            };

            // Attempt to parse date "26-02-2026" or "Day 0"
            if (event.date && event.date.includes("-")) {
                const [day, month, year] = event.date.split("-");
                logistics.date = new Date(`${year}-${month}-${day}T00:00:00Z`);
            }

            // Specific slots for Master/Miss events
            let specificSlots = {};
            const isMasterMiss = event.title.toLowerCase().includes("mr.") ||
                event.title.toLowerCase().includes("ms.") ||
                event.title.toLowerCase().includes("miss");

            if (isMasterMiss) {
                specificSlots = {
                    male: 20, // Default allocation
                    female: 20
                };
            }

            return {
                _id: event.slug, // Use slug as _id for clean URLs
                id: event.id.toString(),
                name: event.title,
                eventType,
                club: [event.club],
                price: event.registartionfee || 0,
                slots: {
                    totalSlots: event.slots?.total || 100, // Fallback to 100 if null
                    availableSlots: event.slots?.available || 100
                },
                specificSlots,
                registration: {
                    isOpen: event.status === "Open",
                    officialTeamsPerCollege: event.teampercollege || 3
                },
                registrations,
                logistics,
                whatsappLink: event.whatsapplink || ""
            };
        });

        console.log("Inserting new events...");
        await Event.insertMany(transformedEvents);
        console.log(`Successfully seeded ${transformedEvents.length} events ✅`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed ❌:", error);
        process.exit(1);
    }
};

seed();
