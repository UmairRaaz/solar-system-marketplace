import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    uploadBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema)