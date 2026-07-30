const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ msg: 'No token provided. Authorization denied.' });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ msg: 'Token has expired. Please log in again.' });
        }
        return res.status(401).json({ msg: 'Invalid token. Authorization denied.' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ msg: 'User not found. Authorization denied.' });
      }

      req.user = {
        id: user._id,
        role: user.role,
      };

      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ msg: 'Access Denied. Insufficient permissions.' });
      }

      next();
    } catch (err) {
      console.error('Authentication Error:', err.message);
      res.status(500).json({ msg: 'Server error during authentication.' });
    }
  };
};

module.exports = authenticate;
