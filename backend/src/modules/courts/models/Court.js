/**
 * CourtFlow — Court Model
 * A court belongs to a club and has surface type, pricing, and availability.
 */

const mongoose = require('mongoose');
const { COURT_SURFACES, COURT_STATUS, COURT_FEATURES } = require('../../../shared/constants');

const courtSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Court name is required'],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    surface: {
      type: String,
      enum: {
        values: Object.values(COURT_SURFACES),
        message: '{VALUE} is not a valid court surface',
      },
      required: [true, 'Court surface type is required'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'PHP',
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    image: {
      type: String,
      default: null, // Cloudinary URL
    },
    features: [
      {
        type: String,
        enum: Object.values(COURT_FEATURES),
      },
    ],
    capacity: {
      type: Number,
      default: 4, // doubles
      min: 1,
      max: 10,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(COURT_STATUS),
        message: '{VALUE} is not a valid court status',
      },
      default: COURT_STATUS.AVAILABLE,
    },
    maintenanceSchedule: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        reason: { type: String, default: 'Scheduled maintenance' },
      },
    ],
    sortOrder: {
      type: Number,
      default: 0,
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
courtSchema.index({ club: 1, status: 1 });
courtSchema.index({ club: 1, surface: 1 });
courtSchema.index({ club: 1, name: 1 }, { unique: true });

// ─── Instance Methods ──────────────────────────────────

/**
 * Check if court is under maintenance on a given date.
 */
courtSchema.methods.isUnderMaintenance = function (date) {
  if (this.status === COURT_STATUS.MAINTENANCE) return true;
  
  return this.maintenanceSchedule.some((schedule) => {
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    const checkDate = new Date(date);
    return checkDate >= start && checkDate <= end;
  });
};

/**
 * Generate available time slots for a given date.
 * This is a placeholder — actual logic will use bookings from the Booking model.
 */
courtSchema.methods.generateTimeSlots = function (date, bookings = []) {
  if (this.isUnderMaintenance(date)) {
    return [];
  }

  const slots = [];
  const startHour = 6; // 6 AM
  const endHour = 22; // 10 PM
  const intervalMinutes = 60; // 1 hour slots

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(hour + 1, 0, 0, 0);

    // Check if slot conflicts with existing bookings
    const isBooked = bookings.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return startTime < bookingEnd && endTime > bookingStart;
    });

    slots.push({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      label: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
      available: !isBooked && this.status === COURT_STATUS.AVAILABLE,
      rate: this.hourlyRate,
    });
  }

  return slots;
};

// ─── Statics ───────────────────────────────────────────

/**
 * Find active courts.
 */
courtSchema.statics.findActive = function () {
  return this.find({ deletedAt: null }).sort({ sortOrder: 1, name: 1 });
};

/**
 * Find active courts by club.
 */
courtSchema.statics.findByClub = function (clubId) {
  return this.find({ club: clubId, deletedAt: null }).sort({ sortOrder: 1, name: 1 });
};

/**
 * Find active court by id.
 */
courtSchema.statics.findActiveById = function (id) {
  return this.findOne({ _id: id, deletedAt: null });
};

const Court = mongoose.model('Court', courtSchema);

module.exports = Court;

