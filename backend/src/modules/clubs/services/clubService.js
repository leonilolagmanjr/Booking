/**
 * CourtFlow — Clubs Service
 * All club business logic.
 */

const Club = require('../models/Club');
const User = require('../../auth/models/User');
const { NotFoundError, AuthorizationError, ConflictError } = require('../../../shared/errors');
const { ROLES, CLUB_STATUS } = require('../../../shared/constants');

/**
 * Generate default operating hours.
 */
const generateDefaultHours = () => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days.map((day, i) => ({
    day,
    open: '06:00',
    close: '22:00',
    isClosed: i >= 5, // saturday and sunday closed by default? no, let's make all days open
  })).map((h) => ({ ...h, isClosed: false })); // all days open by default
};

/**
 * List all active clubs (public).
 */
const listClubs = async (query = {}) => {
  const filter = { deletedAt: null, status: CLUB_STATUS.ACTIVE };

  if (query.city) {
    filter['address.city'] = { $regex: query.city, $options: 'i' };
  }
  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }

  const clubs = await Club.find(filter)
    .populate('owner', 'name email avatar')
    .sort({ name: 1 });

  return clubs;
};

/**
 * Get club by ID (public).
 */
const getClub = async (clubId) => {
  const club = await Club.findActiveById(clubId)
    .populate('owner', 'name email avatar phone');

  if (!club) {
    throw new NotFoundError('Club');
  }

  return club;
};

/**
 * Create a new club.
 */
const createClub = async (ownerId, data) => {
  // Set default operating hours if not provided
  if (!data.operatingHours) {
    data.operatingHours = generateDefaultHours();
  }

  const club = await Club.create({
    ...data,
    owner: ownerId,
  });

  // Add club to user's owned clubs
  await User.findByIdAndUpdate(ownerId, {
    $push: { ownedClubs: club._id },
  });

  return club;
};

/**
 * Update a club.
 */
const updateClub = async (clubId, userId, userRole, updateData) => {
  const club = await Club.findActiveById(clubId);
  if (!club) {
    throw new NotFoundError('Club');
  }

  // Only owner or super admin can update
  if (club.owner.toString() !== userId && userRole !== ROLES.SUPER_ADMIN) {
    throw new AuthorizationError('You do not own this club');
  }

  // Fields that can be updated
  const allowedFields = [
    'name', 'description', 'address', 'phone', 'email',
    'logo', 'coverImage', 'operatingHours', 'settings', 'status',
  ];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      club[field] = updateData[field];
    }
  }

  await club.save();
  return club;
};

/**
 * Soft-delete a club.
 */
const deleteClub = async (clubId, userId, userRole) => {
  const club = await Club.findActiveById(clubId);
  if (!club) {
    throw new NotFoundError('Club');
  }

  if (club.owner.toString() !== userId && userRole !== ROLES.SUPER_ADMIN) {
    throw new AuthorizationError('You do not own this club');
  }

  club.deletedAt = new Date();
  club.status = CLUB_STATUS.INACTIVE;
  await club.save();

  // Remove club from owner's list
  await User.findByIdAndUpdate(userId, {
    $pull: { ownedClubs: club._id },
  });

  return club;
};

/**
 * Get club stats for owner dashboard.
 */
const getClubStats = async (clubId, userId, userRole) => {
  const club = await Club.findActiveById(clubId);
  if (!club) {
    throw new NotFoundError('Club');
  }

  // Only owner, staff, or super admin can view stats
  if (
    club.owner.toString() !== userId &&
    userRole !== ROLES.SUPER_ADMIN &&
    userRole !== ROLES.STAFF
  ) {
    throw new AuthorizationError('Access denied');
  }

  // Stats will be populated from bookings in Stage 4
  const Booking = require('../../bookings/models/Booking');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalCourts, todayBookings, revenue] = await Promise.all([
    require('../../courts/models/Court').countDocuments({ club: clubId, deletedAt: null }),
    Booking.countDocuments({
      club: clubId,
      date: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' },
    }),
    Booking.aggregate([
      {
        $match: {
          club: club._id,
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]),
  ]);

  return {
    clubId: club._id,
    clubName: club.name,
    totalCourts,
    todayBookings,
    revenue: revenue.length > 0 ? revenue[0].total : 0,
  };
};

module.exports = {
  listClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub,
  getClubStats,
};

