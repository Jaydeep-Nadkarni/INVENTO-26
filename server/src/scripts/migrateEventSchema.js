import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { eventSchemaValidator } from "../config/eventSchemaValidator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const migrate = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not found in environment variables");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected ✅");

        const db = mongoose.connection.db;
        const collectionName = "events";

        // 1. Check if collection exists
        const collections = await db.listCollections({ name: collectionName }).toArray();
        if (collections.length === 0) {
            console.log(`Collection '${collectionName}' does not exist. Creating it...`);
            await db.createCollection(collectionName);
        }

        // 2. Data Migration: Transform existing documents to match new schema
        console.log("Migrating existing data...");
        const events = await db.collection(collectionName).find({}).toArray();

        for (const event of events) {
            const updates = {};
            const unsetFields = {};

            // Transform 'type' to 'eventType'
            if (event.type && !event.eventType) {
                updates.eventType = event.type.toUpperCase();
                unsetFields.type = "";
            }

            // Move 'participants' and 'teams' into 'registrations'
            if (!event.registrations) {
                updates.registrations = {
                    participants: (event.participants || []).map(p => ({
                        ...p,
                        status: p.status || "CONFIRMED"
                    })),
                    teams: (event.teams || []).map(t => ({
                        ...t,
                        status: t.status || "CONFIRMED"
                    }))
                };
                unsetFields.participants = "";
                unsetFields.teams = "";
            }

            // Initialize other new fields if they don't exist
            if (event.slots === undefined) updates.slots = 0;
            if (event.specificSlots === undefined) updates.specificSlots = {};
            if (event.registration === undefined) updates.registration = { isOpen: true };
            if (event.logistics === undefined) {
                updates.logistics = {
                    venue: "TBD",
                    whatsappLink: event.whatsappLink || ""
                };
            }

            const updateOp = {};
            if (Object.keys(updates).length > 0) updateOp.$set = updates;
            if (Object.keys(unsetFields).length > 0) updateOp.$unset = unsetFields;

            if (Object.keys(updateOp).length > 0) {
                await db.collection(collectionName).updateOne({ _id: event._id }, updateOp);
                console.log(`Updated event: ${event._id}`);
            }
        }

        // 3. Apply BSON Validator
        console.log("Applying BSON validator...");
        await db.runCommand({
            collMod: collectionName,
            validator: eventSchemaValidator,
            validationLevel: "strict",
            validationAction: "error"
        });

        console.log("BSON Validator applied successfully ✅");
        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed ❌:", error);
        process.exit(1);
    }
};

migrate();
