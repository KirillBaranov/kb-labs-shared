/**
 * @module @kb-labs/shared-command-kit/analytics/track
 * Analytics tracking helpers (legacy - NoOp implementation)
 *
 * @deprecated Use platform.analytics from PluginContext instead
 * This is a NoOp implementation for backward compatibility.
 */

import type { TrackingConfig, TrackingResult, AnalyticsEmit, AnalyticsScope } from './types';

/**
 * Create analytics tracking helper (NoOp implementation)
 *
 * @deprecated Use ctx.analytics from PluginContext instead
 *
 * This is now a no-op implementation. All analytics should be done through
 * platform.analytics in the new architecture.
 */
export function trackCommand(
  _analytics: unknown,
  _config: TrackingConfig
): TrackingResult {
  // NoOp emit
  const emit: (eventType: 'started' | 'finished', payload?: Record<string, unknown>) => Promise<void> =
    async (_eventType, _payload) => {
      // No-op - analytics should be done through platform.analytics
    };

  // NoOp scope
  const scope: AnalyticsScope = async <T>(fn: (emit: AnalyticsEmit) => Promise<T>): Promise<T> => {
    const noopEmit: AnalyticsEmit = async () => {
      // No-op
    };
    return await fn(noopEmit);
  };

  return {
    emit,
    scope,
  };
}

/**
 * Simplified tracking helper (NoOp implementation)
 *
 * @deprecated Use ctx.analytics from PluginContext instead
 */
export async function withAnalyticsScope<T>(
  _config: {
    actor?: string;
    context?: Record<string, unknown>;
  },
  fn: (emit: AnalyticsEmit) => Promise<T>
): Promise<T> {
  // NoOp implementation
  const noopEmit: AnalyticsEmit = async () => {
    // No-op
  };
  return await fn(noopEmit);
}
