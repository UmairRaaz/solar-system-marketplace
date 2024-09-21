import express from 'express';
import { addComment, likePost, dislikePost, likeComment, dislikeComment } from "../controllers/commentlikes.controller.js"
import { verifyJWT } from "../middlewares/userauth.middleware.js";

const router = express.Router();

// Add comment to a post (requires login)
router.post('/:postId/comment', verifyJWT, addComment);

// Like a post (requires login)
router.post('/:postId/like', verifyJWT, likePost);

// Dislike a post (requires login)
router.post('/:postId/dislike', verifyJWT, dislikePost);

// Like a comment (requires login)
router.post('/comment/:commentId/like', verifyJWT, likeComment);

// Dislike a comment (requires login)
router.post('/comment/:commentId/dislike', verifyJWT, dislikeComment);

export default router;
