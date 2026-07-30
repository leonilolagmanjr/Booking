/**
 * CourtFlow — Admin Routes
 */

const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authenticate = require('../../../middleware/authenticate');
const { authorize } = require('../../../middleware/authorize');
const { ROLES } = require('../../../shared/constants');

// All admin routes require authentication + super_admin role
router.use(authenticate);
router.use(authorize(ROLES.SUPER_ADMIN));

// User management
router.get('/users', adminController.listUsers);
router.patch('/users/:id/suspend', adminController.suspendUser);
router.patch('/users/:id/activate', adminController.activateUser);

// Club oversight
router.get('/clubs', adminController.listAllClubs);

// Analytics
router.get('/analytics', adminController.getAnalytics);

module.exports = router;

