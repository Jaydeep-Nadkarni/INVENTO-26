import mongoose from "mongoose";
import dotenv from "dotenv";
import Notice from "./src/models/noticeModel.js";

dotenv.config();

const seedNotices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding notices...");

        const initialNotices = [
            {
                title: "Registration Deadline Extended",
                content: "High Command has decided to extend the registration deadline by 48 hours for all major operations. Agents must finalize their credentials immediately.",
                type: "update",
                category: "General"
            },
            {
                title: "Security Breach Detected",
                content: "An unauthorized attempt to access the Retro Terminal was intercepted. All agents are required to rotate their encryption keys by 18:00 hours.",
                type: "alert",
                category: "Security"
            },
            {
                title: "New Spy Gadgets Released",
                content: "The Technical Division has released a new set of CSS-based cloaking devices. Check the Evidence Briefcase for more details.",
                type: "news",
                category: "Technical"
            }
        ];

        await Notice.deleteMany({});
        await Notice.insertMany(initialNotices);

        console.log("Notices seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding notices:", error);
        process.exit(1);
    }
};

seedNotices();
