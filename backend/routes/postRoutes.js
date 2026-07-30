const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authenticate');

// Routes
router.post('/create', authenticate(), postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/user/:userId', postController.getUserPosts);
router.get('/threads', postController.getThreads); // New route for forum threads
router.patch('/:postId', authenticate(), postController.updatePost);
router.delete('/:postId', authenticate(), postController.deletePost);
router.post('/:postId/like', authenticate(), postController.likePost);
router.post('/:postId/comment', authenticate(), postController.addComment);
router.post('/:postId/share', authenticate(), postController.sharePost);
// Note: streamMedia removed as videos are now served directly from Cloudinary

module.exports = router;
