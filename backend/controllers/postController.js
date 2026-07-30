const postService = require('../services/postService');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Multer setup for multiple file uploads with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern/posts',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'webm', 'ogg'],
    resource_type: 'auto', // Allow both images and videos
  },
});
const upload = multer({ storage }).array('media', 10); // max 10 files

// Create Post with media upload
const createPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'Error uploading files' });
    }
    try {
      const media = req.files ? req.files.map(file => ({ url: file.path, public_id: file.filename })) : [];
      const { content, type, category, groupId, pinned } = req.body;
      const createdBy = req.user.id;
      const post = await postService.createPost(content, media, createdBy, type, category, groupId, pinned);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ msg: 'Server error creating post' });
    }
  });
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.groupId) filters.groupId = req.query.groupId;
    const posts = await postService.getAllPosts(filters);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error fetching posts' });
  }
};

// Get posts by user
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await postService.getUserPosts(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error fetching user posts' });
  }
};

// Get threads (forum posts)
const getThreads = async (req, res) => {
  try {
    const filters = { type: 'thread' };
    if (req.query.category) filters.category = req.query.category;
    if (req.query.groupId) filters.groupId = req.query.groupId;
    const posts = await postService.getAllPosts(filters);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error fetching threads' });
  }
};

// Update post
const updatePost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'Error uploading files' });
    }
    try {
      const postId = req.params.postId;
      const { content } = req.body;
      const media = req.files ? req.files.map(file => ({ url: file.path, public_id: file.filename })) : [];
      const userId = req.user.id;
      const updatedPost = await postService.updatePost(postId, content, media, userId);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ msg: error.message || 'Server error updating post' });
    }
  });
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    await postService.deletePost(postId, userId);
    res.json({ msg: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error deleting post' });
  }
};

// Like/unlike post
const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const post = await postService.likePost(postId, userId);
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: 'Server error liking post' });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { text } = req.body;
    const post = await postService.addComment(postId, userId, text);
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: 'Server error adding comment' });
  }
};

// Share post (create shared post)
const sharePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const sharedPost = await postService.sharePost(postId, userId);
    res.json(sharedPost);
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error sharing post' });
  }
};

// Note: streamMedia function removed as videos are now served directly from Cloudinary

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getThreads,
  updatePost,
  deletePost,
  likePost,
  addComment,
  sharePost,
  upload, // export multer upload middleware if needed
};
