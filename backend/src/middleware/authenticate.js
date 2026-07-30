/**
 * CourtFlow — JWT Authentication Middleware
 * Verifies access token and attaches user to request.
 */

const jwt = require('jsonwebtoken');
const User = require('../modules/auth/models/User');
const { HTTP_STATUS } = require('../shared/constants');

/**
 * Authenticate request using JWT access token.
 * Attaches req.user = { id, role }
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'No token provided. Authorization denied.',
        },
      });
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired. Please refresh your token.',
          },
        });
      }
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token. Authorization denied.',
        },
      });
    }

    // Verify user exists and is active
    const user = await User.findActiveById(decoded.id);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive.',
        },
      });
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error during authentication.',
      },
    });
  }
};

module.exports = authenticate;

