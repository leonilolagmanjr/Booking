/**
 * CourtFlow — Tennis Ball Icon (replaces missing lucide-react icon)
 * Custom SVG that matches the CourtFlow branding.
 */
import React from 'react';

export const TennisBallIcon = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20" />
    <path d="M12 2a14.5 14.5 0 0 1 0 20" />
    <path d="M2 12h20" />
  </svg>
);

export default TennisBallIcon;

