const express = require('express');
const authenticate = require('../middleware/authenticate');
const chatController = require('../controllers/chatController');

const router = express.Router();

// 1. Fetch all chats for the logged-in user (GET /api/chat)
router.get('/', authenticate(), chatController.getChats);

// 2. CREATE or GET a private chat OR GET the global chat (POST /api/chat/create)
// We use POST here because we are sending data (otherUserId) to the server
// to trigger the logic to find or create the resource.
// Note: This replaces both the old router.post('/create') and router.get('/global').
router.post('/create', authenticate(), chatController.getOrCreateChat);

// 3. Send a message (POST /api/chat/send)
router.post('/send', authenticate(), chatController.sendMessage);

// 4. Get all messages for a specific chat (GET /api/chat/:chatId/messages)
router.get('/:chatId/messages', authenticate(), chatController.getMessages);

module.exports = router;