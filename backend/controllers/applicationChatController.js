const chatService = require('../services/chatService');

/**
 * Get or create a chat specifically for employer-candidate communication.
 * This does NOT require friendship - it uses the application context.
 */
const getOrCreateApplicationChat = async (req, res) => {
    const { applicationId } = req.body;
    const userId = req.user.id;

    try {
        const chat = await chatService.getOrCreateApplicationChat(applicationId, userId);
        res.json(chat);
    } catch (err) {
        console.error('Error in getOrCreateApplicationChat:', err.message);
        res.status(400).json({ msg: err.message || 'Failed to create or fetch application chat.' });
    }
};

module.exports = { getOrCreateApplicationChat };