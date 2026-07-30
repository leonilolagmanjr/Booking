/**
 * CourtFlow — Auth Routes
 * Each route has validation + rate limiting where appropriate.
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validate } = require('../../../middleware/validate');
const authenticate = require('../../../middleware/authenticate');
const { authRateLimiter } = require('../../../middleware/rateLimiter');

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
} = require('../validators/authValidators');

// ─── Public Routes ─────────────────────────────────────

// Register — rate limited to prevent spam
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

// Login — rate limited to prevent brute force
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

// Refresh token
router.post(
  '/refresh',
  authRateLimiter,
  validate(refreshSchema),
  authController.refresh
);

// Forgot password — rate limited
router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Verify email
router.post(
  '/verify-email/:token',
  authController.verifyEmail
);

// ─── Protected Routes ──────────────────────────────────

// Logout
router.post(
  '/logout',
  authenticate,
  authController.logout
);

// Logout all devices
router.post(
  '/logout-all',
  authenticate,
  authController.logoutAll
);

module.exports = router;

