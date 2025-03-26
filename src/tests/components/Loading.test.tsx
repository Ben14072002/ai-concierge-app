import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loading } from '@/components/common/Loading';
import { useTranslation } from 'react-i18next';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('Loading', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders default loading spinner', () => {
    render(<Loading />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Custom loading message';
    render(<Loading message={customMessage} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders without message when showMessage is false', () => {
    render(<Loading showMessage={false} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<Loading size="lg" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('renders with custom color', () => {
    render(<Loading color="blue" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-blue-500');
  });

  it('renders with custom className', () => {
    const customClass = 'custom-loading-class';
    render(<Loading className={customClass} />);

    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('renders with full screen overlay', () => {
    render(<Loading fullScreen />);

    const overlay = screen.getByRole('status').parentElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50');
  });

  it('renders with custom overlay color', () => {
    render(<Loading fullScreen overlayColor="bg-white" />);

    const overlay = screen.getByRole('status').parentElement;
    expect(overlay).toHaveClass('bg-white');
  });

  it('renders with custom overlay opacity', () => {
    render(<Loading fullScreen overlayOpacity={75} />);

    const overlay = screen.getByRole('status').parentElement;
    expect(overlay).toHaveClass('bg-opacity-75');
  });

  it('renders with custom z-index', () => {
    render(<Loading fullScreen zIndex={100} />);

    const overlay = screen.getByRole('status').parentElement;
    expect(overlay).toHaveClass('z-100');
  });

  it('renders with custom animation duration', () => {
    render(<Loading animationDuration={2000} />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ animationDuration: '2000ms' });
  });

  it('renders with custom animation timing function', () => {
    render(<Loading animationTimingFunction="ease-in-out" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ animationTimingFunction: 'ease-in-out' });
  });

  it('renders with custom animation delay', () => {
    render(<Loading animationDelay={500} />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ animationDelay: '500ms' });
  });

  it('renders with custom animation iteration count', () => {
    render(<Loading animationIterationCount={3} />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ animationIterationCount: '3' });
  });

  it('renders with custom animation direction', () => {
    render(<Loading animationDirection="alternate" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ animationDirection: 'alternate' });
  });

  it('renders with custom animation fill mode', () => {
    render(<Loading animationFillMode="forwards" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle({ animationFillMode: 'forwards' });
  });
}); 