/**
 * CourtFlow — Clubs Routes
 */

const express = require('express');
const router = express.Router();

const clubController = require('../controllers/clubController');
const authenticate = require('../../../middleware/authenticate');
const { authorize } = require('../../../middleware/authorize');
const { validate } = require('../../../middleware/validate');
const { ROLES } = require('../../../shared/constants');
const {
  createClubSchema,
  updateClubSchema,
  clubIdParamSchema,
} = require('../validators/clubValidators');

// ─── Public Routes ─────────────────────────────────────

// List all active clubs
router.get('/', clubController.listClubs);

// Get club by ID
router.get('/:id', validate(clubIdParamSchema), clubController.getClub);

// ─── Protected Routes ──────────────────────────────────

// Get current user's clubs
router.get('/my', authenticate, clubController.getMyClubs);

// Create club (club_owner or super_admin)
router.post(
  '/',
  authenticate,
  authorize(ROLES.CLUB_OWNER, ROLES.SUPER_ADMIN),
  validate(createClubSchema),
  clubController.createClub
);

// Update club (owner or super_admin)
router.patch(
  '/:id',
  authenticate,
  validate(clubIdParamSchema),
  validate(updateClubSchema),
  clubController.updateClub
);

// Delete club (owner or super_admin)
router.delete(
  '/:id',
  authenticate,
  validate(clubIdParamSchema),
  clubController.deleteClub
);

// Get club stats (owner, staff, or super_admin)
router.get(
  '/:id/stats',
  authenticate,
  validate(clubIdParamSchema),
  clubController.getClubStats
);

module.exports = router;

