/**
 * CourtFlow — Standardized API Response Helpers
 * Every response follows the same shape.
 */

/**
 * Send a success response.
 */
const success = (res, data = null, statusCode = 200, message = 'Success') => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a success response with pagination.
 */
const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

/**
 * Send an error response (for non-thrown errors).
 */
const error = (res, message = 'Error', statusCode = 500, code = 'INTERNAL_ERROR') => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

module.exports = { success, paginated, error };

