/**
 * @module @kb-labs/shared-command-kit/helpers/use-llm
 * Global LLM access helper
 *
 * Provides clean access to LLM (Large Language Model) adapter.
 *
 * @example
 * ```typescript
 * import { useLLM } from '@kb-labs/shared-command-kit';
 *
 * async handler(ctx, argv, flags) {
 *   const llm = useLLM();
 *
 *   if (llm) {
 *     const result = await llm.complete('Explain this code', {
 *       systemPrompt: 'You are a helpful assistant',
 *       temperature: 0.7,
 *     });
 *     console.log(result.content);
 *   }
 * }
 * ```
 */

import { usePlatform } from './use-platform';
import type { ILLM } from '@kb-labs/core-platform';

/**
 * Access global LLM adapter
 *
 * Returns the platform LLM adapter (OpenAI, Anthropic, etc.).
 * Returns undefined if LLM is not configured (graceful degradation).
 *
 * **Methods:**
 * - `llm.complete(prompt, options?)` - Generate text completion
 *
 * **Always check availability:**
 * ```typescript
 * const llm = useLLM();
 * if (llm) {
 *   const result = await llm.complete('prompt');
 * } else {
 *   // Fallback to deterministic logic
 * }
 * ```
 *
 * @returns LLM adapter or undefined if not configured
 *
 * @example
 * ```typescript
 * const llm = useLLM();
 *
 * if (llm) {
 *   const result = await llm.complete(
 *     'Generate a professional changelog summary for these commits: ...',
 *     {
 *       systemPrompt: 'You are a technical writer',
 *       temperature: 0.7,
 *       maxTokens: 1500,
 *     }
 *   );
 *
 *   console.log(result.content);
 * }
 * ```
 */
export function useLLM(): ILLM | undefined {
  const platform = usePlatform();
  return platform.llm;
}

/**
 * Check if LLM is available
 *
 * Useful for conditional logic (LLM-powered vs deterministic fallback).
 *
 * @returns true if LLM is configured and ready
 *
 * @example
 * ```typescript
 * if (isLLMAvailable()) {
 *   // Use LLM-powered feature
 *   const summary = await generateWithLLM(data);
 * } else {
 *   // Use deterministic fallback
 *   const summary = generateDeterministic(data);
 * }
 * ```
 */
export function isLLMAvailable(): boolean {
  const llm = useLLM();
  return !!llm;
}
