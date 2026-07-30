/**
 * CourtFlow — Payment Model
 * Tracks payment status for bookings.
 * Designed for future integration with GCash, Maya, Stripe.
 */

const mongoose = require('mongoose');
const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../../../shared/constants');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'PHP',
      enum: ['PHP', 'USD'],
    },
    method: {
      type: String,
      enum: {
        values: Object.values(PAYMENT_METHODS),
        message: '{VALUE} is not a valid payment method',
      },
      default: PAYMENT_METHODS.CASH,
    },
    transactionId: {
      type: String,
      default: null,
      sparse: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(PAYMENT_STATUS),
        message: '{VALUE} is not a valid payment status',
      },
      default: PAYMENT_STATUS.UNPAID,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paidAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ───────────────────────────────────────────
paymentSchema.index({ player: 1, status: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// ─── Statics ───────────────────────────────────────────

/**
 * Mark payment as completed.
 */
paymentSchema.statics.markAsPaid = async function (bookingId, { method, transactionId, receiptUrl } = {}) {
  return this.findOneAndUpdate(
    { booking: bookingId },
    {
      status: PAYMENT_STATUS.PAID,
      method: method || 'cash',
      transactionId: transactionId || null,
      receiptUrl: receiptUrl || null,
      paidAt: new Date(),
    },
    { new: true }
  );
};

/**
 * Mark payment as refunded.
 */
paymentSchema.statics.markAsRefunded = async function (bookingId, reason) {
  return this.findOneAndUpdate(
    { booking: bookingId },
    {
      status: PAYMENT_STATUS.REFUNDED,
      refundedAt: new Date(),
      refundReason: reason || null,
    },
    { new: true }
  );
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

