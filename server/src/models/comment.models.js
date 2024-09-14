import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    commentToPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    commentByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema)