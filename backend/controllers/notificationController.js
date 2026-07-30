const notificationService = require('../services/notificationService');

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.notificationId, req.user.id);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};