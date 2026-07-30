const express = require('express');
const authenticate = require('../middleware/authenticate');
const infoController = require('../controllers/infoController');

const router = express.Router();

// Route to Get Info
router.get('/', authenticate(), infoController.getInfo);

// Route to Update Info
router.patch('/update', authenticate(), infoController.updateInfo);

module.exports = router;