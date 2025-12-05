/**
 * @module @kb-labs/shared-command-kit/analytics/types
 * Analytics types (legacy - deprecated)
 *
 * @deprecated Use platform.analytics from PluginContext instead
 */

export interface TrackingConfig {
  command: string;
  startEvent?: string;
  finishEvent?: string;
  actor?: string;
  context?: Record<string, unknown>;
  includeFlags?: boolean;
}

export type AnalyticsEmit = (event: Partial<{ type: string; payload?: unknown }>) => Promise<void>;
export type AnalyticsScope = <T>(fn: (emit: AnalyticsEmit) => Promise<T>) => Promise<T>;

export interface TrackingResult {
  emit: (eventType: 'started' | 'finished', payload?: Record<string, unknown>) => Promise<void>;
  scope: AnalyticsScope;
}
