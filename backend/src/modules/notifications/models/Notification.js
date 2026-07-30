/**
 * CourtFlow — Notification Model
 * Supports in-app and email notifications for booking events.
 */

const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../../../shared/constants');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      default: null,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_TYPES),
        message: '{VALUE} is not a valid notification type',
      },
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: 1000,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
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
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// ─── Statics ───────────────────────────────────────────

/**
 * Create a notification for a booking event.
 */
notificationSchema.statics.createBookingNotification = async function ({
  recipient,
  club,
  booking,
  type,
  extraData = {},
}) {
  const titles = {
    booking_confirmed: 'Booking Confirmed',
    booking_cancelled: 'Booking Cancelled',
    booking_reminder: 'Booking Reminder',
    booking_rescheduled: 'Booking Rescheduled',
  };

  const messages = {
    booking_confirmed: 'Your booking has been confirmed.',
    booking_cancelled: 'A booking has been cancelled.',
    booking_reminder: 'Your booking starts in 1 hour.',
    booking_rescheduled: 'Your booking has been rescheduled.',
  };

  return this.create({
    recipient,
    club,
    booking,
    type,
    title: titles[type] || 'Notification',
    message: messages[type] || 'You have a new notification.',
    data: extraData,
  });
};

/**
 * Get unread count for a user.
 */
notificationSchema.statics.unreadCount = async function (userId) {
  return this.countDocuments({ recipient: userId, read: false });
};

/**
 * Mark all notifications as read for a user.
 */
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { recipient: userId, read: false },
    { read: true, readAt: new Date() }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

