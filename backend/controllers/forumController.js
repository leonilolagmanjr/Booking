const forumService = require('../services/forumService');

// Create Forum Group
const createForumGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.id;
    const forumGroup = await forumService.createForumGroup(name, description, createdBy);
    res.status(201).json(forumGroup);
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error creating forum group' });
  }
};

// Get All Forum Groups
const getAllForumGroups = async (req, res) => {
  try {
    const forumGroups = await forumService.getAllForumGroups();
    res.json(forumGroups);
  } catch (error) {
    res.status(500).json({ msg: 'Server error fetching forum groups' });
  }
};

// Get Forum Group by ID
const getForumGroupById = async (req, res) => {
  try {
    const id = req.params.id;
    const forumGroup = await forumService.getForumGroupById(id);
    if (!forumGroup) return res.status(404).json({ msg: 'Forum group not found' });
    res.json(forumGroup);
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error fetching forum group' });
  }
};

// Update Forum Group
const updateForumGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const userId = req.user.id;
    const updatedForumGroup = await forumService.updateForumGroup(id, name, description, userId);
    res.json(updatedForumGroup);
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error updating forum group' });
  }
};

// Delete Forum Group
const deleteForumGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    await forumService.deleteForumGroup(id, userId);
    res.json({ msg: 'Forum group deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Server error deleting forum group' });
  }
};

module.exports = {
  createForumGroup,
  getAllForumGroups,
  getForumGroupById,
  updateForumGroup,
  deleteForumGroup,
};
