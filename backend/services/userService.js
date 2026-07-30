const User = require('../models/User'); 

// Function to Get User Profile
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select('-password')
      .populate('connections', 'name email')
      .populate('friendRequests', 'name email'); // Populate friendRequests with name and email
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    throw new Error('Server error');
  }
};

// Function to check relationship status between two users
const checkRelationshipStatus = async (userId1, userId2) => {
  const user1 = await User.findById(userId1);
  const user2 = await User.findById(userId2);

  if (!user1 || !user2) {
    throw new Error('User not found');
  }

  // Check if they are connected (friends)
  if (user1.connections.includes(userId2)) {
    return 'friends';
  }

  // Check if user1 sent a friend request to user2
  if (user2.friendRequests.includes(userId1)) {
    return 'requestSent';
  }

  // Check if user1 has a pending friend request from user2
  if (user1.friendRequests.includes(userId2)) {
    return 'requestReceived';
  }

  return 'none';
};

const { awardXP } = require('../utils/gameEngine');

// Helper function to check if profile is complete
function allFieldsFilled(user) {
  return user.email && user.phone && user.skills.length > 0 && user.location;
}

// Function to Update User Profile
const updateUserProfile = async (userId, updateData) => {
  try {
    const { name, email, phone, location, remoteAvailability, skills, languages, certifications, profileImage } = updateData;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        ...(remoteAvailability !== undefined && { remoteAvailability }),
        ...(skills && { skills }),
        ...(languages && { languages }),
        ...(certifications && { certifications }),
        ...(profileImage !== undefined && { profileImage })
      },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error('User not found');
    }

    // Check if profile is now complete and award XP if not already done
    if (!updatedUser.profileCompleted && allFieldsFilled(updatedUser)) {
      updatedUser.profileCompleted = true;
      await updatedUser.save();
      await awardXP(userId, 'profile_completed');
    }

    return updatedUser;
  } catch (err) {
    throw new Error('Server error');
  }
};

// Function to Upload Avatar
const uploadAvatar = async (userId, imageUrl) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (err) {
    throw new Error('Error uploading avatar');
  }
};

// Function to Change User Role
const changeUserRole = async (userId, role) => {
  try {
    // Check if the role is valid
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Invalid role');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (err) {
    throw new Error(`Error changing user role: ${err.message}`);
  }
};

// Function to Delete User
const deleteUserProfile = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    throw new Error ('Error Deleting User');
  }
};  

// Function to Add Connection (Friend)
const addConnection = async (userId, email) => {
  const userToAdd = await User.findOne({ email });
  if (!userToAdd) throw new Error('User not found');
  const user = await User.findById(userId);

  // Avoid duplicate connections
  if (user.connections.includes(userToAdd._id)) {
    throw new Error('Already connected');
  }

  user.connections.push(userToAdd._id);
  await user.save();

  // Create chat between users if not exists
  const Chat = require('../models/Chat');
  let chat = await Chat.findOne({ participants: { $all: [userId, userToAdd._id] } });
  if (!chat) {
    chat = await Chat.create({ participants: [userId, userToAdd._id] });
  }

  return user.connections;
};

// Send Friend Request
const sendFriendRequest = async (userId, userIdToAdd) => {
  const userToAdd = await User.findById(userIdToAdd);
  if (!userToAdd) throw new Error('User to add not found');

  // Check if already connected
  if (userToAdd.connections.includes(userId)) {
    throw new Error('Already connected');
  }

  // Check if request already sent
  if (userToAdd.friendRequests.includes(userId)) {
    throw new Error('Friend request already sent');
  }

  userToAdd.friendRequests.push(userId);
  await userToAdd.save();
  return { message: 'Friend request sent' };
};

// Get Friend Requests
const getFriendRequests = async (userId) => {
  const user = await User.findById(userId).populate('friendRequests', 'name email');
  if (!user) throw new Error('User not found');
  return user.friendRequests;
};

// Accept Friend Request
const acceptFriendRequest = async (userId, requesterId) => {
  const user = await User.findById(userId);
  const requester = await User.findById(requesterId);
  if (!user || !requester) throw new Error('User not found');

  // Remove from friendRequests
  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== requesterId.toString()
  );

  // Add to connections if not already connected
  if (!user.connections.includes(requesterId)) {
    user.connections.push(requesterId);
  }
  if (!requester.connections.includes(userId)) {
    requester.connections.push(userId);
  }

  await user.save();
  await requester.save();

  return { message: 'Friend request accepted' };
};

// Deny Friend Request
const denyFriendRequest = async (userId, requesterId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Remove from friendRequests
  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== requesterId.toString()
  );

  await user.save();

  return { message: 'Friend request denied' };
};

// Cancel Sent Friend Request
const cancelFriendRequest = async (userId, targetUserId) => {
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new Error('User not found');

  // Remove userId from targetUser's friendRequests
  targetUser.friendRequests = targetUser.friendRequests.filter(
    (id) => id.toString() !== userId.toString()
  );

  await targetUser.save();

  return { message: 'Friend request canceled' };
};

// Remove Friend (Unfriend)
const removeFriend = async (userId, friendId) => {
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (!user || !friend) throw new Error('User not found');

  // Remove friendId from user's connections
  user.connections = user.connections.filter(
    (id) => id.toString() !== friendId.toString()
  );

  // Remove userId from friend's connections
  friend.connections = friend.connections.filter(
    (id) => id.toString() !== userId.toString()
  );

  await user.save();
  await friend.save();

  return { message: 'Friend removed' };
};

// Function to Get Leaderboard (Top users by XP)
const getLeaderboard = async () => {
  try {
    const users = await User.find({})
      .select('name xp level profileImage')
      .sort({ xp: -1 })
      .limit(10);
    return users;
  } catch (err) {
    throw new Error('Error fetching leaderboard');
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteUserProfile,
  changeUserRole,
  addConnection,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
  cancelFriendRequest,
  checkRelationshipStatus,
  removeFriend,
  getLeaderboard
};
