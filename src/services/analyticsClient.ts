import posthog from 'posthog-js';

export type AnalyticsProps = { [key: string]: string | number | boolean | null | undefined };

export const analyticsClient = {
  capture(event: string, properties?: AnalyticsProps) {
    try {
      posthog?.capture?.(event, properties);
    } catch (error) {
      console.error('PostHog capture failed:', error);
    }
  },
  identify(distinctId: string, properties?: AnalyticsProps) {
    try {
      posthog?.identify?.(distinctId, properties);
    } catch (error) {
      console.error('PostHog identify failed:', error);
    }
  },
  setPersonProperties(properties: AnalyticsProps) {
    try {
      posthog?.setPersonProperties?.(properties as Record<string, unknown>);
    } catch (error) {
      console.error('PostHog setPersonProperties failed:', error);
    }
  },
  register(properties: AnalyticsProps) {
    try {
      posthog?.register?.(properties as Record<string, unknown>);
    } catch (error) {
      console.error('PostHog register failed:', error);
    }
  },
  reset() {
    try {
      posthog?.reset?.();
    } catch (error) {
      console.error('PostHog reset failed:', error);
    }
  },
};
