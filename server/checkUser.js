import mongoose from "mongoose";
import User from "./src/models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = "inv00002";
        const user = await User.findById(id);
        console.log(`Checking for user ID: ${id}`);
        if (user) {
            console.log("User Found:", user.name);
            console.log("Verified:", user.isVerified);
        } else {
            console.log("User NOT found.");
            const allUsers = await User.find({}).limit(5);
            console.log("First 5 users in DB:");
            allUsers.forEach(u => console.log(u._id, u.name));
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkUser();
