const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const authenticate = require('../middleware/authenticate');

// Forum Group routes
router.post('/create', authenticate(), forumController.createForumGroup);
router.get('/', forumController.getAllForumGroups);
router.get('/:id', forumController.getForumGroupById);
router.patch('/:id', authenticate(), forumController.updateForumGroup);
router.delete('/:id', authenticate(), forumController.deleteForumGroup);

module.exports = router;
