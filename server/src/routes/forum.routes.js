import express from 'express';
import {  addPost, getUserPosts, editPost, deletePost, getAllPosts, getPostById } from '../controllers/forum.controller.js';
import { verifyJWT } from "../middlewares/userauth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

// Route to add a post (requires login)
router.post('/add', upload.array('images'), verifyJWT, addPost);

// Route to get all posts by the logged-in user (requires login)
router.get('/my-posts', verifyJWT, getUserPosts);

// Route to edit a post (requires login, and only owner can edit)
router.put('/edit/:postId', verifyJWT, upload.array('images'), editPost);

// ------------------------ h
router.get('/get-post/:postId', verifyJWT, getPostById);

// Route to delete a post (requires login, and only owner can delete)
router.delete('/delete/:postId', verifyJWT, deletePost);

// Route to get all posts (public)
router.get('/all', getAllPosts);

export default router;
