/**
 * CourtFlow — Card Component
 */

import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`
        bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl
        ${hover ? 'hover:border-amber-600/30 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-700/50 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-700/50 ${className}`}>{children}</div>
);

