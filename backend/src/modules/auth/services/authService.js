/**
 * CourtFlow — Auth Service
 * All auth business logic. Controllers only call these functions.
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  AppError,
} = require('../../../shared/errors');
const { HTTP_STATUS, ROLES } = require('../../../shared/constants');

// ─── Token Generation ──────────────────────────────────

/**
 * Generate access token (short-lived: 15 minutes).
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate refresh token (long-lived: 7 days).
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Generate email verification token.
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate password reset token.
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// ─── Register ──────────────────────────────────────────

const register = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token
  user.refreshTokens = [refreshToken];
  await user.save();

  return {
    user: user.toPublicProfile(),
    accessToken,
    refreshToken,
  };
};

// ─── Login ─────────────────────────────────────────────

const login = async ({ email, password }) => {
  // Find user with password field (select: false by default)
  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+password');

  if (!user || !user.isActive()) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Update last active
  user.lastActiveAt = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token (keep last 5)
  user.refreshTokens = [refreshToken, ...(user.refreshTokens || []).slice(0, 4)];
  await user.save();

  return {
    user: user.toPublicProfile(),
    accessToken,
    refreshToken,
  };
};

// ─── Refresh Token ─────────────────────────────────────

const refreshTokens = async ({ refreshToken }) => {
  // Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
  } catch (err) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  // Find user
  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.isActive()) {
    throw new AuthenticationError('User not found or inactive');
  }

  // Check if refresh token exists in user's stored tokens
  const tokenExists = user.refreshTokens.includes(refreshToken);
  if (!tokenExists) {
    // Possible token reuse attack — invalidate all tokens
    user.refreshTokens = [];
    await user.save();
    throw new AuthenticationError('Refresh token has been revoked');
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Replace old refresh token with new one
  user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// ─── Forgot Password ───────────────────────────────────

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Don't reveal if email exists or not (security best practice)
  if (!user || !user.isActive()) {
    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  // Generate reset token
  const resetToken = generateResetToken();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await user.save();

  // In production, send email here
  // await emailService.sendPasswordResetEmail(user.email, resetToken);

  // For development, return the token directly
  return {
    message: 'If an account with that email exists, a password reset link has been sent.',
    resetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken,
  };
};

// ─── Reset Password ────────────────────────────────────

const resetPassword = async ({ token, password }) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', HTTP_STATUS.BAD_REQUEST, 'INVALID_RESET_TOKEN');
  }

  // Update password
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  
  // Invalidate all refresh tokens (force re-login)
  user.refreshTokens = [];
  await user.save();

  return {
    message: 'Password has been reset successfully. Please log in with your new password.',
  };
};

// ─── Verify Email ──────────────────────────────────────

const verifyEmail = async ({ token }) => {
  const user = await User.findOne({ verificationToken: token });
  
  if (!user) {
    throw new AppError('Invalid verification token', HTTP_STATUS.BAD_REQUEST, 'INVALID_VERIFICATION_TOKEN');
  }

  user.emailVerified = true;
  user.verificationToken = null;
  await user.save();

  return {
    message: 'Email verified successfully.',
  };
};

// ─── Logout ────────────────────────────────────────────

const logout = async ({ userId, refreshToken }) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) {
    throw new NotFoundError('User');
  }

  // Remove the specific refresh token
  user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
  await user.save();

  return {
    message: 'Logged out successfully.',
  };
};

// ─── Logout All Devices ────────────────────────────────

const logoutAll = async ({ userId }) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) {
    throw new NotFoundError('User');
  }

  user.refreshTokens = [];
  await user.save();

  return {
    message: 'Logged out from all devices.',
  };
};

module.exports = {
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  logoutAll,
};

