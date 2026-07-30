const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  remoteAvailability: { type: Boolean, default: false },
  skills: [{ type: String }],
  languages: [{ type: String }],
  certifications: [{ type: String }],
  profileImage: { type: String }, // URL to the user's profile image

  // 🎮 Gamification System (Job-Based)
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  jobStats: {
    jobsApplied: { type: Number, default: 0 },
    jobsCompleted: { type: Number, default: 0 },
    jobsHired: { type: Number, default: 0 },
  },
  communityStats: {
    posts: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  profileCompleted: { type: Boolean, default: false },
  lastActiveAt: { type: Date, default: Date.now },
  streakCount: { type: Number, default: 0 }, // daily login/activity streaks

  // 🔒 Existing System
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Info',
    default: null
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },

  // ✅ KYC / Verification
  kycStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  kycSubmittedAt: { type: Date },
  kycVerifiedAt: { type: Date },
  verificationProvider: { type: String },
  verificationId: { type: String },
  documents: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
