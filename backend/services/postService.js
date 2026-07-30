const Post = require('../models/Post');

const { awardXP } = require('../utils/gameEngine');
const User = require('../models/User');

// Create Post
const createPost = async (content, media, createdBy, type = 'post', category, groupId, pinned = false) => {
  try {
    const post = new Post({
      content,
      media, // Now an array of {url, public_id} objects
      createdBy,
      type,
      category,
      groupId,
      pinned,
    });
    await post.save();

    // Award XP for creating a post
    await awardXP(createdBy, 'post_created');
    const user = await User.findById(createdBy);
    user.communityStats.posts += 1;
    await user.save();

    return post;
  } catch (err) {
    throw new Error(err.message || 'Error creating post');
  }
};

// Get All Posts with optional filters
const getAllPosts = async (filters = {}) => {
  try {
    const query = {};
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.groupId) query.groupId = filters.groupId;
    const posts = await Post.find(query).populate('createdBy', 'name').populate('comments.user', 'name').sort({ pinned: -1, createdAt: -1 });
    return posts;
  } catch (err) {
    throw new Error('Error fetching posts');
  }
};

// Get Posts by User
const getUserPosts = async (userId) => {
  try {
    return await Post.find({ createdBy: userId }).populate('createdBy', 'name').populate('comments.user', 'name').sort({ createdAt: -1 });
  } catch (err) {
    throw new Error('Error fetching user posts');
  }
};

// Get Post by ID
const getPostById = async (postId) => {
  try {
    return await Post.findById(postId).populate('createdBy', 'name').populate('comments.user', 'name');
  } catch (err) {
    throw new Error('Error fetching post');
  }
};

// Update Post
const updatePost = async (postId, content, media, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (String(post.createdBy) !== String(userId)) throw new Error('Not authorized to update this post');

    // If new media is provided, delete old media from Cloudinary and update
    if (media && media.length > 0) {
      if (post.media && post.media.length > 0) {
        const cloudinary = require('../config/cloudinary');
        const publicIds = post.media.map(mediaItem => mediaItem.public_id);
        await cloudinary.api.delete_resources(publicIds);
      }
      post.media = media;
    }

    post.content = content || post.content;
    await post.save();
    return post;
  } catch (err) {
    throw new Error(err.message || 'Error updating post');
  }
};

// Delete Post
const deletePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (String(post.createdBy) !== String(userId)) throw new Error('Not authorized to delete this post');

    // Delete associated media from Cloudinary
    if (post.media && post.media.length > 0) {
      const cloudinary = require('../config/cloudinary');
      const publicIds = post.media.map(media => media.public_id);
      await cloudinary.api.delete_resources(publicIds);
    }

    await Post.findByIdAndDelete(postId);
    return post;
  } catch (err) {
    throw new Error('Error deleting post');
  }
};

// Like/Unlike Post
const likePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }
    await post.save();
    return post;
  } catch (err) {
    throw new Error('Error liking post');
  }
};

// Add Comment
const addComment = async (postId, userId, text) => {
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    post.comments.push({ user: userId, text });
    await post.save();
    // Populate the user in the newly added comment
    await post.populate('comments.user', 'name');

    // Award XP for adding a comment
    await awardXP(userId, 'comment_created');
    const user = await User.findById(userId);
    user.communityStats.comments += 1;
    await user.save();

    return post;
  } catch (err) {
    throw new Error('Error adding comment');
  }
};

// Share Post
const sharePost = async (postId, userId) => {
  try {
    const originalPost = await Post.findById(postId);
    if (!originalPost) throw new Error('Post not found');

    // Create a new post that references the original
    const sharedPost = new Post({
      content: originalPost.content,
      media: originalPost.media,
      createdBy: userId,
      sharedFrom: postId,
      type: 'post'
    });
    await sharedPost.save();

    // Increment share count on original post
    originalPost.shareCount = (originalPost.shareCount || 0) + 1;
    await originalPost.save();

    // Award XP for sharing a post
    await awardXP(userId, 'post_shared');
    const user = await User.findById(userId);
    user.communityStats.posts += 1; // Count shared posts as posts
    await user.save();

    return sharedPost;
  } catch (err) {
    throw new Error(err.message || 'Error sharing post');
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  sharePost,
};
