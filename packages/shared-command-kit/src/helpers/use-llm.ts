/**
 * @module @kb-labs/shared-command-kit/helpers/use-llm
 * Global LLM access helper with tier-based model selection.
 *
 * Provides clean access to LLM with adaptive tier routing.
 * Plugins specify tiers (small/medium/large), platform resolves to actual models.
 *
 * @example
 * ```typescript
 * import { useLLM } from '@kb-labs/shared-command-kit';
 *
 * async handler(ctx, argv, flags) {
 *   // Simple usage (uses configured default tier)
 *   const llm = useLLM();
 *
 *   // Request specific tier (platform adapts if needed)
 *   const llm = useLLM({ tier: 'small' });   // Simple tasks
 *   const llm = useLLM({ tier: 'large' });   // Complex tasks
 *
 *   // Request capabilities
 *   const llm = useLLM({ tier: 'medium', capabilities: ['coding'] });
 *
 *   if (llm) {
 *     const result = await llm.complete('Explain this code');
 *     console.log(result.content);
 *   }
 * }
 * ```
 */

import { usePlatform } from './use-platform.js';
import type { ILLM, LLMTier, UseLLMOptions, ILLMRouter } from '@kb-labs/core-platform';

/**
 * Access global LLM adapter with tier-based selection.
 *
 * Platform automatically adapts to available models:
 * - If plugin requests 'small' but 'medium' configured → uses 'medium' (escalation)
 * - If plugin requests 'large' but 'medium' configured → uses 'medium' with warning (degradation)
 *
 * **Tiers are user-defined slots:**
 * - `small`  - Plugin says: "This task is simple"
 * - `medium` - Plugin says: "Standard task"
 * - `large`  - Plugin says: "Complex task, need maximum quality"
 *
 * User decides what model maps to each tier in their config.
 *
 * @param options - Optional tier and capability requirements
 * @returns LLM adapter or undefined if not configured
 *
 * @example
 * ```typescript
 * // Simple usage (uses configured default)
 * const llm = useLLM();
 *
 * // Request specific tier
 * const llm = useLLM({ tier: 'small' });   // Simple tasks
 * const llm = useLLM({ tier: 'large' });   // Complex tasks
 *
 * // Request capabilities
 * const llm = useLLM({ tier: 'medium', capabilities: ['coding'] });
 * const llm = useLLM({ capabilities: ['vision'] });
 *
 * if (llm) {
 *   const result = await llm.complete('Generate commit message');
 *   console.log(result.content);
 * }
 * ```
 */
export function useLLM(options?: UseLLMOptions): ILLM | undefined {
  const platform = usePlatform();
  const llm = platform.llm;

  if (!llm) {
    return undefined;
  }

  // If LLM is a router, resolve tier (logs warning if degraded)
  if (options && isLLMRouter(llm)) {
    llm.resolve(options);
  }

  return llm;
}

/**
 * Check if LLM is available.
 *
 * Useful for conditional logic (LLM-powered vs deterministic fallback).
 *
 * @returns true if LLM is configured and ready
 *
 * @example
 * ```typescript
 * if (isLLMAvailable()) {
 *   const summary = await generateWithLLM(data);
 * } else {
 *   const summary = generateDeterministic(data);
 * }
 * ```
 */
export function isLLMAvailable(): boolean {
  const llm = useLLM();
  return !!llm;
}

/**
 * Get configured LLM tier.
 *
 * Useful for diagnostics and logging.
 *
 * @returns Configured tier or undefined if LLM not available/not a router
 *
 * @example
 * ```typescript
 * const tier = getLLMTier();
 * console.log(`Using LLM tier: ${tier ?? 'default'}`);
 * ```
 */
export function getLLMTier(): LLMTier | undefined {
  const platform = usePlatform();
  const llm = platform.llm;

  if (llm && isLLMRouter(llm)) {
    return llm.getConfiguredTier();
  }

  return undefined;
}

/**
 * Type guard for ILLMRouter.
 */
function isLLMRouter(llm: ILLM): llm is ILLM & ILLMRouter {
  return (
    typeof (llm as unknown as ILLMRouter).getConfiguredTier === 'function' &&
    typeof (llm as unknown as ILLMRouter).resolve === 'function'
  );
}

// Re-export types for convenience
export type { LLMTier, UseLLMOptions } from '@kb-labs/core-platform';

