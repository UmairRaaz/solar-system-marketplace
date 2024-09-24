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
    post.comments.push({
        userId: commentByUserId,
        content,
        likes: [],
        dislikes: []
    })
    await post.save();

    return res.status(201).json(new ApiResponse(201, { comment: newComment }, "Comment added successfully."));
});


const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    // Check if the user has already liked the post
    const userIndexInLikes = post.likes.indexOf(userId);

    if (userIndexInLikes !== -1) {
        // If the user has already liked the post, remove their like
        post.likes.splice(userIndexInLikes, 1);
        await post.save();
        return res.status(200).json(new ApiResponse(200, null, "Like removed successfully."));
    } else {
        // If the user has not liked the post, add their like
        post.likes.push(userId);
        // Remove dislike if it exists
        post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
        await post.save();
        return res.status(200).json(new ApiResponse(200, null, "Post liked successfully."));
    }
});


// Dislike a post
const dislikePost = asyncHandler(async (req, res) => {
    // const { postId } = req.params;
    // const userId = req.user._id;

    // const post = await Post.findById(postId);
    // if (!post) {
    //     throw new ApiError(404, "Post not found.");
    // }

    // // Check if the user already disliked the post
    // if (post.dislikes.includes(userId)) {
    //     throw new ApiError(400, "You already disliked this post.");
    // }

    // // Add the dislike and remove like if it exists
    // post.dislikes.push(userId);
    // post.likes = post.likes.filter(id => id.toString() !== userId.toString());

    // await post.save();
    
    // return res.status(200).json(new ApiResponse(200, null, "Post disliked successfully."));

    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    // Check if the user has already liked the post
    const userIndexInDislikes = post.dislikes.indexOf(userId);

    if (userIndexInDislikes !== -1) {
        // If the user has already liked the post, remove their like
        post.dislikes.splice(userIndexInDislikes, 1);
        await post.save();
        return res.status(200).json(new ApiResponse(200, null, "Dislike removed successfully."));
    } else {
        // If the user has not liked the post, add their like
        post.dislikes.push(userId);
        // Remove like if it exists
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        await post.save();
        return res.status(200).json(new ApiResponse(200, null, "Post Disliked successfully."));
    }
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
