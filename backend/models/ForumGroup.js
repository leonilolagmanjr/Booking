const mongoose = require('mongoose');

const forumGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const ForumGroup = mongoose.model('ForumGroup', forumGroupSchema);

module.exports = ForumGroup;
