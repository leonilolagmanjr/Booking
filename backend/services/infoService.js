const Info = require('../models/Info');

// Get Info by User ID
const getInfoByUserId = async (userId) => {
  try {
    const info = await Info.findOne({ userId });
    if (!info) throw new Error('Info not found');
    return info;
  } catch (err) {
    throw new Error(err.message || 'Error fetching info');
  }
};

// Update Info
const updateInfo = async (userId, updatedFields) => {
  try {
    const info = await Info.findOneAndUpdate(
      { userId },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    if (!info) throw new Error('Info not found');
    return info;
  } catch (err) {
    throw new Error(err.message || 'Error updating info');
  }
};

module.exports = {
  getInfoByUserId,
  updateInfo,
};