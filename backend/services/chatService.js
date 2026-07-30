const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { getIO } = require('../socket'); // CRITICAL: Import getIO

// Create or Get Chat
const getOrCreateChat = async (userId, otherUserId = null) => {
    
    // --- Global Chat Logic ---
    if (!otherUserId) {
        // Find or create the single global chat room, using .lean() for faster reads
        let globalChat = await Chat.findOne({ participants: [], type: 'global' }).lean();
        
        if (!globalChat) {
            globalChat = await Chat.create({ 
                participants: [], 
                lastMessage: 'Welcome to the global chat!', 
                type: 'global' 
            });
        }
        return globalChat;
    }

    // --- Private Chat Logic ---
    
    // 1. Validate friendship before creating or fetching chat
    // Use .lean() to speed up user fetching if User model is large
    const [user1, user2] = await Promise.all([
        User.findById(userId).lean(),
        User.findById(otherUserId).lean()
    ]);
    
    if (!user1 || !user2) {
        throw new Error('One or both users not found.');
    }
    
    // Check bi-directional connection
    const isConnected = user1.connections.map(id => id.toString()).includes(otherUserId.toString()) && 
                        user2.connections.map(id => id.toString()).includes(userId.toString());

    if (!isConnected) {
        throw new Error('Cannot create chat: users are not connected (bi-directional required).');
    }

    // 2. Handle private chats
    // Use $all for finding a private chat, ensuring both IDs are present. Use .lean() for efficiency.
    let chat = await Chat.findOne({ 
        participants: { $all: [userId, otherUserId] },
        type: 'private'
    }).lean();
    
    if (!chat) {
        chat = await Chat.create({ 
            participants: [userId, otherUserId], 
            type: 'private' 
        });
    }
    
    return chat;
};

// Get or Create Application Chat (for employer-candidate communication without friendship requirement)
const getOrCreateApplicationChat = async (applicationId, userId) => {
    const Application = require('../models/Application');
    const Job = require('../models/Job');

    // Validate the application exists
    const application = await Application.findById(applicationId).populate('applicant').populate('job');
    if (!application) {
        throw new Error('Application not found');
    }

    const job = await Job.findById(application.job._id || application.job);
    if (!job) {
        throw new Error('Job not found');
    }

    // Verify user is either the employer (createdBy) or the applicant
    const isEmployer = job.createdBy.toString() === userId.toString();
    const isApplicant = application.applicant._id.toString() === userId.toString();

    if (!isEmployer && !isApplicant) {
        throw new Error('Not authorized to access this application chat');
    }

    // Determine the other participant
    const otherUserId = isEmployer ? application.applicant._id.toString() : job.createdBy.toString();

    // Find existing application chat
    let chat = await Chat.findOne({
        application: applicationId,
        type: 'application'
    }).lean();

    if (!chat) {
        // Create new application chat
        chat = await Chat.create({
            participants: [userId, otherUserId],
            type: 'application',
            application: applicationId,
            lastMessage: 'Welcome to your application chat!'
        });
    }

    // Update the application with chat room reference
    await Application.findByIdAndUpdate(applicationId, { chatRoom: chat._id });

    return chat;
};

// Send Message (Revised to include Socket.IO broadcast)
const sendMessage = async (chatId, senderId, receiverId, content) => {
    
    // 1. Verify the chat and participant status
    const chat = await Chat.findById(chatId).lean(); // Use .lean()
    if (!chat) {
        throw new Error('Chat not found.');
    }
    
    // Check if sender is a participant (only for private chats)
    if (chat.type === 'private' && !chat.participants.map(id => id.toString()).includes(senderId.toString())) {
        throw new Error('Sender is not a participant in this private chat.');
    }

    // 2. Create the message
    const message = await Message.create({
        sender: senderId,
        receiver: receiverId, // Null for global chat
        content,
        chat: chatId,
    });
    
    // 3. Update the chat
    // Use $set for explicit updates, using new Date() instead of Date.now() for consistency
    await Chat.findByIdAndUpdate(chatId, { 
        $set: { lastMessage: content, lastUpdated: new Date() } 
    });
    
    // 4. EFFICIENT SOCKET BROADCAST
    const io = getIO();
    
    // Fully populate the message object to send complete data to the frontend
    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name _id')
        .lean(); // Use .lean() for the broadcast object too
    
    io.to(chatId.toString()).emit('receiveMessage', populatedMessage);
    
    return populatedMessage;
};

// Fetch Chat Messages (Updated with .lean())
const getChatMessages = async (chatId) => {
    return await Message.find({ chat: chatId })
      .sort({ createdAt: 1 }) 
      .populate('sender', 'name _id')
      .lean(); // Use .lean() for speed
};

// Fetch all chats for a user (Updated with .lean())
const getUserChats = async (userId) => {
    // Ensure the global chat exists
    let globalChat = await Chat.findOne({ type: 'global' }).lean();
    if (!globalChat) {
        globalChat = await Chat.create({
            participants: [],
            lastMessage: 'Welcome to the global chat!',
            type: 'global'
        });
    }

    return await Chat.find({
        $or: [
            { participants: userId },
            { type: 'global' } // Include the global chat regardless of participation array
        ]
    })
      .populate('participants', 'name email profileImage')
      .sort({ lastUpdated: -1 }) // Sort by most recent activity
      .lean(); // Use .lean() for speed
};

module.exports = { getOrCreateChat, getOrCreateApplicationChat, sendMessage, getChatMessages, getUserChats };