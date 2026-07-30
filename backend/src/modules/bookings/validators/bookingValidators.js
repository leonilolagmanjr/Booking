/**
 * CourtFlow — Booking Validation Schemas (Zod)
 */

const { z } = require('zod');
const { BOOKING_STATUS } = require('../../../shared/constants');

// ─── Create Booking ────────────────────────────────────
const createBookingSchema = z.object({
  body: z.object({
    clubId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid club ID'),
    courtId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid court ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: z.string().datetime({ message: 'Start time must be an ISO datetime' }),
    endTime: z.string().datetime({ message: 'End time must be an ISO datetime' }),
    notes: z.string().max(500).optional(),
  }).refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    { message: 'End time must be after start time', path: ['endTime'] }
  ),
});

// ─── Cancel Booking ────────────────────────────────────
const cancelBookingSchema = z.object({
  body: z.object({
    reason: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID'),
  }),
});

// ─── Reschedule Booking ────────────────────────────────
const rescheduleBookingSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: z.string().datetime({ message: 'Start time must be an ISO datetime' }),
    endTime: z.string().datetime({ message: 'End time must be an ISO datetime' }),
  }).refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    { message: 'End time must be after start time', path: ['endTime'] }
  ),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID'),
  }),
});

// ─── Booking ID Param ──────────────────────────────────
const bookingIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID'),
  }),
});

// ─── List Bookings Query ───────────────────────────────
const listBookingsQuerySchema = z.object({
  query: z.object({
    club: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    court: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    status: z.enum(Object.values(BOOKING_STATUS)).optional(),
    player: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
    sort: z.string().optional(),
  }),
});

// ─── Check Conflict Query ──────────────────────────────
const checkConflictSchema = z.object({
  query: z.object({
    court: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid court ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    startTime: z.string().datetime({ message: 'Start time must be an ISO datetime' }),
    endTime: z.string().datetime({ message: 'End time must be an ISO datetime' }),
    excludeBookingId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
});

module.exports = {
  createBookingSchema,
  cancelBookingSchema,
  rescheduleBookingSchema,
  bookingIdParamSchema,
  listBookingsQuerySchema,
  checkConflictSchema,
};

