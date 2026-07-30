/**
 * CourtFlow — Club Validation Schemas (Zod)
 */

const { z } = require('zod');
const { DAYS_OF_WEEK, CANCELLATION_POLICIES } = require('../../../shared/constants');

// ─── Operating Hours ───────────────────────────────────
const operatingHourSchema = z.object({
  day: z.enum(DAYS_OF_WEEK),
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  isClosed: z.boolean().optional().default(false),
});

// ─── Create Club ───────────────────────────────────────
const createClubSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim(),
    description: z.string().max(2000).trim().optional(),
    address: z
      .object({
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        zip: z.string().trim().optional(),
        coordinates: z
          .object({
            lat: z.number().min(-90).max(90).optional(),
            lng: z.number().min(-180).max(180).optional(),
          })
          .optional(),
      })
      .optional(),
    phone: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    logo: z.string().url().nullable().optional(),
    coverImage: z.string().url().nullable().optional(),
    operatingHours: z
      .array(operatingHourSchema)
      .length(7, 'Operating hours must cover all 7 days')
      .optional(),
    settings: z
      .object({
        defaultBookingDuration: z.number().min(15).max(480).optional(),
        maxAdvanceDays: z.number().min(1).max(365).optional(),
        cancellationPolicy: z.enum(Object.values(CANCELLATION_POLICIES)).optional(),
        cancellationDeadline: z.number().min(1).max(168).optional(),
        allowGuestBookings: z.boolean().optional(),
      })
      .optional(),
  }),
});

// ─── Update Club ───────────────────────────────────────
const updateClubSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    description: z.string().max(2000).trim().optional(),
    address: z
      .object({
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        zip: z.string().trim().optional(),
        coordinates: z
          .object({
            lat: z.number().min(-90).max(90).optional(),
            lng: z.number().min(-180).max(180).optional(),
          })
          .optional(),
      })
      .optional(),
    phone: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    logo: z.string().url().nullable().optional(),
    coverImage: z.string().url().nullable().optional(),
    operatingHours: z
      .array(operatingHourSchema)
      .length(7, 'Operating hours must cover all 7 days')
      .optional(),
    settings: z
      .object({
        defaultBookingDuration: z.number().min(15).max(480).optional(),
        maxAdvanceDays: z.number().min(1).max(365).optional(),
        cancellationPolicy: z.enum(Object.values(CANCELLATION_POLICIES)).optional(),
        cancellationDeadline: z.number().min(1).max(168).optional(),
        allowGuestBookings: z.boolean().optional(),
      })
      .optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

// ─── Club ID Param ─────────────────────────────────────
const clubIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid club ID'),
  }),
});

module.exports = {
  createClubSchema,
  updateClubSchema,
  clubIdParamSchema,
};

