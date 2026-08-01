/**
 * Booking Platform — Design Tokens
 * Reusable design system constants for consistent UI
 */

export const colors = {
  // Primary palette
  primary: {
    50: '#fef7ee',
    100: '#fdedd3',
    200: '#f9d7a5',
    300: '#f5ba6d',
    400: '#f0933f',
    500: '#ec7a1a',
    600: '#dd6110',
    700: '#b74810',
    800: '#923915',
    900: '#763015',
  },
  // Surface / Background
  surface: {
    bg: '#0f1420',
    card: '#151b27',
    elevated: '#1a1f2e',
    overlay: '#1e2538',
    border: 'rgba(255,255,255,0.06)',
    borderLight: 'rgba(255,255,255,0.1)',
  },
  // Text
  text: {
    primary: '#f0e8d8',
    secondary: 'rgba(232,226,212,0.55)',
    muted: 'rgba(232,226,212,0.35)',
    accent: '#C08A5D',
  },
  // State colors
  state: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  // Booking statuses
  status: {
    confirmed: '#22c55e',
    pending: '#f59e0b',
    cancelled: '#ef4444',
    completed: '#3b82f6',
    available: '#22c55e',
    unavailable: '#6b7280',
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
};

export const radius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.3)',
  md: '0 4px 12px rgba(0,0,0,0.4)',
  lg: '0 8px 24px rgba(0,0,0,0.5)',
  xl: '0 12px 40px rgba(0,0,0,0.6)',
  glow: '0 0 20px rgba(192,138,93,0.15)',
};

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
};

const tokens = { colors, spacing, typography, radius, shadows, transitions };
export default tokens;

