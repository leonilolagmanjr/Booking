/**
 * CourtFlow — Dashboard Controller
 */

const dashboardService = require('../services/dashboardService');
const { success } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * GET /api/dashboard/owner
 * Get owner dashboard data.
 */
const getOwnerDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getOwnerDashboard(req.user.id);
    return success(res, data, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/player
 * Get player dashboard data.
 */
const getPlayerDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getPlayerDashboard(req.user.id);
    return success(res, data, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOwnerDashboard,
  getPlayerDashboard,
};

