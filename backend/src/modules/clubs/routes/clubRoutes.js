/**
 * CourtFlow — Clubs Routes
 */

const express = require('express');
const router = express.Router();

const clubController = require('../controllers/clubController');
const courtController = require('../../courts/controllers/courtController');
const authenticate = require('../../../middleware/authenticate');
const { authorize } = require('../../../middleware/authorize');
const { validate } = require('../../../middleware/validate');
const { ROLES } = require('../../../shared/constants');
const {
  createClubSchema,
  updateClubSchema,
  clubIdParamSchema,
} = require('../validators/clubValidators');
const courtValidators = require('../../courts/validators/courtValidators');
const courtClubIdParamSchema = courtValidators.clubIdParamSchema;
const createCourtSchema = courtValidators.createCourtSchema;
const updateCourtSchema = courtValidators.updateCourtSchema;
const courtIdParamSchema = courtValidators.courtIdParamSchema;

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

// ─── Court Routes (sub-resource of clubs) ────────────
// Map req.params.id to req.params.clubId for court sub-routes

// List courts for a club
router.get('/:id/courts', (req, _res, next) => {
  req.params.clubId = req.params.id;
  next();
}, courtController.listCourts);

// Create court in a club
router.post(
  '/:id/courts',
  authenticate,
  authorize(ROLES.CLUB_OWNER, ROLES.SUPER_ADMIN),
  (req, _res, next) => {
    req.params.clubId = req.params.id;
    next();
  },
  validate(createCourtSchema),
  courtController.createCourt
);

module.exports = router;

