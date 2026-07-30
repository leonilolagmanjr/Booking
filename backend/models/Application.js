const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'],
    default: 'applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    default: null
  },
  interviewDate: {
    type: Date,
    default: null
  },
  meetingLink: {
    type: String,
    default: null
  },
  employmentActive: {
    type: Boolean,
    default: false
  }
});

// Compound index to ensure unique application per applicant per job
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });
// Index for efficient job-based queries
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;