const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // Participants will be an array of 2 User IDs for private chats.
  // This array will be empty for the single 'global' chat room.
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // New field to distinguish the chat type
  type: {
    type: String,
    enum: ['private', 'global', 'application'], // Only allow these three values
    default: 'private',
    required: true,
  },
  
  // The 'lastMessage' summary will now be handled by a virtual property
  // or a separate index function in the service layer, but we will leave
  // a simplified version here for direct updates as your service is doing.
  lastMessage: { 
    type: String, 
    default: '' 
  },
  
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
}, { 
  timestamps: true // Add createdAt and updatedAt timestamps automatically
});

// Index for private chats (non-unique to allow multiple chats per pair)
chatSchema.index({ participants: 1 }, { partialFilterExpression: { type: 'private' } });

module.exports = mongoose.model('Chat', chatSchema);