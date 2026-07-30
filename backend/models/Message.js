const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat', 
    required: true 
  },
  
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // This is used for private chats (the other participant) and is null for global.
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  
  content: { 
    type: String, 
    required: true 
  },
}, {
  // 💡 FIX: Use built-in Mongoose timestamps for 'createdAt' and 'updatedAt'.
  // This will automatically add a 'createdAt' field, which is your message timestamp.
  timestamps: true 
});

module.exports = mongoose.model('Message', messageSchema);