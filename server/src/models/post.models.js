import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    uploadByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    comments: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        images: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        createdAt: { type: Date, default: Date.now },
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema)