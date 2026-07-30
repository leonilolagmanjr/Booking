const express = require('express');
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController'); 

const router = express.Router();

// Route for getting the user profile
router.get('/profile/:userId', authenticate(), userController.getUserProfile);

// Route for updating the user profile
router.patch('/updateprofile', authenticate(), userController.updateUserProfile);

// Add a route for updating user profile
//router.put('/profile', authenticate(), userController.getUserProfile);

// Route for Deleting Profile
router.delete('/remove/:userId', authenticate('admin'), userController.deleteUserProfile);

// Route for Deleting Self
router.delete('/removeself', authenticate(), userController.deleteOwnProfile);

// Route to Change Role
router.put('/changerole', authenticate('admin'), userController.changeUserRole);

// Route for adding a connection
router.post('/add-connection', authenticate(), userController.addConnection);

// Route to send friend request
router.post('/friend-request/send', authenticate(), userController.sendFriendRequest);

// Route to get friend requests
router.get('/friend-request', authenticate(), userController.getFriendRequests);

// Route to accept friend request
router.post('/friend-request/accept', authenticate(), userController.acceptFriendRequest);

// Route to deny friend request
router.post('/friend-request/deny', authenticate(), userController.denyFriendRequest);

// Route to cancel friend request
router.post('/friend-request/cancel', authenticate(), userController.cancelFriendRequest);

// New route to check friend relationship status
router.get('/friend-relationship-status', authenticate(), userController.checkFriendRelationshipStatus);

// Route to remove friend
router.post('/friend/remove', authenticate(), userController.removeFriend);

// Route to upload avatar
router.post('/upload-avatar', authenticate(), userController.uploadAvatar);

// Route to get leaderboard
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;
