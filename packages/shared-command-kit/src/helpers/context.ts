/**
 * @module @kb-labs/shared-command-kit/helpers/context
 * Context helpers and re-exports
 */

// Re-export TimingTracker from shared-cli-ui
export { TimingTracker } from '@kb-labs/shared-cli-ui';

// Re-export CliContext type
export type { CliContext } from '@kb-labs/cli-contracts';

import type { CliContext as BaseCliContext } from '@kb-labs/cli-contracts';
import type { PlatformServices } from '@kb-labs/plugin-runtime';

/**
 * Enhanced context with tracker and output helpers
 */
import type { TimingTracker } from '@kb-labs/shared-cli-ui';
import type { OutputHelpers } from '../output-helpers';

export interface EnhancedCliContext<TConfig = any, TEnv = Record<string, string | undefined>> extends Omit<BaseCliContext, 'env' | 'config'> {
  /** Timing tracker instance */
  tracker: TimingTracker;

  /** Output formatting helpers */
  success: OutputHelpers['success'];
  error: OutputHelpers['error'];
  warning: OutputHelpers['warning'];
  info: OutputHelpers['info'];
  result: OutputHelpers['result'];

  /** Platform services (available in plugin-aware hosts) */
  platform?: PlatformServices;

  /**
   * Product configuration (auto-loaded from kb.config.json)
   * Available when command is executed via plugin adapter.
   * Type-safe when TConfig is specified in defineCommand<TConfig, ...>()
   */
  config?: TConfig;

  /**
   * Validated environment variables.
   * Type-safe when TEnv is specified in defineCommand<TConfig, TFlags, TResult, TArgv, TEnv>()
   *
   * @example
   * ```typescript
   * type Env = {
   *   OPENAI_API_KEY: string;
   *   DEBUG?: string;
   * }
   *
   * defineCommand<Config, Flags, Result, Argv, Env>({
   *   handler(ctx) {
   *     ctx.env.OPENAI_API_KEY // string (validated!)
   *     ctx.env.DEBUG           // string | undefined
   *   }
   * })
   * ```
   */
  env: TEnv;
}

