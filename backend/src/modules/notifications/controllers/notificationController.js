/**
 * CourtFlow — Notifications Controller
 */

const notificationService = require('../services/notificationService');
const { success, paginated } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * GET /api/notifications
 * Get all notifications for current user.
 */
const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getNotifications(req.user.id, req.query);
    return paginated(res, result.notifications, result.pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/notifications/unread-count
 * Get unread notification count.
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const result = await notificationService.getUnreadCount(req.user.id);
    return success(res, result, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a notification as read.
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return success(res, notification, HTTP_STATUS.OK, 'Marked as read');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    return success(res, result, HTTP_STATUS.OK, 'All marked as read');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a notification.
 */
const deleteNotification = async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.params.id, req.user.id);
    return success(res, result, HTTP_STATUS.OK, 'Notification deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

