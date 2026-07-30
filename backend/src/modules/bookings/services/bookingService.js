/**
 * CourtFlow — Bookings Service
 * Core booking logic: create, cancel, reschedule, conflict detection.
 */

const Booking = require('../models/Booking');
const Court = require('../../courts/models/Court');
const Club = require('../../clubs/models/Club');
const {
  NotFoundError,
  AuthorizationError,
  ConflictError,
  AppError,
} = require('../../../shared/errors');
const { ROLES, BOOKING_STATUS, HTTP_STATUS } = require('../../../shared/constants');

/**
 * List bookings with optional filters.
 */
const listBookings = async (userId, userRole, query = {}) => {
  const filter = { deletedAt: null };

  // Role-based filtering
  if (userRole === ROLES.PLAYER) {
    filter.player = userId;
  } else if (userRole === ROLES.CLUB_OWNER || userRole === ROLES.STAFF) {
    // Staff/owner can see bookings for their clubs
    const clubs = await Club.findByOwner(userId);
    const clubIds = clubs.map((c) => c._id);
    if (userRole === ROLES.STAFF) {
      const user = await require('../../auth/models/User').findActiveById(userId);
      clubIds.push(...(user.staffClubs || []));
    }
    if (query.club) {
      filter.club = query.club;
    } else if (clubIds.length > 0) {
      filter.club = { $in: clubIds };
    }
  }

  // Apply filters
  if (query.court) filter.court = query.court;
  if (query.date) {
    const dayStart = new Date(query.date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(query.date);
    dayEnd.setHours(23, 59, 59, 999);
    filter.date = { $gte: dayStart, $lte: dayEnd };
  }
  if (query.status) filter.status = query.status;
  if (query.player && userRole !== ROLES.PLAYER) filter.player = query.player;

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const sort = query.sort || '-createdAt';

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('court', 'name surface')
      .populate('player', 'name email avatar')
      .populate('club', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get booking by ID.
 */
const getBooking = async (bookingId, userId, userRole) => {
  const booking = await Booking.findActiveById(bookingId)
    .populate('court', 'name surface hourlyRate')
    .populate('player', 'name email avatar')
    .populate('club', 'name address');

  if (!booking) {
    throw new NotFoundError('Booking');
  }

  // Authorization check
  if (
    booking.player._id.toString() !== userId &&
    userRole === ROLES.PLAYER
  ) {
    throw new AuthorizationError('You do not have access to this booking');
  }

  return booking;
};

/**
 * Create a new booking.
 */
const createBooking = async (playerId, data) => {
  const { clubId, courtId, date, startTime, endTime, notes } = data;

  // Verify club exists
  const club = await Club.findActiveById(clubId);
  if (!club) {
    throw new NotFoundError('Club');
  }

  // Verify court exists and belongs to club
  const court = await Court.findActiveById(courtId);
  if (!court || court.club.toString() !== clubId) {
    throw new NotFoundError('Court');
  }

  // Check if court is available
  if (court.status !== 'available') {
    throw new AppError('Court is not available', HTTP_STATUS.CONFLICT, 'COURT_NOT_AVAILABLE');
  }

  // Check court is not under maintenance
  if (court.isUnderMaintenance(date)) {
    throw new AppError('Court is under maintenance on this date', HTTP_STATUS.CONFLICT, 'COURT_MAINTENANCE');
  }

  // Validate start/end times
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMinutes = (end - start) / (1000 * 60);

  if (durationMinutes < 15 || durationMinutes > 480) {
    throw new AppError(
      'Booking duration must be between 15 minutes and 8 hours',
      HTTP_STATUS.BAD_REQUEST,
      'INVALID_DURATION'
    );
  }

  // Check for time conflicts
  const hasConflict = await Booking.hasConflict(courtId, date, startTime, endTime);
  if (hasConflict) {
    throw new ConflictError('This time slot is already booked');
  }

  // Calculate total amount
  const hours = durationMinutes / 60;
  const totalAmount = Math.round(court.hourlyRate * hours * 100) / 100;

  // Create booking
  const booking = await Booking.create({
    club: clubId,
    court: courtId,
    player: playerId,
    date: new Date(date),
    startTime: start,
    endTime: end,
    duration: durationMinutes,
    totalAmount,
    status: BOOKING_STATUS.CONFIRMED,
    notes: notes || null,
  });

  return booking;
};

/**
 * Cancel a booking.
 */
const cancelBooking = async (bookingId, userId, userRole, reason) => {
  const booking = await Booking.findActiveById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking');
  }

  // Authorization: player who owns booking, club owner, staff, or admin
  const isPlayer = booking.player.toString() === userId;
  const court = await Court.findActiveById(booking.court);
  const club = await Club.findActiveById(court ? court.club : null);
  const isOwner = club && club.owner.toString() === userId;
  const isStaff = userRole === ROLES.STAFF;
  const isAdmin = userRole === ROLES.SUPER_ADMIN;

  if (!isPlayer && !isOwner && !isStaff && !isAdmin) {
    throw new AuthorizationError('You cannot cancel this booking');
  }

  // Check if booking can be cancelled
  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new AppError('Booking is already cancelled', HTTP_STATUS.BAD_REQUEST, 'ALREADY_CANCELLED');
  }

  if (booking.status === BOOKING_STATUS.COMPLETED) {
    throw new AppError('Cannot cancel a completed booking', HTTP_STATUS.BAD_REQUEST, 'ALREADY_COMPLETED');
  }

  await booking.cancel(userId, reason);
  return booking;
};

/**
 * Reschedule a booking.
 */
const rescheduleBooking = async (bookingId, userId, data) => {
  const booking = await Booking.findActiveById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking');
  }

  // Only the player can reschedule
  if (booking.player.toString() !== userId) {
    throw new AuthorizationError('You can only reschedule your own bookings');
  }

  // Check if booking can be rescheduled
  if (!booking.canReschedule()) {
    throw new AppError(
      'Booking cannot be rescheduled. Only pending or confirmed future bookings can be rescheduled.',
      HTTP_STATUS.BAD_REQUEST,
      'CANNOT_RESCHEDULE'
    );
  }

  const { date, startTime, endTime } = data;

  // Check for conflicts (excluding this booking)
  const hasConflict = await Booking.hasConflict(
    booking.court,
    date,
    startTime,
    endTime,
    bookingId
  );

  if (hasConflict) {
    throw new ConflictError('The new time slot conflicts with an existing booking');
  }

  // Create new booking with reference to old one
  const court = await Court.findActiveById(booking.court);
  const durationMinutes = (new Date(endTime) - new Date(startTime)) / (1000 * 60);
  const hours = durationMinutes / 60;
  const totalAmount = Math.round(court.hourlyRate * hours * 100) / 100;

  const newBooking = await Booking.create({
    club: booking.club,
    court: booking.court,
    player: booking.player,
    date: new Date(date),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    duration: durationMinutes,
    totalAmount,
    status: BOOKING_STATUS.CONFIRMED,
    rescheduledFrom: booking._id,
  });

  // Mark old booking as rescheduled
  booking.rescheduledTo = newBooking._id;
  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancellation = {
    reason: 'Rescheduled',
    cancelledBy: userId,
    cancelledAt: new Date(),
  };
  await booking.save();

  return newBooking;
};

/**
 * Check for time conflicts (public).
 */
const checkConflict = async (courtId, date, startTime, endTime, excludeBookingId) => {
  const hasConflict = await Booking.hasConflict(courtId, date, startTime, endTime, excludeBookingId);
  return { hasConflict };
};

/**
 * Get player's upcoming bookings.
 */
const getUpcomingBookings = async (playerId) => {
  const now = new Date();
  return Booking.find({
    player: playerId,
    startTime: { $gte: now },
    status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] },
    deletedAt: null,
  })
    .populate('court', 'name surface hourlyRate')
    .populate('club', 'name address')
    .sort({ startTime: 1 })
    .limit(10);
};

/**
 * Get player's booking history.
 */
const getBookingHistory = async (playerId) => {
  return Booking.find({
    player: playerId,
    deletedAt: null,
  })
    .populate('court', 'name surface')
    .populate('club', 'name')
    .sort({ createdAt: -1 })
    .limit(20);
};

module.exports = {
  listBookings,
  getBooking,
  createBooking,
  cancelBooking,
  rescheduleBooking,
  checkConflict,
  getUpcomingBookings,
  getBookingHistory,
};

