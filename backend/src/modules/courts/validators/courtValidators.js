/**
 * CourtFlow — Court Validation Schemas (Zod)
 */

const { z } = require('zod');
const { COURT_SURFACES, COURT_STATUS, COURT_FEATURES } = require('../../../shared/constants');

// ─── Create Court ──────────────────────────────────────
const createCourtSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Court name is required')
      .max(100, 'Name must be at most 100 characters')
      .trim(),
    description: z.string().max(500).trim().optional(),
    surface: z.enum(Object.values(COURT_SURFACES), {
      errorMap: () => ({ message: 'Surface must be indoor or outdoor' }),
    }),
    hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
    currency: z.string().length(3).optional().default('PHP'),
    image: z.string().url().nullable().optional(),
    features: z.array(z.enum(Object.values(COURT_FEATURES))).optional(),
    capacity: z.number().min(1).max(10).optional().default(4),
    status: z.enum(Object.values(COURT_STATUS)).optional().default('available'),
    sortOrder: z.number().int().optional().default(0),
  }),
});

// ─── Update Court ──────────────────────────────────────
const updateCourtSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).trim().optional(),
    description: z.string().max(500).trim().optional(),
    surface: z.enum(Object.values(COURT_SURFACES)).optional(),
    hourlyRate: z.number().min(0).optional(),
    currency: z.string().length(3).optional(),
    image: z.string().url().nullable().optional(),
    features: z.array(z.enum(Object.values(COURT_FEATURES))).optional(),
    capacity: z.number().min(1).max(10).optional(),
    status: z.enum(Object.values(COURT_STATUS)).optional(),
    sortOrder: z.number().int().optional(),
    maintenanceSchedule: z
      .array(
        z.object({
          startDate: z.string().datetime(),
          endDate: z.string().datetime(),
          reason: z.string().optional(),
        })
      )
      .optional(),
  }),
});

// ─── Availability Query ────────────────────────────────
const availabilityQuerySchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    duration: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().min(15).max(480))
      .optional(),
  }),
});

// ─── Club ID Param ─────────────────────────────────────
const clubIdParamSchema = z.object({
  params: z.object({
    clubId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid club ID'),
  }),
});

// ─── Court ID Param ────────────────────────────────────
const courtIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid court ID'),
  }),
});

module.exports = {
  createCourtSchema,
  updateCourtSchema,
  availabilityQuerySchema,
  clubIdParamSchema,
  courtIdParamSchema,
};

