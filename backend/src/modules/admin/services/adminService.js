/**
 * CourtFlow — Admin Service
 * Platform administration: user management, club oversight, analytics.
 */

const User = require('../../auth/models/User');
const Club = require('../../clubs/models/Club');
const Booking = require('../../bookings/models/Booking');
const Payment = require('../../payments/models/Payment');
const { NotFoundError } = require('../../../shared/errors');
const { ROLES, BOOKING_STATUS, PAYMENT_STATUS, USER_STATUS } = require('../../../shared/constants');

/**
 * List all users with pagination.
 */
const listUsers = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { deletedAt: null };
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshTokens -verificationToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

/**
 * Suspend a user.
 */
const suspendUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: USER_STATUS.SUSPENDED },
    { new: true }
  ).select('-password -refreshTokens -verificationToken');

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};

/**
 * Activate a suspended user.
 */
const activateUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: USER_STATUS.ACTIVE },
    { new: true }
  ).select('-password -refreshTokens -verificationToken');

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};

/**
 * List all clubs with pagination.
 */
const listAllClubs = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { deletedAt: null };
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }

  const [clubs, total] = await Promise.all([
    Club.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Club.countDocuments(filter),
  ]);

  return {
    clubs,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

/**
 * Get platform analytics.
 */
const getAnalytics = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalClubs,
    totalCourts,
    totalBookings,
    totalRevenue,
    bookingsToday,
    usersByRole,
    clubsByStatus,
  ] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    Club.countDocuments({ deletedAt: null }),
    require('../../courts/models/Court').countDocuments({ deletedAt: null }),
    Booking.countDocuments({ deletedAt: null }),
    Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Booking.countDocuments({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      status: { $nin: [BOOKING_STATUS.CANCELLED] },
    }),
    User.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    Club.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  return {
    totalUsers,
    totalClubs,
    totalCourts,
    totalBookings,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    bookingsToday,
    usersByRole,
    clubsByStatus,
  };
};

module.exports = {
  listUsers,
  suspendUser,
  activateUser,
  listAllClubs,
  getAnalytics,
};

