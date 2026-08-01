import React from 'react';
import { cn } from '../../utils/cn';

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-[3px]',
};

export const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-[#C08A5D] border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="xl" />
  </div>
);

