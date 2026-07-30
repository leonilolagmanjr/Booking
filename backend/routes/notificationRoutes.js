const express = require('express');
const authenticate = require('../middleware/authenticate');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authenticate(), notificationController.getNotifications);
router.get('/unread-count', authenticate(), notificationController.getUnreadCount);
router.patch('/:notificationId/read', authenticate(), notificationController.markAsRead);
router.patch('/read-all', authenticate(), notificationController.markAllAsRead);

module.exports = router;