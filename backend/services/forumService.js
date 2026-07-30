const ForumGroup = require('../models/ForumGroup');

// Create Forum Group
const createForumGroup = async (name, description, createdBy) => {
  try {
    const forumGroup = new ForumGroup({
      name,
      description,
      createdBy,
    });
    await forumGroup.save();
    return forumGroup;
  } catch (err) {
    throw new Error(err.message || 'Error creating forum group');
  }
};

// Get All Forum Groups
const getAllForumGroups = async () => {
  try {
    const forumGroups = await ForumGroup.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    return forumGroups;
  } catch (err) {
    throw new Error('Error fetching forum groups');
  }
};

// Get Forum Group by ID
const getForumGroupById = async (id) => {
  try {
    return await ForumGroup.findById(id).populate('createdBy', 'name');
  } catch (err) {
    throw new Error('Error fetching forum group');
  }
};

// Update Forum Group
const updateForumGroup = async (id, name, description, userId) => {
  try {
    const forumGroup = await ForumGroup.findById(id);
    if (!forumGroup) throw new Error('Forum group not found');
    if (String(forumGroup.createdBy) !== String(userId)) throw new Error('Not authorized to update this forum group');
    forumGroup.name = name || forumGroup.name;
    forumGroup.description = description || forumGroup.description;
    await forumGroup.save();
    return forumGroup;
  } catch (err) {
    throw new Error(err.message || 'Error updating forum group');
  }
};

// Delete Forum Group
const deleteForumGroup = async (id, userId) => {
  try {
    const forumGroup = await ForumGroup.findById(id);
    if (!forumGroup) throw new Error('Forum group not found');
    if (String(forumGroup.createdBy) !== String(userId)) throw new Error('Not authorized to delete this forum group');
    await ForumGroup.findByIdAndDelete(id);
    return forumGroup;
  } catch (err) {
    throw new Error('Error deleting forum group');
  }
};

module.exports = {
  createForumGroup,
  getAllForumGroups,
  getForumGroupById,
  updateForumGroup,
  deleteForumGroup,
};
