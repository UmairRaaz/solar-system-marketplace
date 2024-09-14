import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    image: { type: String },
    addressRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    phoneNumber: { type: String },
    role: { type: String, enum: ['user', 'seller', 'admin'], required: true, default: 'user' },
    paymentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

// Hashing the password before saving
userSchema.pre("save", async function (next) {
    console.log("Hashing password:", this.password);
    if (!this.isModified("password")) return next();
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = async function () {
    console.log("Generating access token for:", this._id);
    try {
        const token = await jwt.sign({
            _id: this._id,
            role: this.role,
            email: this.email,
            username: this.userName,
            fullName: this.fullName,
        }, process.env.AccessTokenSecret || 'youraccesstokensecret', { expiresIn: process.env.AccessTokenExpiry || '1h' });
        // console.log("Generated Access Token:", token);
        return token;
    } catch (err) {
        console.log("Error generating access token:", err);
    }
};

userSchema.methods.generateRefreshToken = async function () {
    console.log("Generating refresh token for:", this._id);
    try {
        const token = await jwt.sign({
            _id: this._id,
        }, process.env.RefreshTokenSecret || 'yourrefreshtokensecret', { expiresIn: process.env.RefreshTokenExpiry || '7d' });
        // console.log("Generated Refresh Token:", token);
        return token;
    } catch (err) {
        console.log("Error generating refresh token:", err);
    }
};



export const User = mongoose.model("User", userSchema);
