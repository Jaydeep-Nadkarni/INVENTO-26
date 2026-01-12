import mongoose from "mongoose";

const contingentKeySchema = new mongoose.Schema({
    clgName: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

const ContingentKey = mongoose.model("ContingentKey", contingentKeySchema);
export default ContingentKey;
