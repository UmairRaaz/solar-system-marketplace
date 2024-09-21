import { Post } from '../models/post.models.js';
import { Comment } from '../models/comment.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Add a comment to a post
const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, images } = req.body;

    if (!content) {
        return res.status(400).json({ message: "Comment content is required." });
    }

    const commentByUserId = req.user._id;

    // Ensure post exists
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found." });
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

    res.status(201).json({
        message: "Comment added successfully.",
        comment: newComment
    });
});

// Like a post
const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found." });
    }

    // Check if the user already liked the post
    if (post.likes.includes(userId)) {
        return res.status(400).json({ message: "You already liked this post." });
    }

    // Add the like and remove dislike if it exists
    post.likes.push(userId);
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());

    await post.save();
    res.status(200).json({ message: "Post liked successfully." });
});

// Dislike a post
const dislikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found." });
    }

    // Check if the user already disliked the post
    if (post.dislikes.includes(userId)) {
        return res.status(400).json({ message: "You already disliked this post." });
    }

    // Add the dislike and remove like if it exists
    post.dislikes.push(userId);
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());

    await post.save();
    res.status(200).json({ message: "Post disliked successfully." });
});

// Like a comment
const likeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
    }

    // Check if the user already liked the comment
    if (comment.likes.includes(userId)) {
        return res.status(400).json({ message: "You already liked this comment." });
    }

    // Add the like and remove dislike if it exists
    comment.likes.push(userId);
    comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());

    await comment.save();
    res.status(200).json({ message: "Comment liked successfully." });
});

// Dislike a comment
const dislikeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
    }

    // Check if the user already disliked the comment
    if (comment.dislikes.includes(userId)) {
        return res.status(400).json({ message: "You already disliked this comment." });
    }

    // Add the dislike and remove like if it exists
    comment.dislikes.push(userId);
    comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());

    await comment.save();
    res.status(200).json({ message: "Comment disliked successfully." });
});

export { addComment, likePost, dislikePost, likeComment, dislikeComment };
