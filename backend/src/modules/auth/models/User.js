/**
 * CourtFlow — User Model
 * Refactored for pickleball club management.
 * Clean, focused, no social/gamification bloat.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, USER_STATUS, THEMES } = require('../../../shared/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: '{VALUE} is not a valid role',
      },
      default: ROLES.PLAYER,
    },
    avatar: {
      type: String,
      default: null, // Cloudinary URL
    },
    ownedClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
      },
    ],
    staffClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
      },
    ],
    savedClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
      },
    ],
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
      },
      theme: {
        type: String,
        enum: Object.values(THEMES),
        default: THEMES.SYSTEM,
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
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
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.verificationToken;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.deletedAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ───────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });

// ─── Pre-save Hook: Hash Password ──────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Methods ──────────────────────────────────

/**
 * Compare password with hashed password.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if user is active and not deleted.
 */
userSchema.methods.isActive = function () {
  return this.status === USER_STATUS.ACTIVE && !this.deletedAt;
};

/**
 * Get public profile (strips sensitive fields).
 */
userSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    avatar: this.avatar,
    ownedClubs: this.ownedClubs,
    preferences: this.preferences,
    emailVerified: this.emailVerified,
    lastActiveAt: this.lastActiveAt,
    createdAt: this.createdAt,
  };
};

// ─── Statics ───────────────────────────────────────────

/**
 * Find active user by email.
 */
userSchema.statics.findActiveByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase(),
    status: USER_STATUS.ACTIVE,
    deletedAt: null,
  });
};

/**
 * Find active user by id.
 */
userSchema.statics.findActiveById = function (id) {
  return this.findOne({
    _id: id,
    status: USER_STATUS.ACTIVE,
    deletedAt: null,
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

