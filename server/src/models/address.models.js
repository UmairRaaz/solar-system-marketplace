import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
}, { timestamps: true });

export const Address = mongoose.model("Address", addressSchema)