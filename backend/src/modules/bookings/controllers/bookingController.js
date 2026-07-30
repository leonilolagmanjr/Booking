/**
 * CourtFlow — Bookings Controller
 */

const bookingService = require('../services/bookingService');
const { success, paginated } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * POST /api/bookings
 * Create a new booking (player).
 */
const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    return success(res, booking, HTTP_STATUS.CREATED, 'Booking confirmed');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings
 * List bookings with filters.
 */
const listBookings = async (req, res, next) => {
  try {
    const result = await bookingService.listBookings(req.user.id, req.user.role, req.query);
    return paginated(res, result.bookings, result.pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/:id
 * Get booking details.
 */
const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBooking(req.params.id, req.user.id, req.user.role);
    return success(res, booking, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/bookings/:id/cancel
 * Cancel a booking.
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id, req.user.role, reason);
    return success(res, booking, HTTP_STATUS.OK, 'Booking cancelled');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/bookings/:id/reschedule
 * Reschedule a booking.
 */
const rescheduleBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.rescheduleBooking(req.params.id, req.user.id, req.body);
    return success(res, booking, HTTP_STATUS.OK, 'Booking rescheduled');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/check-conflict
 * Check if a time slot has conflicts.
 */
const checkConflict = async (req, res, next) => {
  try {
    const { court, date, startTime, endTime, excludeBookingId } = req.query;
    const result = await bookingService.checkConflict(court, date, startTime, endTime, excludeBookingId);
    return success(res, result, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/upcoming
 * Get current user's upcoming bookings.
 */
const getUpcomingBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUpcomingBookings(req.user.id);
    return success(res, bookings, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/history
 * Get current user's booking history.
 */
const getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await bookingService.getBookingHistory(req.user.id);
    return success(res, bookings, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  listBookings,
  getBooking,
  cancelBooking,
  rescheduleBooking,
  checkConflict,
  getUpcomingBookings,
  getBookingHistory,
};

