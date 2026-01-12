import mongoose from "mongoose";
import Event from "./src/models/eventModel.js";
import dotenv from "dotenv";

dotenv.config();

const checkEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await Event.find({}, 'name id _id type minTeamSize maxTeamSize');
        console.log("EVENTS IN DB:");
        events.forEach(e => {
            console.log(`- ${e.name} | ID: ${e.id || 'N/A'} | _id: ${e._id} | Type: ${e.type} | Teams: ${e.minTeamSize}-${e.maxTeamSize}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkEvents();
