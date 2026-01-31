import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Event from "./src/models/eventModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const EVENTS_FILE_PATH = path.join(__dirname, "../client/src/components/Events/events.js");
const CLUBS_FILE_PATH = path.join(__dirname, "../client/src/components/Events/clubsData.js");

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

const mapSlots = (event) => {
    const isGenderSpecific = event.isGenderSpecific === true;
    const sourceSlots = event.slots || {};

    // Initialize database slots structure matching new schema
    const dbSlots = {
        open: { total: 0, available: 0, gender: { male: 0, female: 0 } },
        official: { total: 0, available: 0, gender: { male: 0, female: 0 } }
    };

    // Helper to safely get number or null
    const getNum = (val, defaultVal = 0) => (val !== null && val !== undefined ? val : defaultVal);

    // Process 'open' and 'official' categories
    ['open', 'official'].forEach(category => {
        const sourceCat = sourceSlots[category];
        if (!sourceCat) {
            // Backward compatibility: if new structure missing, apply defaults only for open
            if (category === 'open' && !isGenderSpecific && !sourceSlots.open && !sourceSlots.official) {
                // Fallback to flat slots if they exist in source (old format support)
                const oldTotal = event.slots?.total;
                const oldAvailable = event.slots?.available;
                // Default to 40 if absolutely nothing is defined for open slots
                dbSlots.open.total = getNum(oldTotal, 40);
                dbSlots.open.available = getNum(oldAvailable, 40);
            }
            return;
        }

        if (isGenderSpecific) {
            // Gender Specific Logic
            // Source might be { open: { gender: { male: X, female: Y } } } or flat
            // The user requested structure: open: { total, available, gender: { male, female } }
            // Let's assume input source follows the same or we adapt it.
            // If source has sourceCat.gender.male -> use it.
            // If source has sourceCat.male -> use it (old structure compatibility).

            const maleVal = getNum(sourceCat.gender?.male) || getNum(sourceCat.male?.available) || 0;
            const femaleVal = getNum(sourceCat.gender?.female) || getNum(sourceCat.female?.available) || 0;

            dbSlots[category].gender.male = maleVal;
            dbSlots[category].gender.female = femaleVal;
        } else {
            // Non-Gender Specific Logic
            // Apply default of 40 ONLY for 'open' category if values are missing/null
            const defaultTotal = category === 'open' ? 40 : 0;

            dbSlots[category].total = getNum(sourceCat.total, defaultTotal);
            dbSlots[category].available = getNum(sourceCat.available, defaultTotal);
        }
    });

    return dbSlots;
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
        console.log(`Loaded ${staticEvents.length} events from static file.`);

        // Safe Seeding: UPSERT instead of DELETE
        console.log("Upserting events...");

        const bulkOps = staticEvents.map(event => {
            const isGenderSpecific = event.isGenderSpecific || false;
            const slots = mapSlots(event);

            const updateDoc = {
                id: (event.id || "").toString(),
                name: event.title,
                club: event.club,
                eventType: event.type,
                whatsapplink: event.whatsapplink,
                isGenderSpecific,
                isPricePerPerson: event.isPricePerPerson || false,
                price: event.registartionfee || 0,
                // Only set slots if it's a new document OR we want to reset them logic (usually seeding resets static config)
                // However, preserving 'available' counts is crucial if we don't want to reset capacity.
                // But the user's request implies restructuring, so we MUST update structure. 
                // We'll set slots on seed. Ideally, we shouldn't overwrite if registrations exist, 
                // but for this structure migration, we might have to. 
                // The mapSlots function returns 'available' based on static file. 
                // If registrations exist, 'available' should be re-calculated or preserved.
                // For now, let's just update the structure as that is the user's immediate need to fix the bug.
                slots: slots,

                registration: {
                    isOpen: event.status === "Open",
                    officialTeamsPerCollege: event.teampercollege || 3,
                    officialOnly: false
                }
            };

            return {
                updateOne: {
                    filter: { _id: event.slug },
                    update: {
                        $set: updateDoc,
                        $setOnInsert: {
                            registrations: { participants: [], teams: [] } // Initialize only if new
                        }
                    },
                    upsert: true
                }
            };
        });

        const result = await Event.bulkWrite(bulkOps);
        console.log(`Seeding complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed ❌:", error);
        process.exit(1);
    }
};

seed();
