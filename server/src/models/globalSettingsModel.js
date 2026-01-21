import mongoose from "mongoose";

const globalSettingsSchema = new mongoose.Schema({
    passControl: {
        type: String,
        enum: ["to all", "typewise", "close"],
        default: "to all"
    },
    registrationsOpen: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Ensure only one settings document exists
globalSettingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const GlobalSettings = mongoose.model("GlobalSettings", globalSettingsSchema);
export default GlobalSettings;
