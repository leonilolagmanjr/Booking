const chatService = require('../services/chatService');

/**
 * Handles creating a private chat or fetching an existing one.
 * If 'otherUserId' is NOT provided in the body, it fetches the global chat.
 * This function now replaces both createChat and getGlobalChat controller logic.
 */
const getOrCreateChat = async (req, res) => {
    // otherUserId will be null/undefined for global chat
    const { otherUserId } = req.body; 
    
    try {
        // The service layer handles determining if it's a private or global chat
        const chat = await chatService.getOrCreateChat(req.user.id, otherUserId || null);
        res.json(chat);
    } catch (err) {
        console.error('Error in getOrCreateChat:', err.message); 
        // Use 400 for business logic errors (like 'users are not friends')
        res.status(400).json({ msg: err.message || 'Failed to create or fetch chat. Please try again.' });
    }
};

// Original sendMessage, getMessages, and getChats remain good:

const sendMessage = async (req, res) => {
    const { chatId, receiverId, content } = req.body;
    try {
        const message = await chatService.sendMessage(chatId, req.user.id, receiverId || null, content);
        // OPTIONAL: If using WebSockets, you might want to emit the message here 
        // or let the service layer handle the socket broadcast *after* DB save.
        res.status(201).json(message); // Use 201 Created for a new resource (the message)
    } catch (err) {
        console.error('Error sending message:', err.message); 
        res.status(400).json({ msg: err.message || 'Failed to send message. Please try again.' });
    }
};

const getMessages = async (req, res) => {
    try {
        // Ensure chatId is properly validated and exists
        const chatId = req.params.chatId;
        if (!chatId) return res.status(400).json({ msg: 'Chat ID is required.' });

        const messages = await chatService.getChatMessages(chatId);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getChats = async (req, res) => {
    try {
        // Use a more descriptive name for the ID if needed, but req.user.id is fine
        const chats = await chatService.getUserChats(req.user.id);
        res.json(chats);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Export the newly combined function
module.exports = { getOrCreateChat, sendMessage, getMessages, getChats };