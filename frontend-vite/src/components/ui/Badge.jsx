/**
 * CourtFlow — Badge Component
 */

import React from 'react';

const colors = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  yellow: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  red: 'bg-red-500/15 text-red-400 border-red-500/25',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  gray: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
};

export const Badge = ({ children, color = 'gray', className = '', dot = false }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
        border ${colors[color]} ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {children}
    </span>
  );
};

// Status badge presets
export const StatusBadge = ({ status }) => {
  const map = {
    active: { color: 'green', label: 'Active' },
    inactive: { color: 'gray', label: 'Inactive' },
    confirmed: { color: 'green', label: 'Confirmed' },
    pending: { color: 'yellow', label: 'Pending' },
    cancelled: { color: 'red', label: 'Cancelled' },
    completed: { color: 'blue', label: 'Completed' },
    'in-progress': { color: 'purple', label: 'In Progress' },
    'no-show': { color: 'red', label: 'No Show' },
    paid: { color: 'green', label: 'Paid' },
    unpaid: { color: 'yellow', label: 'Unpaid' },
    refunded: { color: 'purple', label: 'Refunded' },
    available: { color: 'green', label: 'Available' },
    maintenance: { color: 'yellow', label: 'Maintenance' },
    closed: { color: 'red', label: 'Closed' },
    open: { color: 'green', label: 'Open' },
  };

  const config = map[status] || { color: 'gray', label: status };
  return <Badge color={config.color} dot>{config.label}</Badge>;
};

