import { Post } from '../models/post.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Add a post
const addPost = asyncHandler(async (req, res) => {
    const { content, images } = req.body;

    if (!content) {
        return res.status(400).json({ message: "Content is required." });
    }

    const uploadByUserId = req.user._id;

    const newPost = new Post({
        uploadByUserId,
        content,
        images: images || []
    });

    await newPost.save();

    res.status(201).json({
        message: "Post created successfully.",
        post: newPost
    });
});

// Get all posts by logged-in user
const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const posts = await Post.find({ uploadByUserId: userId });
    res.status(200).json(posts);
});

// Edit a post (only owner can edit)
const editPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, images } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.uploadByUserId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not allowed to edit this post" });
    }

    // Update post content and images
    post.content = content || post.content;
    post.images = images || post.images;

    await post.save();

    res.status(200).json({
        message: "Post updated successfully",
        post
    });
});

// Delete a post (only owner can delete)
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.uploadByUserId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not allowed to delete this post" });
    }

    await post.remove();

    res.status(200).json({ message: "Post deleted successfully" });
});

// Show all posts (public)
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('uploadByUserId', 'name'); // Populate user details
    res.status(200).json(posts);
});



export { addPost, getUserPosts, editPost, deletePost, getAllPosts };
