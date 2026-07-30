/**
 * CourtFlow — Courts Service
 * All court business logic.
 */

const Court = require('../models/Court');
const Club = require('../../clubs/models/Club');
const { NotFoundError, AuthorizationError } = require('../../../shared/errors');
const { ROLES } = require('../../../shared/constants');

/**
 * List courts for a club.
 */
const listCourts = async (clubId) => {
  const club = await Club.findActiveById(clubId);
  if (!club) {
    throw new NotFoundError('Club');
  }

  const courts = await Court.findByClub(clubId);
  return courts;
};

/**
 * Get court by ID.
 */
const getCourt = async (courtId) => {
  const court = await Court.findActiveById(courtId).populate('club', 'name');
  if (!court) {
    throw new NotFoundError('Court');
  }
  return court;
};

/**
 * Create a court in a club.
 */
const createCourt = async (clubId, userId, userRole, data) => {
  const club = await Club.findActiveById(clubId);
  if (!club) {
    throw new NotFoundError('Club');
  }

  // Check authorization
  if (club.owner.toString() !== userId && userRole !== ROLES.SUPER_ADMIN) {
    throw new AuthorizationError('You do not own this club');
  }

  const court = await Court.create({
    ...data,
    club: clubId,
  });

  return court;
};

/**
 * Update a court.
 */
const updateCourt = async (courtId, userId, userRole, updateData) => {
  const court = await Court.findActiveById(courtId);
  if (!court) {
    throw new NotFoundError('Court');
  }

  // Check authorization via club ownership
  const club = await Club.findActiveById(court.club);
  if (club.owner.toString() !== userId && userRole !== ROLES.SUPER_ADMIN) {
    throw new AuthorizationError('You do not own this club');
  }

  const allowedFields = [
    'name', 'description', 'surface', 'hourlyRate', 'currency',
    'image', 'features', 'capacity', 'status', 'sortOrder',
    'maintenanceSchedule',
  ];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      court[field] = updateData[field];
    }
  }

  await court.save();
  return court;
};

/**
 * Soft-delete a court.
 */
const deleteCourt = async (courtId, userId, userRole) => {
  const court = await Court.findActiveById(courtId);
  if (!court) {
    throw new NotFoundError('Court');
  }

  const club = await Club.findActiveById(court.club);
  if (club.owner.toString() !== userId && userRole !== ROLES.SUPER_ADMIN) {
    throw new AuthorizationError('You do not own this club');
  }

  court.deletedAt = new Date();
  court.status = 'closed';
  await court.save();

  return court;
};

/**
 * Get court availability for a specific date.
 */
const getAvailability = async (courtId, date, duration = 60) => {
  const court = await Court.findActiveById(courtId);
  if (!court) {
    throw new NotFoundError('Court');
  }

  // Get existing bookings for this court on this date
  const Booking = require('../../bookings/models/Booking');
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const bookings = await Booking.find({
    court: courtId,
    startTime: { $gte: dayStart, $lte: dayEnd },
    status: { $nin: ['cancelled', 'no-show'] },
  });

  // Generate time slots
  const slots = court.generateTimeSlots(date, bookings);

  return {
    courtId: court._id,
    courtName: court.name,
    date,
    hourlyRate: court.hourlyRate,
    currency: court.currency,
    status: court.status,
    isUnderMaintenance: court.isUnderMaintenance(date),
    slots,
    totalSlots: slots.length,
    availableSlots: slots.filter((s) => s.available).length,
  };
};

module.exports = {
  listCourts,
  getCourt,
  createCourt,
  updateCourt,
  deleteCourt,
  getAvailability,
};

