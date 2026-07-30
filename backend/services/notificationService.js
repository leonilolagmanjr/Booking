const Notification = require('../models/Notification');

const STATUS_MESSAGES = {
  reviewing: 'Your application is being reviewed.',
  shortlisted: 'You have been shortlisted!',
  interview: 'You have moved to the interview stage.',
  offered: 'Congratulations! You received an offer.',
  hired: 'Congratulations! You have been hired.',
  rejected: 'Your application status has been updated.'
};

const createStatusNotification = async (application, oldStatus, newStatus) => {
  try {
    // Don't create notification if status hasn't changed
    if (oldStatus === newStatus) {
      return null;
    }

    const message = STATUS_MESSAGES[newStatus] || `Your application status changed to ${newStatus}.`;

    const notification = await Notification.create({
      recipient: application.applicant,
      sender: null,
      type: 'application_status',
      title: `Application ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      message: message,
      relatedApplication: application._id,
      relatedJob: application.job
    });

    return notification;
  } catch (err) {
    console.error('Error creating status notification:', err);
    return null;
  }
};

const getNotificationsByUser = async (userId, limit = 50) => {
  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate('relatedJob', 'title')
      .populate('relatedApplication', 'status')
      .sort({ createdAt: -1 })
      .limit(limit);
    return notifications;
  } catch (err) {
    console.error('Error fetching notifications:', err);
    throw new Error('Error fetching notifications');
  }
};

const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
    return notification;
  } catch (err) {
    console.error('Error marking notification as read:', err);
    throw new Error('Error updating notification');
  }
};

const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
    return true;
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    throw new Error('Error updating notifications');
  }
};

const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ recipient: userId, read: false });
    return count;
  } catch (err) {
    console.error('Error getting unread count:', err);
    return 0;
  }
};

module.exports = {
  createStatusNotification,
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};