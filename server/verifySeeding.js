import mongoose from "mongoose";
import Event from "./src/models/eventModel.js";
import dotenv from "dotenv";

dotenv.config();

const verifySeeding = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Check Mr & Ms Invento
        const mrMs = await Event.findById("mr-and-ms-invento");
        if (mrMs) {
            console.log("MR & MS INVENTO FOUND:");
            console.log(`- Name: ${mrMs.name}`);
            console.log(`- Slots: ${JSON.stringify(mrMs.slots)}`);
            console.log(`- Specific Slots: ${JSON.stringify(mrMs.specificSlots)}`);
            console.log(`- Official Teams: ${mrMs.registration.officialTeamsPerCollege}`);
            console.log(`- Participants Array: ${mrMs.registrations.participants.length}`);
            console.log(`- Teams Array: ${mrMs.registrations.teams.length}`);
        } else {
            console.log("MR & MS INVENTO NOT FOUND");
        }

        // Check a team event
        const valorant = await Event.findById("vanguard-x-valorant-showdown");
        if (valorant) {
            console.log("\nVALORANT SHOWDOWN FOUND:");
            console.log(`- EventType: ${valorant.eventType}`);
            console.log(`- Official Teams: ${valorant.registration.officialTeamsPerCollege}`);
        }

        // Check if old fields are gone
        const sample = await Event.findOne();
        if (sample) {
            console.log("\nSAMPLE RAW FIELDS:");
            console.log(Object.keys(sample.toObject()).filter(k => !['_id', 'createdAt', 'updatedAt', '__v'].includes(k)));
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

verifySeeding();
