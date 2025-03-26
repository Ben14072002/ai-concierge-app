import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useTranslation } from 'react-i18next';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock Sentry
jest.mock('@sentry/react', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  showReportDialog: jest.fn(),
}));

describe('ErrorBoundary', () => {
  const mockError = new Error('Test error');
  const mockErrorInfo = {
    componentStack: 'Test component stack',
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.queryByText(/error-boundary-title/i)).not.toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    const ThrowError = () => {
      throw mockError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/error-boundary-title/i)).toBeInTheDocument();
    expect(screen.getByText(/error-boundary-message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try-again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report-error/i })).toBeInTheDocument();
  });

  it('handles try again button click', () => {
    const ThrowError = () => {
      throw mockError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByRole('button', { name: /try-again/i });
    fireEvent.click(tryAgainButton);

    expect(window.location.reload).toHaveBeenCalled();
  });

  it('handles report error button click', () => {
    const { showReportDialog } = require('@sentry/react');
    const ThrowError = () => {
      throw mockError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const reportButton = screen.getByRole('button', { name: /report-error/i });
    fireEvent.click(reportButton);

    expect(showReportDialog).toHaveBeenCalledWith({
      eventId: expect.any(String),
      dsn: expect.any(String),
    });
  });

  it('logs error to console in development', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const ThrowError = () => {
      throw mockError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error caught by error boundary:',
      mockError,
      mockErrorInfo
    );

    consoleSpy.mockRestore();
  });

  it('handles component stack trace', () => {
    const ThrowError = () => {
      throw mockError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const detailsButton = screen.getByRole('button', { name: /show-details/i });
    fireEvent.click(detailsButton);

    expect(screen.getByText(mockErrorInfo.componentStack)).toBeInTheDocument();
  });

  it('handles different error types', () => {
    const customError = new TypeError('Custom type error');
    const ThrowError = () => {
      throw customError;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/error-boundary-title/i)).toBeInTheDocument();
    expect(screen.getByText(/error-boundary-message/i)).toBeInTheDocument();
  });

  it('handles error without component stack', () => {
    const ThrowError = () => {
      throw mockError;
    };

    // @ts-ignore - Testing error without componentStack
    mockErrorInfo.componentStack = undefined;

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const detailsButton = screen.getByRole('button', { name: /show-details/i });
    fireEvent.click(detailsButton);

    expect(screen.getByText(/no-stack-trace/i)).toBeInTheDocument();
  });
}); 