/**
 * CourtFlow — Notifications Routes
 */

const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const authenticate = require('../../../middleware/authenticate');

// All notification routes require authentication
router.use(authenticate);

// List notifications (paginated)
router.get('/', notificationController.getNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark all as read
router.patch('/read-all', notificationController.markAllAsRead);

// Mark single as read
router.patch('/:id/read', notificationController.markAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

