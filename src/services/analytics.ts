import { usePostHog } from 'posthog-js/react';
import { analyticsClient } from './analyticsClient';

// Analytics event names - centralized for consistency
export const ANALYTICS_EVENTS = {
  // Core user journey
  EXTENSION_ACTIVATED: 'extension_activated',
  PAGE_NAVIGATED: 'page_navigated',
  COURSES_LOADED: 'courses_loaded',

  // Course management
  COURSE_ADDED: 'course_added',
  COURSE_REMOVED: 'course_removed',
  COURSE_PRIORITY_CHANGED: 'course_priority_changed',
  COURSE_GROUP_CREATED: 'course_group_created',
  COURSE_GROUP_MODIFIED: 'course_group_modified',

  // Schedule options
  SCHEDULE_OPTIONS_CHANGED: 'schedule_options_changed',
  SCHEDULE_OPTIONS_RESET: 'schedule_options_reset',

  // Schedule generation
  SCHEDULE_GENERATION_STARTED: 'schedule_generation_started',
  SCHEDULE_GENERATION_SUCCESS: 'schedule_generation_success',
  SCHEDULE_GENERATION_FAILED: 'schedule_generation_failed',

  // Schedule viewing and selection
  SCHEDULE_VIEWED: 'schedule_viewed',
  SCHEDULE_SELECTED: 'schedule_selected',
  SCHEDULE_PRINTED: 'schedule_printed',

  // Errors and issues
  ERROR_OCCURRED: 'error_occurred',
  DOM_PARSE_FAILED: 'dom_parse_failed',
  SCHEDULING_CONFLICT: 'scheduling_conflict',

  // Performance
  SCHEDULING_PERFORMANCE: 'scheduling_performance',
} as const;

// Analytics properties interface
export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined | null;
}

// Performance tracking result interface
export interface PerformanceResult<T> {
  result: T;
  duration: number;
  success: boolean;
  error?: Error;
}

// Performance tracking options
export interface PerformanceTrackingOptions {
  trackEvent?: boolean;
  eventName?: string;
  additionalProperties?: AnalyticsProperties;
  threshold?: number; // Only track if duration exceeds threshold (ms)
}

// Hook for using PostHog analytics (React components only)
export const useAnalytics = () => {
  const posthog = usePostHog();

  const track = (event: string, properties?: AnalyticsProperties) => {
    if (posthog) posthog.capture(event, properties);
  };

  const identify = (userId: string, properties?: AnalyticsProperties) => {
    if (posthog) posthog.identify(userId, properties);
  };

  const setUserProperties = (properties: AnalyticsProperties) => {
    if (posthog) posthog.setPersonProperties(properties);
  };

  return { track, identify, setUserProperties };
};

// Utility functions for common tracking patterns (safe outside React)
export const trackPageView = (pageName: string, additionalProps?: AnalyticsProperties) => {
  analyticsClient.capture(ANALYTICS_EVENTS.PAGE_NAVIGATED, {
    page: pageName,
    timestamp: Date.now(),
    ...additionalProps,
  });
};

export const trackError = (
  errorType: string,
  errorMessage: string,
  additionalProps?: AnalyticsProperties
) => {
  analyticsClient.capture(ANALYTICS_EVENTS.ERROR_OCCURRED, {
    error_type: errorType,
    error_message: errorMessage,
    timestamp: Date.now(),
    ...additionalProps,
  });
};

export const trackPerformance = (
  operation: string,
  duration: number,
  additionalProps?: AnalyticsProperties
) => {
  analyticsClient.capture(ANALYTICS_EVENTS.SCHEDULING_PERFORMANCE, {
    operation,
    duration_ms: duration,
    timestamp: Date.now(),
    ...additionalProps,
  });
};

// Performance tracking utility for async functions
export async function trackAsyncPerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  options: PerformanceTrackingOptions = {}
): Promise<PerformanceResult<T>> {
  const startTime = Date.now();
  let result: T;
  let success = true;
  let error: Error | undefined;

  try {
    result = await fn();
    return { result, duration: Date.now() - startTime, success };
  } catch (err) {
    success = false;
    error = err as Error;
    throw err;
  } finally {
    const duration = Date.now() - startTime;
    if (options.threshold && duration < options.threshold) {
      // Don't return here, just skip tracking
    } else if (options.trackEvent && options.eventName) {
      analyticsClient.capture(options.eventName, {
        operation,
        duration_ms: duration,
        success,
        error_message: error?.message,
        timestamp: Date.now(),
        ...options.additionalProperties,
      });
    }
  }
}
