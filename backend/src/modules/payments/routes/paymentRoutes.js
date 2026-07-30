/**
 * CourtFlow — Payment Routes
 */

const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const authenticate = require('../../../middleware/authenticate');
const { authorize } = require('../../../middleware/authorize');
const { ROLES } = require('../../../shared/constants');

// All payment routes require authentication
router.use(authenticate);

// Get payment by ID
router.get('/:id', paymentController.getPayment);

// Process payment for a booking
router.post(
  '/:bookingId/pay',
  authorize(ROLES.PLAYER, ROLES.CLUB_OWNER, ROLES.SUPER_ADMIN),
  paymentController.processPayment
);

// Refund a payment (admin only)
router.post(
  '/:id/refund',
  authorize(ROLES.SUPER_ADMIN),
  paymentController.refundPayment
);

module.exports = router;

