/**
 * CourtFlow — Payments Controller
 */

const paymentService = require('../services/paymentService');
const { success, paginated } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * GET /api/payments/:bookingId
 * Get payment by booking ID.
 */
const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByBooking(req.params.bookingId, req.user.id);
    return success(res, payment, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payments/:bookingId/pay
 * Record a payment for a booking.
 */
const recordPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.recordPayment(req.params.bookingId, req.user.id, req.body);
    return success(res, payment, HTTP_STATUS.CREATED, 'Payment recorded');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payments/:bookingId/refund
 * Refund a payment (admin/owner only).
 */
const refundPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.refundPayment(req.params.bookingId, req.user.id, req.body.reason);
    return success(res, payment, HTTP_STATUS.OK, 'Payment refunded');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments
 * List payments (admin only).
 */
const listPayments = async (req, res, next) => {
  try {
    const result = await paymentService.listPayments(req.query);
    return paginated(res, result.payments, result.pagination);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPaymentByBooking,
  recordPayment,
  refundPayment,
  listPayments,
};

