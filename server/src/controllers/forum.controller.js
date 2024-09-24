import { Post } from '../models/post.models.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


// Add a post
const addPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    let imagesArray = [];

    // If there are images, upload each to Cloudinary and store the URLs in imagesArray
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const uploadedImages = await Promise.all(uploadPromises);

        imagesArray = uploadedImages.map(image => image.secure_url); // Collect Cloudinary secure URLs
    }

    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    const uploadByUserId = req.user._id;

    const newPost = new Post({
        uploadByUserId,
        content,
        images: imagesArray,  // Store the Cloudinary URLs here
    });

    await newPost.save();

    return res.status(201).json(new ApiResponse(201, { post: newPost }, "Post created successfully."));
});

// Controller to fetch a post by postId ----------------------- h
const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params; // Extract postId from URL params
  
    // Fetch the post and populate the user information who uploaded the post
    const post = await Post.findById(postId).populate('uploadByUserId', 'name email');
  
    // If the post is not found, throw a 404 error
    if (!post) {
      throw new ApiError(404, "Post not found.");
    }
  
    // Check if the logged-in user is the owner of the post
    if (post.uploadByUserId._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to edit this post.");
    }
  
    // Return the post data in the response if the user is authorized
    res.status(200).json(new ApiResponse(200, post, "Post fetched successfully."));
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
    // const { content, images } = req.body;
    console.log("images in editpost route", images)

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
    const deletedPost = await Post.findByIdAndDelete(postId)
    return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully."));
});

// Show all posts (public)
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate('uploadByUserId', 'fullName')  // Populate uploader's name
        .sort({ createdAt: -1 });  // Sort by most recent

    return res.status(200).json(new ApiResponse(200, posts, "All posts fetched successfully."));
});

export { addPost, getUserPosts, editPost, deletePost,  getAllPosts, getPostById};

