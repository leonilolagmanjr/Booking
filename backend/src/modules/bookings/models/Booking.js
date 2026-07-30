/**
 * CourtFlow — Booking Model
 * Core domain entity representing a court booking.
 * Includes conflict detection, status lifecycle, and payment tracking.
 */

const mongoose = require('mongoose');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../../../shared/constants');

const bookingSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
      index: true,
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true,
      index: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // minutes
      required: true,
      min: 15,
      max: 480,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(BOOKING_STATUS),
        message: '{VALUE} is not a valid booking status',
      },
      default: BOOKING_STATUS.PENDING,
    },
    cancellation: {
      reason: { type: String, default: null },
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      cancelledAt: { type: Date, default: null },
    },
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    rescheduledTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedOutAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.deletedAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ───────────────────────────────────────────

// Critical: conflict detection queries
bookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ court: 1, date: 1, status: 1 });

// Player dashboard queries
bookingSchema.index({ player: 1, status: 1, date: -1 });

// Club dashboard queries
bookingSchema.index({ club: 1, date: 1, status: 1 });

// Aggregate queries
bookingSchema.index({ club: 1, paymentStatus: 1 });

// ─── Instance Methods ──────────────────────────────────

/**
 * Check if booking overlaps with another time range.
 */
bookingSchema.methods.overlapsWith = function (startTime, endTime) {
  return this.startTime < endTime && this.endTime > startTime;
};

/**
 * Cancel the booking.
 */
bookingSchema.methods.cancel = async function (userId, reason) {
  this.status = BOOKING_STATUS.CANCELLED;
  this.cancellation = {
    reason: reason || 'No reason provided',
    cancelledBy: userId,
    cancelledAt: new Date(),
  };
  return this.save();
};

/**
 * Check if booking can be rescheduled (must be confirmed/pending and not started).
 */
bookingSchema.methods.canReschedule = function () {
  const now = new Date();
  return (
    [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(this.status) &&
    this.startTime > now
  );
};

// ─── Statics ───────────────────────────────────────────

/**
 * Find active bookings.
 */
bookingSchema.statics.findActive = function () {
  return this.find({ deletedAt: null });
};

/**
 * Find active booking by id.
 */
bookingSchema.statics.findActiveById = function (id) {
  return this.findOne({ _id: id, deletedAt: null });
};

/**
 * Check for time conflicts.
 */
bookingSchema.statics.hasConflict = async function (courtId, date, startTime, endTime, excludeBookingId) {
  const query = {
    court: courtId,
    date: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lte: new Date(date).setHours(23, 59, 59, 999),
    },
    status: {
      $nin: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.NO_SHOW],
    },
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
    deletedAt: null,
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await this.findOne(query);
  return !!conflict;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

