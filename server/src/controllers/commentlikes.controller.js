import { Post } from '../models/post.models.js';
import { Comment } from '../models/comment.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
// Add a comment to a post
const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, images } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment content is required.");
    }

    const commentByUserId = req.user._id;

    // Ensure post exists
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    // Create new comment
    const newComment = new Comment({
        commentToPostId: postId,
        commentByUserId,
        content,
        images: images || []
    });

    // Save comment
    await newComment.save();

    return res.status(201).json(new ApiResponse(201, { comment: newComment }, "Comment added successfully."));
});

// Like a post
const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    // Check if the user already liked the post
    if (post.likes.includes(userId)) {
        throw new ApiError(400, "You already liked this post.");
    }

    // Add the like and remove dislike if it exists
    post.likes.push(userId);
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());

    await post.save();
    
    return res.status(200).json(new ApiResponse(200, null, "Post liked successfully."));
});

// Dislike a post
const dislikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    // Check if the user already disliked the post
    if (post.dislikes.includes(userId)) {
        throw new ApiError(400, "You already disliked this post.");
    }

    // Add the dislike and remove like if it exists
    post.dislikes.push(userId);
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());

    await post.save();
    
    return res.status(200).json(new ApiResponse(200, null, "Post disliked successfully."));
});

// Like a comment
const likeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }

    // Check if the user already liked the comment
    if (comment.likes.includes(userId)) {
        throw new ApiError(400, "You already liked this comment.");
    }

    // Add the like and remove dislike if it exists
    comment.likes.push(userId);
    comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());

    await comment.save();
    
    return res.status(200).json(new ApiResponse(200, null, "Comment liked successfully."));
});

// Dislike a comment
const dislikeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }

    // Check if the user already disliked the comment
    if (comment.dislikes.includes(userId)) {
        throw new ApiError(400, "You already disliked this comment.");
    }

    // Add the dislike and remove like if it exists
    comment.dislikes.push(userId);
    comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());

    await comment.save();
    
    return res.status(200).json(new ApiResponse(200, null, "Comment disliked successfully."));
});

export { addComment, likePost, dislikePost, likeComment, dislikeComment };
