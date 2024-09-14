import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    cardNumber: { type: String, required: true },
    paymentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    orderStatus: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    orderProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    totalAmount: { type: Number, required: true },
    customerAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    sellerAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema)