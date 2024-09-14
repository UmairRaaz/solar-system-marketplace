import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    cardNumber: { type: String, },
    method: { type: String },
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema)