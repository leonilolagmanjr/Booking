/**
 * CourtFlow — Bookings Routes
 */

const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authenticate = require('../../../middleware/authenticate');
const { authorize } = require('../../../middleware/authorize');
const { validate } = require('../../../middleware/validate');
const { ROLES } = require('../../../shared/constants');
const {
  createBookingSchema,
  cancelBookingSchema,
  rescheduleBookingSchema,
  bookingIdParamSchema,
  listBookingsQuerySchema,
  checkConflictSchema,
} = require('../validators/bookingValidators');

// ─── Public Routes ─────────────────────────────────────

// Check time conflict (public)
router.get(
  '/check-conflict',
  validate(checkConflictSchema),
  bookingController.checkConflict
);

// ─── Protected Routes ──────────────────────────────────

// All booking routes require authentication
router.use(authenticate);

// Create booking (player only)
router.post(
  '/',
  authorize(ROLES.PLAYER, ROLES.CLUB_OWNER, ROLES.STAFF, ROLES.SUPER_ADMIN),
  validate(createBookingSchema),
  bookingController.createBooking
);

// List bookings (with filters)
router.get(
  '/',
  validate(listBookingsQuerySchema),
  bookingController.listBookings
);

// Get upcoming bookings (player)
router.get(
  '/upcoming',
  bookingController.getUpcomingBookings
);

// Get booking history (player)
router.get(
  '/history',
  bookingController.getBookingHistory
);

// Get booking by ID
router.get(
  '/:id',
  validate(bookingIdParamSchema),
  bookingController.getBooking
);

// Cancel booking
router.patch(
  '/:id/cancel',
  validate(cancelBookingSchema),
  bookingController.cancelBooking
);

// Reschedule booking
router.patch(
  '/:id/reschedule',
  validate(rescheduleBookingSchema),
  bookingController.rescheduleBooking
);

module.exports = router;

