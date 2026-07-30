/**
 * CourtFlow — Notification Service
 * Handles creating, fetching, and managing notifications.
 */

const Notification = require('../models/Notification');
const { NotFoundError } = require('../../../shared/errors');

/**
 * Get user's notifications with pagination.
 */
const getNotifications = async (userId, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { recipient: userId };

  if (query.unreadOnly === 'true') {
    filter.read = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate('club', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
    Notification.unreadCount(userId),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get unread notification count.
 */
const getUnreadCount = async (userId) => {
  const count = await Notification.unreadCount(userId);
  return { count };
};

/**
 * Mark a single notification as read.
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) {
    throw new NotFoundError('Notification');
  }

  return notification;
};

/**
 * Mark all notifications as read.
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.markAllAsRead(userId);
  return { modifiedCount: result.modifiedCount };
};

/**
 * Delete a notification.
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new NotFoundError('Notification');
  }

  return { message: 'Notification deleted' };
};

/**
 * Create a booking notification (used by booking service).
 */
const createBookingNotification = async ({
  recipient,
  clubId,
  bookingId,
  type,
  extraData = {},
}) => {
  return Notification.createBookingNotification({
    recipient,
    club: clubId,
    booking: bookingId,
    type,
    extraData,
  });
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createBookingNotification,
};

