/**
 * CourtFlow — Payment Service
 * Handles payment records, status updates, and refunds.
 * Designed for future integration with GCash, Maya, Stripe.
 */

const Payment = require('../models/Payment');
const Booking = require('../../bookings/models/Booking');
const { NotFoundError, AppError } = require('../../../shared/errors');
const { BOOKING_STATUS, PAYMENT_STATUS, HTTP_STATUS } = require('../../../shared/constants');

/**
 * Get payment by booking ID.
 */
const getPaymentByBooking = async (bookingId, userId) => {
  const payment = await Payment.findOne({ booking: bookingId })
    .populate('booking', 'date startTime endTime totalAmount status')
    .populate('player', 'name email');

  if (!payment) {
    throw new NotFoundError('Payment');
  }

  return payment;
};

/**
 * Record a new payment for a booking.
 */
const recordPayment = async (bookingId, playerId, data) => {
  const booking = await Booking.findActiveById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking');
  }

  if (booking.player.toString() !== playerId) {
    throw new AppError('This booking does not belong to you', HTTP_STATUS.FORBIDDEN, 'NOT_YOUR_BOOKING');
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({ booking: bookingId });
  if (existingPayment) {
    throw new AppError('Payment already recorded for this booking', HTTP_STATUS.CONFLICT, 'PAYMENT_EXISTS');
  }

  const payment = await Payment.create({
    booking: bookingId,
    player: playerId,
    amount: booking.totalAmount,
    method: data.method || 'cash',
    transactionId: data.transactionId || null,
    status: PAYMENT_STATUS.PAID,
    paidAt: new Date(),
  });

  // Update booking payment status
  booking.paymentStatus = PAYMENT_STATUS.PAID;
  booking.payment = payment._id;
  await booking.save();

  return payment;
};

/**
 * Process a refund.
 */
const refundPayment = async (bookingId, adminId, reason) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new NotFoundError('Payment');
  }

  if (payment.status !== PAYMENT_STATUS.PAID) {
    throw new AppError('Payment is not in a refundable state', HTTP_STATUS.BAD_REQUEST, 'NOT_REFUNDABLE');
  }

  payment.status = PAYMENT_STATUS.REFUNDED;
  payment.refundedAt = new Date();
  payment.refundReason = reason || 'No reason provided';
  await payment.save();

  // Update booking
  const booking = await Booking.findActiveById(bookingId);
  if (booking) {
    booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
    await booking.save();
  }

  return payment;
};

/**
 * Get payment list (admin).
 */
const listPayments = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.player) filter.player = query.player;
  if (query.method) filter.method = query.method;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('booking', 'date startTime endTime totalAmount status')
      .populate('player', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

module.exports = {
  getPaymentByBooking,
  recordPayment,
  refundPayment,
  listPayments,
};

