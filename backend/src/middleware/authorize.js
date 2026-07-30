/**
 * CourtFlow — Role Authorization Middleware
 * Restricts access based on user role.
 */

const { HTTP_STATUS } = require('../shared/constants');
const { ROLES } = require('../shared/constants');

/**
 * Restrict access to specific roles.
 * @param  {...string} allowedRoles - Roles allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authentication required',
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Insufficient permissions',
        },
      });
    }

    next();
  };
};

/**
 * Check if user owns the resource (or is admin).
 * Pass a function that extracts the owner ID from the request.
 * @param {Function} getOwnerId - (req) => Promise<string> | string
 */
const authorizeOwner = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === ROLES.SUPER_ADMIN) {
        return next();
      }

      const ownerId = await getOwnerId(req);
      if (req.user.id !== ownerId.toString()) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          error: {
            code: 'AUTHORIZATION_ERROR',
            message: 'You do not own this resource',
          },
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { authorize, authorizeOwner };

