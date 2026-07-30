const userService = require('../services/userService'); 

// Route to Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.userId); // Fetch user profile by userId
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Route to Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Route to Delete User Profile
const deleteUserProfile = async (req, res) => {
  try {
    const user = await userService.deleteUserProfile(req.params.userId);
    res.json({msg: 'User Deleted'});
  } catch (err) {
    res.status(500).json({ msg: err.message});
  }
};

// Controller function to change user role
const changeUserRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const updatedUser = await userService.changeUserRole(userId, role);
    res.json({ msg: 'User role updated successfully', updatedUser });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


// Delete Own Profile
const deleteOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await userService.deleteUserProfile(userId);
    res.json({ msg: 'User profile deleted successfully', user: deletedUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add Connection
const addConnection = async (req, res) => {
  const { email } = req.body;
  try {
    const updatedConnections = await userService.addConnection(req.user.id, email);
    res.json(updatedConnections);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Send Friend Request
const sendFriendRequest = async (req, res) => {
  const { userIdToAdd } = req.body;
  try {
    const result = await userService.sendFriendRequest(req.user.id, userIdToAdd);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get Friend Requests
const getFriendRequests = async (req, res) => {
  try {
    const requests = await userService.getFriendRequests(req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Accept Friend Request
const acceptFriendRequest = async (req, res) => {
  const { requesterId } = req.body;
  try {
    const result = await userService.acceptFriendRequest(req.user.id, requesterId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Deny Friend Request
const denyFriendRequest = async (req, res) => {
  const { requesterId } = req.body;
  try {
    const result = await userService.denyFriendRequest(req.user.id, requesterId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Cancel Sent Friend Request
const cancelFriendRequest = async (req, res) => {
  const { targetUserId } = req.body;
  try {
    const result = await userService.cancelFriendRequest(req.user.id, targetUserId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// New controller function to check friend relationship status
const checkFriendRelationshipStatus = async (req, res) => {
  const { userId1, userId2 } = req.query;
  try {
    const status = await userService.checkRelationshipStatus(userId1, userId2);
    res.json({ status });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Remove Friend
const removeFriend = async (req, res) => {
  const { friendId } = req.body;
  try {
    const result = await userService.removeFriend(req.user.id, friendId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Upload Avatar
const uploadAvatar = async (req, res) => {
  try {
    const cloudinary = require('../config/cloudinary');
    const multer = require('multer');
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'avatars',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 200, height: 200, crop: 'fill' }], // Crop to square
      },
    });

    const upload = multer({ storage }).single('avatar');

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: 'Upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const imageUrl = req.file.path;
      const updatedUser = await userService.uploadAvatar(req.user.id, imageUrl);
      res.json({ msg: 'Avatar uploaded successfully', profileImage: updatedUser.profileImage });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await userService.getLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  deleteOwnProfile,
  changeUserRole,
  addConnection,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
  cancelFriendRequest,
  checkFriendRelationshipStatus,
  removeFriend,
  uploadAvatar,
  getLeaderboard
};
