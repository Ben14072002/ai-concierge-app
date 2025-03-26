import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  const variantClasses = {
    text: 'h-4 w-full',
    rectangular: '',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style = {
    width: width || '100%',
    height: height || '1rem',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <div className="space-y-2">
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton width={100} />
        <Skeleton width={80} />
      </div>
    </div>
  );
};

export const BookingListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton width="40%" />
            <Skeleton width="20%" />
          </div>
          <div className="space-y-2">
            <Skeleton width="60%" />
            <Skeleton width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}; 