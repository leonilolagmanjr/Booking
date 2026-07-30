const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Register Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

module.exports = router;
