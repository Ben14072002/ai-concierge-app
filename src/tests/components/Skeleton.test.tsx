import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton, PropertyCardSkeleton, BookingListSkeleton } from '@/components/common/Skeleton';
import { useTranslation } from 'react-i18next';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('Skeleton', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Base Skeleton Component', () => {
    it('renders with default props', () => {
      render(<Skeleton />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass(
        'animate-pulse',
        'bg-gray-200',
        'rounded',
        'h-4',
        'w-full'
      );
    });

    it('renders with custom width', () => {
      render(<Skeleton width="200px" />);

      expect(screen.getByRole('status')).toHaveStyle({ width: '200px' });
    });

    it('renders with custom height', () => {
      render(<Skeleton height="100px" />);

      expect(screen.getByRole('status')).toHaveStyle({ height: '100px' });
    });

    it('renders with custom className', () => {
      const customClass = 'custom-skeleton-class';
      render(<Skeleton className={customClass} />);

      expect(screen.getByRole('status')).toHaveClass(customClass);
    });

    it('renders with custom animation', () => {
      render(<Skeleton animation="none" />);

      expect(screen.getByRole('status')).not.toHaveClass('animate-pulse');
    });

    it('renders with custom variant', () => {
      render(<Skeleton variant="circular" />);

      expect(screen.getByRole('status')).toHaveClass('rounded-full');
    });

    it('renders with custom background color', () => {
      render(<Skeleton bgColor="bg-blue-200" />);

      expect(screen.getByRole('status')).toHaveClass('bg-blue-200');
    });
  });

  describe('PropertyCardSkeleton', () => {
    it('renders property card skeleton', () => {
      render(<PropertyCardSkeleton />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass(
        'property-card-skeleton',
        'animate-pulse',
        'bg-gray-200',
        'rounded-lg',
        'overflow-hidden'
      );
    });

    it('renders with custom className', () => {
      const customClass = 'custom-property-skeleton';
      render(<PropertyCardSkeleton className={customClass} />);

      expect(screen.getByRole('status')).toHaveClass(customClass);
    });

    it('renders with custom dimensions', () => {
      render(<PropertyCardSkeleton width="300px" height="400px" />);

      expect(screen.getByRole('status')).toHaveStyle({
        width: '300px',
        height: '400px',
      });
    });
  });

  describe('BookingListSkeleton', () => {
    it('renders booking list skeleton', () => {
      render(<BookingListSkeleton />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass(
        'booking-list-skeleton',
        'animate-pulse',
        'bg-gray-200',
        'rounded-lg',
        'space-y-4'
      );
    });

    it('renders with custom className', () => {
      const customClass = 'custom-booking-skeleton';
      render(<BookingListSkeleton className={customClass} />);

      expect(screen.getByRole('status')).toHaveClass(customClass);
    });

    it('renders with custom item count', () => {
      render(<BookingListSkeleton itemCount={5} />);

      const items = screen.getAllByRole('status');
      expect(items).toHaveLength(5);
    });

    it('renders with custom item height', () => {
      render(<BookingListSkeleton itemHeight="100px" />);

      const items = screen.getAllByRole('status');
      items.forEach((item) => {
        expect(item).toHaveStyle({ height: '100px' });
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Skeleton />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading...');
    });

    it('maintains accessibility with custom variants', () => {
      render(<Skeleton variant="circular" />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading...');
    });
  });

  describe('Performance', () => {
    it('renders efficiently with multiple instances', () => {
      const { container } = render(
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      );

      expect(container.children).toHaveLength(3);
      expect(screen.getAllByRole('status')).toHaveLength(3);
    });

    it('maintains performance with custom animations', () => {
      const { container } = render(
        <div>
          <Skeleton animation="none" />
          <Skeleton animation="pulse" />
          <Skeleton animation="wave" />
        </div>
      );

      expect(container.children).toHaveLength(3);
      expect(screen.getAllByRole('status')).toHaveLength(3);
    });
  });
}); 