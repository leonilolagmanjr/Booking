/**
 * CourtFlow — Club Model
 * Represents a pickleball club with operating hours and settings.
 */

const mongoose = require('mongoose');
const { CLUB_STATUS, DAYS_OF_WEEK, CANCELLATION_POLICIES } = require('../../../shared/constants');

const operatingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: DAYS_OF_WEEK,
      required: true,
    },
    open: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
    },
    close: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'],
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      zip: { type: String, trim: true, default: '' },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    logo: {
      type: String,
      default: null, // Cloudinary URL
    },
    coverImage: {
      type: String,
      default: null, // Cloudinary URL
    },
    operatingHours: {
      type: [operatingHourSchema],
      validate: {
        validator: function (hours) {
          // Must have exactly 7 entries (one per day)
          if (hours.length !== 7) return false;
          // Must cover all days of the week
          const days = hours.map((h) => h.day);
          return DAYS_OF_WEEK.every((d) => days.includes(d));
        },
        message: 'Operating hours must cover all 7 days of the week',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    settings: {
      defaultBookingDuration: {
        type: Number,
        default: 60, // minutes
        min: 15,
        max: 480,
      },
      maxAdvanceDays: {
        type: Number,
        default: 30,
        min: 1,
        max: 365,
      },
      cancellationPolicy: {
        type: String,
        enum: Object.values(CANCELLATION_POLICIES),
        default: CANCELLATION_POLICIES.FLEXIBLE,
      },
      cancellationDeadline: {
        type: Number,
        default: 24, // hours before booking
        min: 1,
        max: 168,
      },
      allowGuestBookings: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: Object.values(CLUB_STATUS),
      default: CLUB_STATUS.ACTIVE,
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
clubSchema.index({ owner: 1, status: 1 });
clubSchema.index({ status: 1, name: 1 });
clubSchema.index({ 'address.city': 1, status: 1 });

// ─── Statics ───────────────────────────────────────────

/**
 * Find active clubs.
 */
clubSchema.statics.findActive = function () {
  return this.find({ deletedAt: null, status: CLUB_STATUS.ACTIVE });
};

/**
 * Find active club by id.
 */
clubSchema.statics.findActiveById = function (id) {
  return this.findOne({ _id: id, deletedAt: null });
};

/**
 * Find clubs owned by a specific user.
 */
clubSchema.statics.findByOwner = function (ownerId) {
  return this.find({ owner: ownerId, deletedAt: null }).sort({ name: 1 });
};

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;

