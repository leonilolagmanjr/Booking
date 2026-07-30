/**
 * CourtFlow — Courts Routes
 */

const express = require('express');
const router = express.Router();

const courtController = require('../controllers/courtController');
const authenticate = require('../../../middleware/authenticate');
const { authorize } = require('../../../middleware/authorize');
const { validate } = require('../../../middleware/validate');
const { ROLES } = require('../../../shared/constants');
const {
  createCourtSchema,
  updateCourtSchema,
  availabilityQuerySchema,
  courtIdParamSchema,
} = require('../validators/courtValidators');

// ─── Public Routes ─────────────────────────────────────

// Get court by ID
router.get('/:id', validate(courtIdParamSchema), courtController.getCourt);

// Get court availability
router.get(
  '/:id/availability',
  validate(courtIdParamSchema),
  validate(availabilityQuerySchema),
  courtController.getAvailability
);

// ─── Protected Routes ──────────────────────────────────

// Create court (club_owner or super_admin)
router.post(
  '/',
  authenticate,
  authorize(ROLES.CLUB_OWNER, ROLES.SUPER_ADMIN),
  validate(createCourtSchema),
  courtController.createCourt
);

// Update court (owner or super_admin)
router.patch(
  '/:id',
  authenticate,
  validate(courtIdParamSchema),
  validate(updateCourtSchema),
  courtController.updateCourt
);

// Delete court (owner or super_admin)
router.delete(
  '/:id',
  authenticate,
  validate(courtIdParamSchema),
  courtController.deleteCourt
);

module.exports = router;

