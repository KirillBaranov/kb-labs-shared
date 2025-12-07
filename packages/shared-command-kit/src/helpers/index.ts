/**
 * @module @kb-labs/shared-command-kit/helpers
 * Global platform access helpers
 *
 * Provides clean, type-safe access to platform services without context drilling.
 * Similar to React hooks pattern, but for KB Labs platform.
 *
 * @example
 * ```typescript
 * import { useLLM, useLogger, useAnalytics } from '@kb-labs/shared-command-kit/helpers';
 *
 * async handler(ctx, argv, flags) {
 *   const logger = useLogger();
 *   const llm = useLLM();
 *
 *   await logger.info('Processing started');
 *
 *   if (llm) {
 *     const result = await llm.complete('prompt');
 *     await logger.info('LLM result', { length: result.content.length });
 *   }
 * }
 * ```
 */

// Platform singleton
export { usePlatform, isPlatformConfigured } from './use-platform';

// Core services
export { useLogger, useLoggerWithContext } from './use-logger';
export { useLLM, isLLMAvailable } from './use-llm';
export { useAnalytics, trackAnalyticsEvent } from './use-analytics';
export { useStorage } from './use-storage';
