import mongoose from "mongoose";
import User from "./src/models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const verifyUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = "inv00002";
        const user = await User.findById(id);
        if (user) {
            user.isVerified = true;
            await user.save();
            console.log(`User ${id} (${user.name}) is now VERIFIED.`);
        } else {
            console.log("User NOT found.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

verifyUser();
