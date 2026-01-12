import mongoose from "mongoose";
import ContingentKey from "./src/models/contingentKeyModel.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 8; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

const seedKeys = async () => {
    await connectDB();

    const collegeNames = [
        "KLE Dr. MS Sheshgiri College of Engineering and Technology",
        "KLS Gogte Institute of Technology",
        "Jain Engineering College"
    ];

    const keys = collegeNames.map(clgName => ({
        clgName,
        key: generateRandomKey()
    }));

    try {
        await ContingentKey.deleteMany();
        await ContingentKey.insertMany(keys);
        console.log("Contingent Keys Seeded:", keys);
    } catch (err) {
        console.error("Error seeding keys:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedKeys();
