const infoService = require('../services/infoService');

// Get Info
const getInfo = async (req, res) => {
  try {
    const info = await infoService.getInfoByUserId(req.user.id);
    res.json(info);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update Info
const updateInfo = async (req, res) => {
  try {
    const updatedInfo = await infoService.updateInfo(req.user.id, req.body);
    res.json(updatedInfo);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getInfo,
  updateInfo,
};