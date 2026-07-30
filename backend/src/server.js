/**
 * CourtFlow — Server Entry Point
 * 
 * This is the NEW server file for the CourtFlow architecture.
 * It runs alongside the existing backend/server.js during migration.
 * 
 * Usage: node src/server.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { defaultRateLimiter } = require('./middleware/rateLimiter');
const { ROLES } = require('./shared/constants');

const app = express();
let server;

// ─── Security ───────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── Rate Limiting ──────────────────────────────────────
app.use('/api/', defaultRateLimiter);

// ─── Body Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CourtFlow API is running',
    uptime: process.uptime(),
    version: '0.1.0',
  });
});

// ─── API Routes ────────────────────────────────────────
app.use('/api/auth', require('./modules/auth/routes/authRoutes'));
app.use('/api/users', require('./modules/users/routes/userRoutes'));
app.use('/api/clubs', require('./modules/clubs/routes/clubRoutes'));
app.use('/api/courts', require('./modules/courts/routes/courtRoutes'));
app.use('/api/bookings', require('./modules/bookings/routes/bookingRoutes'));
app.use('/api/payments', require('./modules/payments/routes/paymentRoutes'));
app.use('/api/notifications', require('./modules/notifications/routes/notificationRoutes'));
app.use('/api/admin', require('./modules/admin/routes/adminRoutes'));
app.use('/api/dashboard', require('./modules/dashboard/routes/dashboardRoutes'));

// ─── Error Handler (must be last) ──────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.COURTFLOW_PORT || 5001;
    server = http.createServer(app);
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🏓 CourtFlow API running on port ${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   Env: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();

module.exports = { app, server };

