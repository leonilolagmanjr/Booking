/**
 * CourtFlow — Dashboard Service
 * Owner and player dashboard data aggregation.
 */

const Booking = require('../../bookings/models/Booking');
const Court = require('../../courts/models/Court');
const Club = require('../../clubs/models/Club');
const User = require('../../auth/models/User');
const { NotFoundError } = require('../../../shared/errors');
const { ROLES, BOOKING_STATUS, PAYMENT_STATUS } = require('../../../shared/constants');

/**
 * Get owner dashboard data.
 */
const getOwnerDashboard = async (userId) => {
  const clubs = await Club.findByOwner(userId);

  if (clubs.length === 0) {
    return {
      clubs: [],
      totalCourts: 0,
      todayBookings: 0,
      weeklyRevenue: 0,
      activePlayers: 0,
      courtUtilization: 0,
      recentBookings: [],
      upcomingBookings: [],
    };
  }

  const clubIds = clubs.map((c) => c._id);

  // Today's date boundaries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Week boundaries
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [
    totalCourts,
    todayBookings,
    weeklyRevenueResult,
    recentBookings,
    upcomingBookings,
  ] = await Promise.all([
    Court.countDocuments({ club: { $in: clubIds }, deletedAt: null }),
    Booking.countDocuments({
      club: { $in: clubIds },
      date: { $gte: today, $lt: tomorrow },
      status: { $nin: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.NO_SHOW] },
    }),
    Booking.aggregate([
      {
        $match: {
          club: { $in: clubIds },
          paymentStatus: PAYMENT_STATUS.PAID,
          createdAt: { $gte: weekStart, $lt: weekEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]),
    Booking.find({
      club: { $in: clubIds },
      status: BOOKING_STATUS.CONFIRMED,
      startTime: { $gte: today, $lt: tomorrow },
    })
      .populate('player', 'name avatar')
      .populate('court', 'name')
      .sort({ startTime: 1 })
      .limit(10),
    Booking.find({
      club: { $in: clubIds },
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
      startTime: { $gte: tomorrow },
    })
      .populate('player', 'name avatar')
      .populate('court', 'name')
      .sort({ startTime: 1 })
      .limit(10),
  ]);

  // Calculate court utilization
  const totalSlotsToday = totalCourts * 16; // 16 hourly slots (6AM-10PM)
  const utilization = totalSlotsToday > 0
    ? Math.round((todayBookings / totalSlotsToday) * 100)
    : 0;

  // Get active players (unique players who booked this week)
  const activePlayersResult = await Booking.distinct('player', {
    club: { $in: clubIds },
    startTime: { $gte: weekStart, $lt: weekEnd },
    status: { $nin: [BOOKING_STATUS.CANCELLED] },
  });

  return {
    clubs: clubs.map((c) => ({ id: c._id, name: c.name, status: c.status })),
    totalCourts,
    todayBookings,
    weeklyRevenue: weeklyRevenueResult.length > 0 ? weeklyRevenueResult[0].total : 0,
    activePlayers: activePlayersResult.length,
    courtUtilization: utilization,
    recentBookings,
    upcomingBookings,
  };
};

/**
 * Get player dashboard data.
 */
const getPlayerDashboard = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    upcomingBookings,
    bookingHistory,
    totalBookings,
    savedClubs,
  ] = await Promise.all([
    Booking.find({
      player: userId,
      startTime: { $gte: today },
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
      deletedAt: null,
    })
      .populate('court', 'name surface hourlyRate')
      .populate('club', 'name address logo')
      .sort({ startTime: 1 })
      .limit(5),
    Booking.find({
      player: userId,
      deletedAt: null,
    })
      .populate('court', 'name')
      .populate('club', 'name')
      .sort({ createdAt: -1 })
      .limit(10),
    Booking.countDocuments({ player: userId, deletedAt: null }),
    User.findById(userId).select('savedClubs').populate('savedClubs', 'name logo address'),
  ]);

  return {
    upcomingBookings,
    bookingHistory,
    totalBookings,
    savedClubs: savedClubs ? savedClubs.savedClubs : [],
  };
};

module.exports = {
  getOwnerDashboard,
  getPlayerDashboard,
};

