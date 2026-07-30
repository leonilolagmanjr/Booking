/**
 * CourtFlow — Users Routes
 */

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticate = require('../../../middleware/authenticate');
const { validate } = require('../../../middleware/validate');
const { updateProfileSchema } = require('../../auth/validators/authValidators');

// All user routes require authentication
router.use(authenticate);

// Profile
router.get('/me', userController.getProfile);
router.patch('/me', validate(updateProfileSchema), userController.updateProfile);

// Saved clubs
router.get('/me/saved-clubs', userController.getSavedClubs);
router.post('/me/saved-clubs/:clubId', userController.saveClub);
router.delete('/me/saved-clubs/:clubId', userController.unsaveClub);

module.exports = router;

