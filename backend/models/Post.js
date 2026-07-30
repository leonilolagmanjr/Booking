const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  media: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }], // Array of objects with Cloudinary URL and public_id
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the post
  comments: [commentSchema], // Sub-document array for comments
  shareCount: { type: Number, default: 0 }, // Number of shares
  sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Reference to original post if shared
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['post', 'thread'], default: 'post' }, // Type of post
  category: { type: String }, // Category for forum threads
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumGroup' }, // Reference to forum group
  pinned: { type: Boolean, default: false } // Pinned status
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
