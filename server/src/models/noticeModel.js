import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["news", "update", "alert"], default: "update" },
    date: { type: Date, default: Date.now },
    category: { type: String, default: "General" }
}, { timestamps: true });

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
