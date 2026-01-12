import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accessId: { type: String, required: true, unique: true } // The ID they use to login
}, { timestamps: true });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;
