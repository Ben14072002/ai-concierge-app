import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';
import type { PerformanceTrace } from '@firebase/performance-types';

// Performance Monitoring Setup
const performance = getPerformance();
const analytics = getAnalytics();

// Web Vitals Tracking
export const trackWebVitals = (metric: {
  name: string;
  value: number;
  delta: number;
  id: string;
}) => {
  const { name, value } = metric;
  
  // Sende Metriken an Firebase Analytics
  logEvent(analytics, name, {
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    page: window.location.pathname
  });
};

// Performance Tracing
export const startTrace = (traceName: string): PerformanceTrace => {
  return trace(performance, traceName);
};

// Ladezeiten-Monitoring
export const trackPageLoad = () => {
  const entries = window.performance.getEntriesByType('navigation');
  if (entries.length > 0) {
    const navigationTiming = entries[0] as PerformanceNavigationTiming;
    logEvent(analytics, 'page_load', {
      dns_lookup: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
      tcp_connection: navigationTiming.connectEnd - navigationTiming.connectStart,
      server_response: navigationTiming.responseEnd - navigationTiming.requestStart,
      dom_load: navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime,
      full_load: navigationTiming.loadEventEnd - navigationTiming.startTime
    });
  }
};

// Ressourcen-Performance
export const trackResourcePerformance = () => {
  const entries = window.performance.getEntriesByType('resource');
  entries.forEach((entry) => {
    const resource = entry as PerformanceResourceTiming;
    logEvent(analytics, 'resource_load', {
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType
    });
  });
};

interface NetworkInformation {
  effectiveType?: string;
}

// Benutzer-Performance-Eigenschaften
export const setPerformanceProperties = (userId: string) => {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  
  setUserProperties(analytics, {
    user_id: userId,
    connection_type: connection?.effectiveType || 'unknown',
    device_memory: (navigator as any).deviceMemory || 'unknown',
    hardware_concurrency: navigator.hardwareConcurrency || 'unknown'
  });
}; 