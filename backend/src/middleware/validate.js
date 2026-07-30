/**
 * CourtFlow — Validation Middleware
 * Uses Zod schemas to validate request body, params, and query.
 */

const { HTTP_STATUS } = require('../shared/constants');

/**
 * Creates validation middleware for the given Zod schema.
 * @param {Object} schema - Zod schema or object with body/params/query schemas
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        const result = schema.body.parse(req.body);
        req.body = result;
      }
      if (schema.params) {
        const result = schema.params.parse(req.params);
        req.params = result;
      }
      if (schema.query) {
        const result = schema.query.parse(req.query);
        req.query = result;
      }
      next();
    } catch (err) {
      if (err.errors) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
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
      next(err);
    }
  };
};

module.exports = { validate };

