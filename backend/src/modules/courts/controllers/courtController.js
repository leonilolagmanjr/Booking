/**
 * CourtFlow — Courts Controller
 */

const courtService = require('../services/courtService');
const { success } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * GET /api/clubs/:clubId/courts
 * List all courts for a club.
 */
const listCourts = async (req, res, next) => {
  try {
    const courts = await courtService.listCourts(req.params.clubId);
    return success(res, courts, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/courts/:id
 * Get court details.
 */
const getCourt = async (req, res, next) => {
  try {
    const court = await courtService.getCourt(req.params.id);
    return success(res, court, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/clubs/:clubId/courts
 * Create a court (owner, admin).
 */
const createCourt = async (req, res, next) => {
  try {
    const court = await courtService.createCourt(
      req.params.clubId,
      req.user.id,
      req.user.role,
      req.body
    );
    return success(res, court, HTTP_STATUS.CREATED, 'Court created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/courts/:id
 * Update a court (owner, admin).
 */
const updateCourt = async (req, res, next) => {
  try {
    const court = await courtService.updateCourt(req.params.id, req.user.id, req.user.role, req.body);
    return success(res, court, HTTP_STATUS.OK, 'Court updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/courts/:id
 * Soft-delete a court (owner, admin).
 */
const deleteCourt = async (req, res, next) => {
  try {
    await courtService.deleteCourt(req.params.id, req.user.id, req.user.role);
    return success(res, null, HTTP_STATUS.OK, 'Court deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/courts/:id/availability
 * Get court availability for a specific date.
 */
const getAvailability = async (req, res, next) => {
  try {
    const { date, duration } = req.query;
    const availability = await courtService.getAvailability(req.params.id, date, duration);
    return success(res, availability, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCourts,
  getCourt,
  createCourt,
  updateCourt,
  deleteCourt,
  getAvailability,
};

