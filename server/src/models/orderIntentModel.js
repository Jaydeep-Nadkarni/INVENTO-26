import mongoose from "mongoose";

const orderIntentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    eventId: {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    isOfficial: {
        type: Boolean,
        default: false
    },
    contingentKey: {
        type: String
    },
    status: {
        type: String,
        enum: ['created', 'used', 'failed'],
        default: 'created'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Intent expires in 1 hour
    }
}, { timestamps: true });

const OrderIntent = mongoose.model("OrderIntent", orderIntentSchema);
export default OrderIntent;
