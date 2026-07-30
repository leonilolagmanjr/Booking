const express = require('express');
const authenticate = require('../middleware/authenticate');
const applicationChatController = require('../controllers/applicationChatController');

const router = express.Router();

// Get or create application chat (POST /api/application-chat)
router.post('/', authenticate(), applicationChatController.getOrCreateApplicationChat);

module.exports = router;