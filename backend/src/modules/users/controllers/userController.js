/**
 * CourtFlow — Users Controller
 */

const userService = require('../services/userService');
const { success } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * GET /api/users/me
 * Get current user's profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    return success(res, profile, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/me
 * Update current user's profile.
 */
const updateProfile = async (req, res, next) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    return success(res, profile, HTTP_STATUS.OK, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/saved-clubs
 * Get user's saved clubs.
 */
const getSavedClubs = async (req, res, next) => {
  try {
    const clubs = await userService.getSavedClubs(req.user.id);
    return success(res, clubs, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/me/saved-clubs/:clubId
 * Save a club.
 */
const saveClub = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    await userService.saveClub(req.user.id, clubId);
    return success(res, null, HTTP_STATUS.OK, 'Club saved');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/me/saved-clubs/:clubId
 * Remove a saved club.
 */
const unsaveClub = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    await userService.unsaveClub(req.user.id, clubId);
    return success(res, null, HTTP_STATUS.OK, 'Club removed from saved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getSavedClubs,
  saveClub,
  unsaveClub,
};

