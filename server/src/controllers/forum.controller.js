import { Post } from '../models/post.models.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


// Add a post
const addPost = asyncHandler(async (req, res) => {
    const { content } = req.body; 
    const images = req.files ? req.files.map(file => file.path) : []; // Access images from req.files

    console.log(req.body.content); // Should show the content
    console.log(images); // Should show the array of image paths

    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    const uploadByUserId = req.user._id;

    const newPost = new Post({
        uploadByUserId,
        content,
        images: images || []
    });

    await newPost.save();

    return res.status(201).json(new ApiResponse(201, { post: newPost }, "Post created successfully."));
});

// Get all posts by logged-in user
const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const posts = await Post.find({ uploadByUserId: userId });
    
    return res.status(200).json(new ApiResponse(200, posts, "User posts fetched successfully."));
});

// Edit a post (only owner can edit)

const editPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, images } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    // Check if the logged-in user is the owner of the post
    if (post.uploadByUserId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to edit this post.");
    }

    // Update post content and images
    post.content = content || post.content;
    post.images = images || post.images;

    await post.save();

    return res.status(200).json(new ApiResponse(200, { post }, "Post updated successfully."));
});

// Delete a post (only owner can delete)

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    // Check if the logged-in user is the owner of the post
    if (post.uploadByUserId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this post.");
    }

    await post.remove();

    return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully."));
});

// Show all posts (public)
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate('uploadByUserId', 'name')  // Populate uploader's name
        .sort({ createdAt: -1 });  // Sort by most recent

    return res.status(200).json(new ApiResponse(200, posts, "All posts fetched successfully."));
});

export { addPost, getUserPosts, editPost, deletePost,  getAllPosts};

