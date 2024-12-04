const express = require('express');
const { getAllPost, deletePost, updatePost, createPost, getUserPosts, likePost, commentPost } = require('../controllers/postController');
const checkToken = require('../middleware/checkToken');
const router = express.Router();// Ensure this path is correct

router.post('/create',checkToken,createPost)
router.get('/getAllpost',getAllPost)
router.delete('/delete/:_id',deletePost)
router.put('/update/:_id',updatePost)
router.get('/userPost/:userId',getUserPosts)
router.get('/like/:postId',checkToken,likePost)
router.post('/comment/:postId',checkToken,commentPost)


module.exports = router;