/**
 * CourtFlow — Clubs Controller
 * Thin controllers — parse request, call service, send response.
 */

const clubService = require('../services/clubService');
const { success } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * GET /api/clubs
 * List all active clubs (public).
 */
const listClubs = async (req, res, next) => {
  try {
    const clubs = await clubService.listClubs(req.query);
    return success(res, clubs, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/clubs/:id
 * Get club details (public).
 */
const getClub = async (req, res, next) => {
  try {
    const club = await clubService.getClub(req.params.id);
    return success(res, club, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/clubs
 * Create a new club (owner, admin).
 */
const createClub = async (req, res, next) => {
  try {
    const club = await clubService.createClub(req.user.id, req.body);
    return success(res, club, HTTP_STATUS.CREATED, 'Club created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/clubs/:id
 * Update a club (owner, admin).
 */
const updateClub = async (req, res, next) => {
  try {
    const club = await clubService.updateClub(req.params.id, req.user.id, req.user.role, req.body);
    return success(res, club, HTTP_STATUS.OK, 'Club updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/clubs/:id
 * Soft-delete a club (owner, admin).
 */
const deleteClub = async (req, res, next) => {
  try {
    await clubService.deleteClub(req.params.id, req.user.id, req.user.role);
    return success(res, null, HTTP_STATUS.OK, 'Club deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/clubs/:id/stats
 * Get club statistics (owner, staff, admin).
 */
const getClubStats = async (req, res, next) => {
  try {
    const stats = await clubService.getClubStats(req.params.id, req.user.id, req.user.role);
    return success(res, stats, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/clubs/my
 * Get current user's clubs (owner).
 */
const getMyClubs = async (req, res, next) => {
  try {
    const Club = require('../models/Club');
    const clubs = await Club.findByOwner(req.user.id);
    return success(res, clubs, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub,
  getClubStats,
  getMyClubs,
};

