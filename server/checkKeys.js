import mongoose from "mongoose";
import ContingentKey from "./src/models/contingentKeyModel.js";
import dotenv from "dotenv";

dotenv.config();

const checkKeys = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const keys = await ContingentKey.find({});
        console.log("CURRENT KEYS:");
        keys.forEach(k => {
            console.log(`College: ${k.clgName}`);
            console.log(`Key:     ${k.key}`);
            console.log("-------------------------");
        });
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkKeys();
