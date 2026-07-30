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

// List payments (admin only)
router.get(
  '/',
  authorize(ROLES.SUPER_ADMIN),
  paymentController.listPayments
);

// Get payment by booking ID
router.get('/:bookingId', paymentController.getPaymentByBooking);

// Record payment for a booking
router.post(
  '/:bookingId/pay',
  authorize(ROLES.PLAYER, ROLES.CLUB_OWNER, ROLES.SUPER_ADMIN),
  paymentController.recordPayment
);

// Refund a payment (admin only)
router.post(
  '/:bookingId/refund',
  authorize(ROLES.SUPER_ADMIN),
  paymentController.refundPayment
);

module.exports = router;

