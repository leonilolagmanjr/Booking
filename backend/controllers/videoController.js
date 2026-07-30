const videoService = require('../services/videoService');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Multer setup for video upload with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: 'mern/videos',
      allowed_formats: isVideo ? ['mp4', 'webm', 'ogg', 'avi', 'mov'] : ['jpg', 'png', 'jpeg'],
      resource_type: isVideo ? 'video' : 'image',
      // For videos, Cloudinary can auto-generate thumbnails
      eager: isVideo ? [{ width: 320, height: 180, crop: 'fill', format: 'jpg' }] : undefined,
    };
  },
});

const upload = multer({ storage });

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No video file uploaded' });
    }
    const { title, description } = req.body;

    // Cloudinary returns eager transformations for thumbnails
    const videoUrl = req.file.path;
    const videoPublicId = req.file.filename;
    const thumbnailUrl = req.file.eager ? req.file.eager[0].secure_url : null;
    const thumbnailPublicId = req.file.eager ? req.file.eager[0].public_id : null;

    const videoData = {
      title,
      description,
      uploader: req.user.id,
      videoUrl,
      videoPublicId,
      thumbnailUrl,
      thumbnailPublicId,
    };

    const video = await videoService.createVideo(videoData);
    res.status(201).json(video);
  } catch (err) {
    console.error('Upload Video Error:', err);
    res.status(500).json({ msg: 'Server error during video upload' });
  }
};

const getVideos = async (req, res) => {
  try {
    const search = req.query.search || '';
    const videos = await videoService.getVideos(search);
    res.json(videos);
  } catch (err) {
    console.error('Get Videos Error:', err);
    res.status(500).json({ msg: 'Server error fetching videos' });
  }
};

const getUserVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const videos = await videoService.getUserVideos(userId);
    res.json(videos);
  } catch (err) {
    console.error('Get User Videos Error:', err);
    res.status(500).json({ msg: 'Server error fetching user videos' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const updateData = req.body;
    const updatedVideo = await videoService.updateVideo(videoId, updateData);
    if (!updatedVideo) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json(updatedVideo);
  } catch (err) {
    console.error('Update Video Error:', err);
    res.status(500).json({ msg: 'Server error updating video' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const deletedVideo = await videoService.deleteVideo(videoId);
    if (!deletedVideo) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json({ msg: 'Video deleted successfully' });
  } catch (err) {
    console.error('Delete Video Error:', err);
    res.status(500).json({ msg: 'Server error deleting video' });
  }
};

// New function to stream video with range support
const getVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await videoService.getVideoById(videoId);
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json(video);
  } catch (err) {
    console.error('Get Video Error:', err);
    res.status(500).json({ msg: 'Server error fetching video' });
  }
};

// Note: streamVideo and generateThumbnail functions removed as videos and thumbnails are now served directly from Cloudinary

module.exports = {
  uploadVideo,
  getVideos,
  getUserVideos,
  updateVideo,
  deleteVideo,
  getVideo,
};
