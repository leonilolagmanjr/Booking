/**
 * CourtFlow — Rate Limiter Middleware
 * Placeholder — will be replaced with express-rate-limit in Phase 1.
 */

const { HTTP_STATUS } = require('../shared/constants');

/**
 * Simple in-memory rate limiter for development.
 * In production, use express-rate-limit or Redis-based solution.
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const timestamps = requests.get(ip).filter((t) => now - t < windowMs);
    
    if (timestamps.length >= maxRequests) {
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_ERROR',
          message: 'Too many requests. Please try again later.',
        },
      });
    }

    timestamps.push(now);
    requests.set(ip, timestamps);

    // Clean up old entries periodically
    if (requests.size > 10000) {
      for (const [key, times] of requests.entries()) {
        const valid = times.filter((t) => now - t < windowMs);
        if (valid.length === 0) {
          requests.delete(key);
        } else {
          requests.set(key, valid);
        }
      }
    }

    next();
  };
};

// Default: 100 requests per 15 minutes
const defaultRateLimiter = createRateLimiter();

// Auth endpoints: 10 requests per 15 minutes
const authRateLimiter = createRateLimiter(15 * 60 * 1000, 10);

module.exports = { defaultRateLimiter, authRateLimiter, createRateLimiter };

