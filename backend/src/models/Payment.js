import mongoose from "mongoose";

// Payment Schema
const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userPolicyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserPolicy",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ["CARD", "NETBANKING", "OFFLINE", "SIMULATED"],
        required: true
    },
    reference: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["SUCCESS", "FAILED", "PENDING"],
        default: "SUCCESS"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model("Payment", paymentSchema);
