const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  professionalDetails: {
    jobTitle: { type: String, default: '' },
    industry: { type: String, default: '' },
    yearsOfExperience: { type: String, default: '' },
  },
  skillsAndCertifications: {
    skills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
  },
  workPortfolio: {
    resumeLink: { type: String, default: '' },
    portfolioLink: { type: String, default: '' },
  },
  ratingsAndPerformance: {
    averageRating: { type: String, default: '' },
    jobSuccessRate: { type: String, default: '' },
    completedJobs: { type: String, default: '' },
  },
  ratesAndPayment: {
    hourlyRate: { type: String, default: '' },
    preferredPaymentMethod: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Info', infoSchema);