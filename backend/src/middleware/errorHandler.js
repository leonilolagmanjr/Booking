/**
 * CourtFlow — Centralized Error Handler Middleware
 * Catches all errors and returns consistent JSON responses.
 */

const { AppError } = require('../shared/errors');
const { HTTP_STATUS } = require('../shared/constants');

const errorHandler = (err, req, res, _next) => {
  // Log error for debugging (but not in production for operational errors)
  if (process.env.NODE_ENV !== 'production' || !err.isOperational) {
    console.error('ERROR:', err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(HTTP_STATUS.UNPROCESSABLE).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
      },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      error: {
        code: 'DUPLICATE_KEY',
        message: `${field} already exists`,
      },
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: `Invalid ${err.path}: ${err.value}`,
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
      },
    });
  }

  // Our custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || undefined,
      },
    });
  }

  // Unknown errors — don't leak details in production
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
};

module.exports = errorHandler;

