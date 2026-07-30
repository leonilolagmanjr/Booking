/**
 * CourtFlow — Admin Controller
 */

const adminService = require('../services/adminService');
const { success, paginated } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * GET /api/admin/users
 */
const listUsers = async (req, res, next) => {
  try {
    const result = await adminService.listUsers(req.query);
    return paginated(res, result.users, result.pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/users/:id/suspend
 */
const suspendUser = async (req, res, next) => {
  try {
    const user = await adminService.suspendUser(req.params.id);
    return success(res, user, HTTP_STATUS.OK, 'User suspended');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/users/:id/activate
 */
const activateUser = async (req, res, next) => {
  try {
    const user = await adminService.activateUser(req.params.id);
    return success(res, user, HTTP_STATUS.OK, 'User activated');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/clubs
 */
const listAllClubs = async (req, res, next) => {
  try {
    const result = await adminService.listAllClubs(req.query);
    return paginated(res, result.clubs, result.pagination);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/analytics
 */
const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getAnalytics();
    return success(res, data, HTTP_STATUS.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  suspendUser,
  activateUser,
  listAllClubs,
  getAnalytics,
};

