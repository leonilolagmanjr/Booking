/**
 * CourtFlow — Auth Controller
 * Thin controllers — just parse request, call service, send response.
 */

const authService = require('../services/authService');
const { success } = require('../../../shared/response');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * POST /api/auth/register
 * Register a new user.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    return success(res, result, HTTP_STATUS.CREATED, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return success(res, result, HTTP_STATUS.OK, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 * Get new access token using refresh token.
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens({ refreshToken });
    return success(res, result, HTTP_STATUS.OK, 'Tokens refreshed');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 * Send password reset email.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword({ email });
    return success(res, result, HTTP_STATUS.OK, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password/:token
 * Reset password with token.
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authService.resetPassword({ token, password });
    return success(res, result, HTTP_STATUS.OK, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-email/:token
 * Verify email address.
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const result = await authService.verifyEmail({ token });
    return success(res, result, HTTP_STATUS.OK, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Logout user (invalidate refresh token).
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.logout({
      userId: req.user.id,
      refreshToken,
    });
    return success(res, result, HTTP_STATUS.OK, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout-all
 * Logout from all devices.
 */
const logoutAll = async (req, res, next) => {
  try {
    const result = await authService.logoutAll({ userId: req.user.id });
    return success(res, result, HTTP_STATUS.OK, result.message);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  logoutAll,
};

