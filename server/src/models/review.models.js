import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewToProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    ratingStar: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema)