/**
 * CourtFlow — Dashboard Routes
 */

const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../../../middleware/authenticate');
const { authorize } = require('../../../middleware/authorize');
const { ROLES } = require('../../../shared/constants');

// All dashboard routes require authentication
router.use(authenticate);

// Owner dashboard
router.get(
  '/owner',
  authorize(ROLES.CLUB_OWNER, ROLES.SUPER_ADMIN),
  dashboardController.getOwnerDashboard
);

// Player dashboard
router.get(
  '/player',
  authorize(ROLES.PLAYER, ROLES.SUPER_ADMIN),
  dashboardController.getPlayerDashboard
);

module.exports = router;

