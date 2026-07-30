/**
 * CourtFlow — Auth Validation Schemas (Zod)
 * All request validation for auth endpoints lives here.
 */

const { z } = require('zod');

// ─── Register ──────────────────────────────────────────
const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .trim(),
    email: z
      .string()
      .email('Please provide a valid email')
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

// ─── Login ─────────────────────────────────────────────
const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email')
      .transform((email) => email.toLowerCase()),
    password: z.string().min(1, 'Password is required'),
  }),
});

// ─── Forgot Password ───────────────────────────────────
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email')
      .transform((email) => email.toLowerCase()),
  }),
});

// ─── Reset Password ────────────────────────────────────
const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'Reset token is required'),
  }),
  body: z.object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

// ─── Refresh Token ─────────────────────────────────────
const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

// ─── Update Profile ────────────────────────────────────
const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim().optional(),
    phone: z.string().nullable().optional(),
    avatar: z.string().url().nullable().optional(),
    preferences: z.object({
      notifications: z.object({
        email: z.boolean().optional(),
        inApp: z.boolean().optional(),
      }).optional(),
      theme: z.enum(['light', 'dark', 'system']).optional(),
    }).optional(),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
  updateProfileSchema,
};

