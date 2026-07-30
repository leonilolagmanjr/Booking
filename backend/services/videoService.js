const Video = require('../models/Video');

const createVideo = async (videoData) => {
  const video = new Video(videoData);
  return await video.save();
};

const getVideos = async (searchQuery) => {
  const query = {};
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: 'i' };
  }
  return await Video.find(query).populate('uploader', 'name').sort({ createdAt: -1 });
};

const getUserVideos = async (userId) => {
  return await Video.find({ uploader: userId }).sort({ createdAt: -1 });
};

const updateVideo = async (videoId, updateData) => {
  return await Video.findByIdAndUpdate(videoId, updateData, { new: true });
};

const deleteVideo = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) return null;

  // Delete associated files from Cloudinary
  const cloudinary = require('../config/cloudinary');
  const publicIds = [];
  if (video.videoPublicId) publicIds.push(video.videoPublicId);
  if (video.thumbnailPublicId) publicIds.push(video.thumbnailPublicId);
  if (publicIds.length > 0) {
    await cloudinary.api.delete_resources(publicIds);
  }

  return await Video.findByIdAndDelete(videoId);
};

const getVideoById = async (videoId) => {
  return await Video.findById(videoId).populate('uploader', 'name');
};

module.exports = {
  createVideo,
  getVideos,
  getUserVideos,
  updateVideo,
  deleteVideo,
  getVideoById,
};
