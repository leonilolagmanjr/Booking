const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: { type: String, required: true }, // Cloudinary URL for video
  thumbnailUrl: { type: String }, // Cloudinary URL for thumbnail
  videoPublicId: { type: String, required: true }, // Cloudinary public_id for video
  thumbnailPublicId: { type: String }, // Cloudinary public_id for thumbnail
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
