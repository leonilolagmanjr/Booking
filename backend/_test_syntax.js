// Quick syntax validation for CourtFlow server
process.env.NODE_ENV = 'development';
process.env.MONGO_URI = 'mongodb://localhost:27017/courtflow_test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.COURTFLOW_PORT = '5001';

// Test all module loads individually to find syntax errors without connecting to DB
const modules = [
  './src/shared/constants',
  './src/shared/errors',
  './src/shared/response',
  './src/middleware/errorHandler',
  './src/middleware/authenticate',
  './src/middleware/authorize',
  './src/middleware/validate',
  './src/middleware/rateLimiter',
  './src/config/database',
  './src/modules/auth/models/User',
  './src/modules/auth/validators/authValidators',
  './src/modules/auth/services/authService',
  './src/modules/auth/controllers/authController',
  './src/modules/auth/routes/authRoutes',
  './src/modules/users/services/userService',
  './src/modules/users/controllers/userController',
  './src/modules/users/routes/userRoutes',
  './src/modules/clubs/models/Club',
  './src/modules/clubs/validators/clubValidators',
  './src/modules/clubs/services/clubService',
  './src/modules/clubs/controllers/clubController',
  './src/modules/clubs/routes/clubRoutes',
  './src/modules/courts/models/Court',
  './src/modules/courts/validators/courtValidators',
  './src/modules/courts/services/courtService',
  './src/modules/courts/controllers/courtController',
  './src/modules/courts/routes/courtRoutes',
  './src/modules/bookings/models/Booking',
  './src/modules/bookings/validators/bookingValidators',
  './src/modules/bookings/services/bookingService',
  './src/modules/bookings/controllers/bookingController',
  './src/modules/bookings/routes/bookingRoutes',
  './src/modules/payments/models/Payment',
  './src/modules/payments/services/paymentService',
  './src/modules/payments/controllers/paymentController',
  './src/modules/payments/routes/paymentRoutes',
  './src/modules/notifications/models/Notification',
  './src/modules/notifications/services/notificationService',
  './src/modules/notifications/controllers/notificationController',
  './src/modules/notifications/routes/notificationRoutes',
  './src/modules/dashboard/services/dashboardService',
  './src/modules/dashboard/controllers/dashboardController',
  './src/modules/dashboard/routes/dashboardRoutes',
  './src/modules/admin/services/adminService',
  './src/modules/admin/controllers/adminController',
  './src/modules/admin/routes/adminRoutes',
];

let allPassed = true;
for (const mod of modules) {
  try {
    require(mod);
    console.log(`✓ ${mod}`);
  } catch (e) {
    console.error(`✗ ${mod}: ${e.message}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n✅ All modules loaded successfully');
} else {
  console.log('\n❌ Some modules failed to load');
  process.exit(1);
}

