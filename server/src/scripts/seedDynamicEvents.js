import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Event from "../models/eventModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const EVENTS_FILE_PATH = path.join(__dirname, "../../../client/src/components/Events/events.js");
const CLUBS_FILE_PATH = path.join(__dirname, "../../../client/src/components/Events/clubsData.js");

// Function to safely load data from the client-side JS file
const loadData = (filePath, isClubs = false) => {
    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const startIdx = fileContent.indexOf("[");
        const endIdx = fileContent.lastIndexOf("]");
        if (startIdx === -1 || endIdx === -1) return [];
        const arrayStr = fileContent.substring(startIdx, endIdx + 1);

        if (isClubs) {
            // Mock common illustration imports that would cause ReferenceErrors in clubsData.js
            const mocks = ["melodia", "dance", "media", "hr", "literary", "cdc", "wec", "sports", "finearts", "titleEvents", "fashion", "specials", "gaming"];
            const mockDecls = mocks.map(m => `const ${m}Illustration = "";`).join("\n") +
                "\n" + mocks.map(m => `const ${m}Illustartion = "";`).join("\n");
            return new Function(`${mockDecls}\nreturn ${arrayStr}`)();
        }

        return new Function(`return ${arrayStr}`)();
    } catch (error) {
        console.warn(`Warning: Could not fully parse ${path.basename(filePath)}. Error: ${error.message}`);
        return [];
    }
};

const seed = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not found in environment variables");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected ✅");

        const staticEvents = loadData(EVENTS_FILE_PATH);
        const staticClubs = loadData(CLUBS_FILE_PATH, true);
        console.log(`Loaded ${staticEvents.length} events and ${staticClubs.length} clubs from static files.`);

        console.log("Clearing existing events...");
        await Event.deleteMany({});

        const transformedEvents = staticEvents.map(event => {
            // Gender specific slots logic
            const isGenderSpecific = event.isGenderSpecific || false;
            let specificSlots = {};
            let slots = {
                totalSlots: event.slots?.total || 40,
                availableSlots: event.slots?.available || 40
            };

            if (isGenderSpecific) {
                const total = event.slots?.total || 40;
                const half = Math.floor(total / 2);
                specificSlots = {
                    male: half,
                    female: half
                };
                slots = {}; // Ensure slots object is empty for gender specific events
            }

            return {
                _id: event.slug, // used as canonical ID
                id: (event.id || "").toString(), // numeric ID backup
                name: event.title,
                club: event.club,
                whatsapplink: event.whatsapplink,
                isGenderSpecific,

                // Dynamic fields
                price: event.registartionfee || 0,
                slots,
                specificSlots,
                registration: {
                    isOpen: event.status === "Open",
                    officialTeamsPerCollege: event.teampercollege || 3
                },
                registrations: {
                    participants: [],
                    teams: []
                }
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
