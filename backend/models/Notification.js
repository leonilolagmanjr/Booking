const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: ['application_status', 'friend_request', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    default: null
  },
  relatedJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    default: null
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries by recipient
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;