/**
 * CourtFlow — Users Service
 * Profile management and user-related operations.
 */

const User = require('../../auth/models/User');
const { NotFoundError } = require('../../../shared/errors');

/**
 * Get current user's profile.
 */
const getProfile = async (userId) => {
  const user = await User.findActiveById(userId)
    .populate('ownedClubs', 'name status')
    .populate('staffClubs', 'name status')
    .populate('savedClubs', 'name');

  if (!user) {
    throw new NotFoundError('User');
  }

  return user.toPublicProfile();
};

/**
 * Update current user's profile.
 */
const updateProfile = async (userId, updateData) => {
  const user = await User.findActiveById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Only allow updating specific fields
  const allowedFields = ['name', 'phone', 'avatar', 'preferences'];
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  }

  await user.save();
  return user.toPublicProfile();
};

/**
 * Get user's saved clubs.
 */
const getSavedClubs = async (userId) => {
  const user = await User.findActiveById(userId)
    .populate('savedClubs', 'name address logo status');

  if (!user) {
    throw new NotFoundError('User');
  }

  return user.savedClubs;
};

/**
 * Save a club to user's favorites.
 */
const saveClub = async (userId, clubId) => {
  const user = await User.findActiveById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  if (!user.savedClubs.includes(clubId)) {
    user.savedClubs.push(clubId);
    await user.save();
  }

  return user.toPublicProfile();
};

/**
 * Remove a club from user's saved list.
 */
const unsaveClub = async (userId, clubId) => {
  const user = await User.findActiveById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  user.savedClubs = user.savedClubs.filter(
    (id) => id.toString() !== clubId
  );
  await user.save();

  return user.toPublicProfile();
};

/**
 * Update last active timestamp.
 */
const updateLastActive = async (userId) => {
  await User.findByIdAndUpdate(userId, { lastActiveAt: new Date() });
};

module.exports = {
  getProfile,
  updateProfile,
  getSavedClubs,
  saveClub,
  unsaveClub,
  updateLastActive,
};

