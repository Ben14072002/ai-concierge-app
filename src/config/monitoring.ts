import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';
import type { PerformanceTrace } from '@firebase/performance-types';

// Sentry Konfiguration
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Performance Monitoring
const performance = getPerformance();
const analytics = getAnalytics();

// Performance Tracing
export const startTrace = (traceName: string): PerformanceTrace => {
  return trace(performance, traceName);
};

// Error Tracking
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
  logEvent(analytics, 'error', {
    error_message: error.message,
    error_stack: error.stack,
    ...context,
  });
};

// User Analytics
export const trackUserAction = (action: string, params?: Record<string, any>) => {
  logEvent(analytics, action, params);
};

export const setUserAnalytics = (userId: string, userProperties: Record<string, any>) => {
  setUserProperties(analytics, {
    user_id: userId,
    ...userProperties,
  });
};

// Performance Metrics
export const trackPerformanceMetric = (metric: string, value: number) => {
  logEvent(analytics, 'performance_metric', {
    metric_name: metric,
    value,
    timestamp: new Date().toISOString(),
  });
};

// Page Views
export const trackPageView = (page: string) => {
  logEvent(analytics, 'page_view', {
    page_title: page,
    page_location: window.location.href,
    timestamp: new Date().toISOString(),
  });
};

// Custom Events
export const trackBookingEvent = (event: string, bookingId: string, params?: Record<string, any>) => {
  logEvent(analytics, `booking_${event}`, {
    booking_id: bookingId,
    ...params,
  });
};

// Error Boundary
export const ErrorBoundary = Sentry.ErrorBoundary; 