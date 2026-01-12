import mongoose from "mongoose";
import dotenv from "dotenv";
import Volunteer from "./src/models/volunteerModel.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const seedVolunteers = async () => {
    await connectDB();

    const volunteers = [
        {
            name: "Jaydeep",
            email: "jaydeepnadkarni123@gmail.com",
            accessId: "Jaydeep123"
        }
    ];

    try {
        // Upsert logic to avoid duplicates
        for (const v of volunteers) {
            await Volunteer.findOneAndUpdate(
                { email: v.email },
                v,
                { upsert: true, new: true }
            );
        }
        console.log("Volunteers Seeded Successfully:", volunteers.length);
    } catch (err) {
        console.error("Error seeding volunteers:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedVolunteers();
