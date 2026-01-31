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

    // Help to safely get number or use specialized default
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
            // Default gendered platinum events to 15 if null
            const defaultGenderVal = 15;
            const maleTotal = getNum(sourceCat.gender?.male, getNum(sourceCat.male?.total, defaultGenderVal));
            const femaleTotal = getNum(sourceCat.gender?.female, getNum(sourceCat.female?.total, defaultGenderVal));

            // Set Available = Total initially
            dbSlots[category].gender.male = maleTotal;
            dbSlots[category].gender.female = femaleTotal;

            // For categories like 'open', we might still want an aggregate total
            dbSlots[category].total = maleTotal + femaleTotal;
            dbSlots[category].available = maleTotal + femaleTotal;
        } else {
            // Non-Gender Specific Logic
            // Apply default of 40 ONLY for 'open' category if values are missing/null
            const defaultTotal = category === 'open' ? 40 : 0;

            const total = getNum(sourceCat.total, defaultTotal);
            dbSlots[category].total = total;
            dbSlots[category].available = total; // Set Available = Total initially
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

            // SAFE UPDATE: Only update static metadata, NEVER overwrite:
            // - registrations (participants/teams)
            // - slots.available (dynamic field)
            // - paymentId references

            const updateDoc = {
                name: event.title,
                subtitle: event.subtitle,
                description: event.description,
                club: event.club,
                tier: event.tier,
                eventType: event.type,
                minTeamSize: event.team?.min || 1,
                maxTeamSize: event.team?.max || 1,
                rules: event.rules || [],
                rounddetails: event.roundDetails || [],
                contact: event.contact || [],
                logistics: {
                    venue: event.venue || "TBD",
                    date: event.date || "TBD"
                },
                whatsapplink: event.whatsapplink || "",
                isGenderSpecific,
                isPricePerPerson: event.isPricePerPerson || false,
                price: event.registartionfee || 0,

                // Only update total slot counts, NEVER touch available
                'slots.open.total': slots.open.total,
                'slots.official.total': slots.official.total,

                'registration.isOpen': event.status === "Open",
                'registration.officialTeamsPerCollege': event.teampercollege || 3,
                'registration.officialOnly': false
            };

            return {
                updateOne: {
                    filter: { _id: event.slug },
                    update: {
                        $set: updateDoc,
                        // ONLY set these fields if document is NEW (insert)
                        $setOnInsert: {
                            registrations: { participants: [], teams: [] },
                            'slots.open.available': slots.open.available,
                            'slots.official.available': slots.official.available,
                            // Initialize gender counts ONLY on insert to prevent overwriting reg counts
                            ...(isGenderSpecific && {
                                'slots.open.gender.male': slots.open.gender.male,
                                'slots.open.gender.female': slots.open.gender.female,
                                'slots.official.gender.male': slots.official.gender.male,
                                'slots.official.gender.female': slots.official.gender.female
                            }),
                            createdAt: new Date()
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
