/**
 * CourtFlow — Shared Constants
 * No magic strings. Every constant lives here.
 */

// ─── User Roles ────────────────────────────────────────
const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  CLUB_OWNER: 'club_owner',
  STAFF: 'staff',
  PLAYER: 'player',
});

const ROLES_ARRAY = Object.values(ROLES);

// ─── User Status ───────────────────────────────────────
const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
});

// ─── Court Surfaces ────────────────────────────────────
const COURT_SURFACES = Object.freeze({
  INDOOR: 'indoor',
  OUTDOOR: 'outdoor',
});

// ─── Court Status ──────────────────────────────────────
const COURT_STATUS = Object.freeze({
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance',
  CLOSED: 'closed',
});

// ─── Court Features ────────────────────────────────────
const COURT_FEATURES = Object.freeze({
  LIGHTS: 'lights',
  COVERED: 'covered',
  ACADEMY: 'academy',
  TOURNAMENT_GRADE: 'tournament_grade',
});

// ─── Booking Status ────────────────────────────────────
const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
});

// ─── Payment Status ────────────────────────────────────
const PAYMENT_STATUS = Object.freeze({
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
});

// ─── Payment Methods ───────────────────────────────────
const PAYMENT_METHODS = Object.freeze({
  GCASH: 'gcash',
  MAYA: 'maya',
  STRIPE: 'stripe',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
});

// ─── Club Status ───────────────────────────────────────
const CLUB_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
});

// ─── Notification Types ────────────────────────────────
const NOTIFICATION_TYPES = Object.freeze({
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_REMINDER: 'booking_reminder',
  BOOKING_RESCHEDULED: 'booking_rescheduled',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
  COURT_MAINTENANCE: 'court_maintenance',
  CLUB_UPDATE: 'club_update',
  SYSTEM: 'system',
});

// ─── Days of Week ──────────────────────────────────────
const DAYS_OF_WEEK = Object.freeze([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

// ─── Cancellation Policies ─────────────────────────────
const CANCELLATION_POLICIES = Object.freeze({
  FLEXIBLE: 'flexible',   // Free cancellation up to 24h before
  MODERATE: 'moderate',   // Free cancellation up to 12h before
  STRICT: 'strict',       // Free cancellation up to 6h before
});

// ─── Theme ──────────────────────────────────────────────
const THEMES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
});

// ─── Pagination ────────────────────────────────────────
const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

// ─── Time Constants (minutes) ──────────────────────────
const TIME = Object.freeze({
  MINUTES_IN_HOUR: 60,
  DEFAULT_BOOKING_DURATION: 60,
  MAX_ADVANCE_DAYS: 30,
  SLOT_INTERVAL: 30, // minutes between time slots
});

// ─── HTTP Status Codes ─────────────────────────────────
const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

module.exports = {
  ROLES,
  ROLES_ARRAY,
  USER_STATUS,
  COURT_SURFACES,
  COURT_STATUS,
  COURT_FEATURES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  CLUB_STATUS,
  NOTIFICATION_TYPES,
  DAYS_OF_WEEK,
  CANCELLATION_POLICIES,
  THEMES,
  PAGINATION,
  TIME,
  HTTP_STATUS,
};

