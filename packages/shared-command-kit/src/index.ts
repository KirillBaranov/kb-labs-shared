/**
 * @module @kb-labs/shared-command-kit
 * Command Kit - High-level API and utilities for building CLI commands
 */

import type { CliContext } from '@kb-labs/cli-contracts';
import type { PluginContextV2 } from '@kb-labs/plugin-runtime';
import { TimingTracker } from '@kb-labs/shared-cli-ui';
import { defineFlags, validateFlags, type FlagSchemaDefinition, type InferFlags, FlagValidationError } from './flags/index';
import { trackCommand, type TrackingConfig } from './analytics/index';
import { formatError } from './errors/index';
import type { EnhancedCliContext } from './helpers/context';
import { createOutputHelpers } from './output-helpers';

// Re-exports
export * from './flags/index';
export * from './analytics/index';
export * from './errors/index';
export * from './helpers/index';
export * from './define-system-command';
export * from './output-helpers';
export * from './manifest';
export * from './permissions';
export * from './validation/index';
export * from './rest/index';
export * from './lifecycle/index';
export * from './studio/index';
export * from './jobs';
export type { CommandOutput } from '@kb-labs/shared-cli-ui';

/**
 * Command execution status
 */
// Note: 'warning' and 'info' are legacy statuses from cli-ui, they may be used for display purposes
// but semantically a command is either successful or not
export type CommandStatus = 'success' | 'failed' | 'error' | 'cancelled' | 'skipped' | 'warning' | 'info';

/**
 * Helper types for command results (optional - use when convenient)
 * 
 * These types make it easier to define command results without repeating `CommandResult &`.
 * They are completely optional - you can still use `CommandResult & { ... }` directly.
 * 
 * @example
 * ```typescript
 * // Using helper types (optional)
 * type MyResult = SuccessResult<{ items: Item[]; total: number }>;
 * 
 * // Direct usage (also works)
 * type MyResult = CommandResult & { ok: true; items: Item[]; total: number };
 * ```
 */
export type SuccessResult<T extends Record<string, unknown> = Record<string, never>> = CommandResult & { ok: true } & T;
export type ErrorResult<T extends Record<string, unknown> = Record<string, never>> = CommandResult & { ok: false; error: string } & T;
export type ResultWith<T extends Record<string, unknown>> = CommandResult & T;

/**
 * Base command result contract - all command results must extend this
 * 
 * This defines the minimal contract that every command must fulfill.
 * Every command MUST explicitly declare its result type via generic TResult parameter.
 * 
 * Required fields:
 * - `ok: boolean` - execution success status
 * 
 * Recommended fields:
 * - `error?: string` - error message when ok === false
 * - `status?: CommandStatus` - execution status (auto-inferred if not provided)
 * 
 * Additional fields should be added via generic TResult type parameter.
 * 
 * @example
 * ```typescript
 * // Minimal result (not recommended - use explicit type)
 * type MyResult = CommandResult; // { ok: boolean; error?: string; status?: CommandStatus }
 * 
 * // Extended result with custom fields (RECOMMENDED)
 * type WorkflowRunResult = CommandResult & {
 *   run: WorkflowRun;
 *   timingMs: number;
 * };
 * 
 * type ListResult = CommandResult & {
 *   items: Item[];
 *   total: number;
 * };
 * ```
 */
export type CommandResult = {
  /** Whether the command executed successfully - REQUIRED */
  ok: boolean;
  /** Error message if ok === false - RECOMMENDED for error cases */
  error?: string;
  /** Execution status - automatically inferred from ok if not provided */
  status?: CommandStatus;
};

/**
 * Command handler function signature
 *
 * TConfig is the product configuration type (auto-loaded from kb.config.json)
 * TEnv is the environment variables type (validated at runtime)
 * TResult must extend CommandResult ({ ok: boolean }) and represents the contract
 * for what the command returns. This ensures type safety and enables future contract
 * validation.
 *
 * TArgv is optional - by default it's `string[]`, but you can provide a tuple type
 * for strict argument typing if needed.
 *
 * @example
 * ```typescript
 * // Default: argv is string[]
 * handler: (ctx, argv, flags) => { ... }
 *
 * // With typed config
 * handler: (ctx, argv, flags) => {
 *   ctx.config?.llmProvider // TypeScript knows the config type
 * }
 *
 * // With typed env
 * handler: (ctx, argv, flags) => {
 *   ctx.env.OPENAI_API_KEY // TypeScript knows it's a string
 * }
 *
 * // Strict typing: argv is tuple ['workflow-id', ...string[]]
 * handler: (ctx, argv: ['workflow-id', ...string[]], flags) => {
 *   const workflowId = argv[0]; // TypeScript knows it's 'workflow-id'
 * }
 * ```
 */
export type CommandHandler<
  TConfig = any,
  TFlags extends Record<string, unknown> = Record<string, unknown>,
  TResult extends CommandResult = CommandResult,
  TArgv extends readonly string[] = string[],
  TEnv = Record<string, string | undefined>
> = (
  ctx: EnhancedCliContext<TConfig, TEnv>,
  argv: TArgv,
  flags: TFlags
) => Promise<number | TResult> | number | TResult;

/**
 * Command formatter function
 *
 * All type parameters are optional with defaults - same as CommandHandler.
 * Use explicit types when you want type safety, skip them for simplicity.
 *
 * @example
 * ```typescript
 * // Default: argv is string[]
 * formatter: (result, ctx, flags) => { ... }
 *
 * // With typed config
 * formatter: (result, ctx, flags) => {
 *   ctx.config?.llmProvider // TypeScript knows the config type
 * }
 *
 * // With typed env
 * formatter: (result, ctx, flags) => {
 *   ctx.env.OPENAI_API_KEY // TypeScript knows it's a string
 * }
 *
 * // Strict typing: argv is tuple ['workflow-id', ...string[]]
 * formatter: (result, ctx, flags, argv: ['workflow-id', ...string[]]) => {
 *   const workflowId = argv[0]; // TypeScript knows it's 'workflow-id'
 * }
 * ```
 */
export type CommandFormatter<
  TConfig = any,
  TFlags extends Record<string, unknown> = Record<string, unknown>,
  TResult extends CommandResult = CommandResult,
  TArgv extends readonly string[] = string[],
  TEnv = Record<string, string | undefined>
> = (
  result: TResult,
  ctx: EnhancedCliContext<TConfig, TEnv>,
  flags: TFlags,
  argv?: TArgv
) => void;

/**
 * Command configuration
 *
 * All type parameters are optional with sensible defaults:
 * - TConfig defaults to any (product config type)
 * - TFlags defaults to FlagSchemaDefinition (flags are Record<string, unknown>)
 * - TResult defaults to CommandResult (basic { ok: boolean })
 * - TArgv defaults to string[] (arguments are string[])
 * - TEnv defaults to Record<string, string | undefined> (process.env)
 *
 * Use explicit types when you want better type safety, but everything works without them.
 *
 * @example
 * ```typescript
 * // Default: argv is string[]
 * const cmd = defineCommand({
 *   handler: (ctx, argv, flags) => { ... }
 * });
 *
 * // Simple usage with flags and result only (RECOMMENDED)
 * const cmd = defineCommand<MyFlags, MyResult>({
 *   handler: (ctx, argv, flags) => {
 *     // flags are typed as InferFlags<MyFlags>
 *     return { ok: true, ...result };
 *   }
 * });
 *
 * // With typed config (third parameter)
 * type MindConfig = { llmProvider: string; maxTokens: number };
 * const cmd = defineCommand<Flags, Result, MindConfig>({
 *   handler: (ctx, argv, flags) => {
 *     ctx.config?.llmProvider // TypeScript knows it's a string
 *   }
 * });
 *
 * // With typed env (fifth parameter)
 * type Env = { OPENAI_API_KEY: string; DEBUG?: string };
 * const cmd = defineCommand<Flags, Result, Config, Argv, Env>({
 *   handler: (ctx, argv, flags) => {
 *     ctx.env.OPENAI_API_KEY // string (validated!)
 *   }
 * });
 *
 * // Strict typing: argv is tuple ['workflow-id', ...string[]]
 * const cmd = defineCommand<Flags, Result, Config, ['workflow-id', ...string[]]>({
 *   handler: (ctx, argv, flags) => {
 *     const workflowId = argv[0]; // TypeScript knows it's 'workflow-id'
 *   }
 * });
 * ```
 */
export interface CommandConfig<
  TFlags extends FlagSchemaDefinition = FlagSchemaDefinition,
  TResult extends CommandResult = CommandResult,
  TConfig = any,
  TArgv extends readonly string[] = string[],
  TEnv = Record<string, string | undefined>
> {
  /** Command name (for logging) */
  name?: string;
  /** Flag schema definition */
  flags: TFlags;
  /** Analytics configuration */
  analytics?: Omit<TrackingConfig, 'command'> & { command?: string };
  /**
   * Optional environment variable schema for validation.
   * If provided, required env vars will be validated at runtime.
   *
   * @example
   * ```typescript
   * env: {
   *   OPENAI_API_KEY: { required: true },
   *   DEBUG: { required: false },
   * }
   * ```
   */
  env?: Record<string, { required?: boolean }>;
  /** Command handler - must return TResult */
  handler: CommandHandler<TConfig, InferFlags<TFlags>, TResult, TArgv, TEnv>;
  /** Optional formatter for output - receives TResult */
  formatter?: CommandFormatter<TConfig, InferFlags<TFlags>, TResult, TArgv, TEnv>;
}

/**
 * Define a command with automatic validation, logging, analytics, and error handling
 *
 * Returns a function with signature `(ctx, argv, flags) => Promise<number>`
 * that can be used as a command handler in manifest.v2.ts
 *
 * All type parameters are optional - use them when you want type safety, skip them for simplicity.
 *
 * @template TFlags - Flag schema definition type (FIRST - most commonly used)
 * @template TResult - Command result type (must extend CommandResult)
 * @template TConfig - Product configuration type (auto-loaded from kb.config.json)
 * @template TArgv - Argument tuple type (defaults to string[])
 * @template TEnv - Environment variables type (defaults to process.env)
 *
 * @example
 * ```typescript
 * // Simple command with flags and result (RECOMMENDED)
 * export const releaseRunHandler = defineCommand<
 *   { scope: { type: 'string'; required: true } }, // flags
 *   CommandResult & { published: number } // result
 * >({
 *   name: 'release:run',
 *   flags: {
 *     scope: { type: 'string', required: true },
 *     'dry-run': { type: 'boolean', default: false },
 *   },
 *   analytics: {
 *     startEvent: 'RELEASE_RUN_STARTED',
 *     finishEvent: 'RELEASE_RUN_FINISHED',
 *   },
 *   async handler(ctx, argv, flags) {
 *     ctx.logger?.info('Release started', { scope: flags.scope });
 *     ctx.tracker.checkpoint('planning');
 *     // ... business logic
 *     return { ok: true, published: 5 };
 *   },
 * });
 *
 * // Command with typed config (third parameter)
 * type MindConfig = { llmProvider: string; maxTokens: number };
 * type RagQueryFlags = {
 *   text: { type: 'string'; required: true };
 *   mode: { type: 'string' };
 * };
 * type RagQueryResult = CommandResult & { answer: string; confidence: number };
 *
 * export const ragQueryHandler = defineCommand<
 *   RagQueryFlags,
 *   RagQueryResult,
 *   MindConfig
 * >({
 *   flags: {
 *     text: { type: 'string', required: true },
 *     mode: { type: 'string', default: 'instant' },
 *   },
 *   async handler(ctx, argv, flags) {
 *     // ctx.config is typed as MindConfig | undefined
 *     const provider = ctx.config?.llmProvider ?? 'openai';
 *     const maxTokens = ctx.config?.maxTokens ?? 4000;
 *
 *     // flags.text is typed as string (required)
 *     // flags.mode is typed as string | undefined
 *
 *     const answer = await query(flags.text, { provider, maxTokens });
 *     return { ok: true, answer, confidence: 0.85 };
 *   },
 * });
 *
 * // Command with typed env variables (fifth parameter)
 * type Env = {
 *   OPENAI_API_KEY: string;
 *   DEBUG?: string;
 * };
 *
 * export const envAwareHandler = defineCommand<Flags, Result, Config, Argv, Env>({
 *   env: {
 *     OPENAI_API_KEY: { required: true },
 *     DEBUG: { required: false },
 *   },
 *   flags: { ... },
 *   async handler(ctx, argv, flags) {
 *     // ctx.env.OPENAI_API_KEY is typed as string (validated!)
 *     const apiKey = ctx.env.OPENAI_API_KEY;
 *     // ctx.env.DEBUG is typed as string | undefined
 *     const debug = ctx.env.DEBUG;
 *     return { ok: true };
 *   },
 * });
 *
 * // Command with UI output (new convenience methods)
 * export const processDataHandler = defineCommand<
 *   { json: { type: 'boolean' } },
 *   CommandResult & { processed: number; items: string[] }
 * >({
 *   name: 'process:data',
 *   flags: {
 *     json: { type: 'boolean', default: false },
 *   },
 *   async handler(ctx, argv, flags) {
 *     // Show progress (CLI only, no-op in REST/Workflow)
 *     ctx.ui?.startProgress('loading', 'Fetching data...');
 *     const data = await fetchData();
 *     ctx.ui?.completeProgress('loading', 'Data loaded!');
 *
 *     // Process data
 *     const result = processItems(data);
 *
 *     // UI output (CLI only)
 *     if (!flags.json) {
 *       if (ctx.ui?.success) {
 *         ctx.ui.success('Processing Complete', [
 *           { header: 'Summary', items: [`Processed: ${result.processed}`, `Total: ${result.items.length}`] },
 *           { items: result.items.map(i => `✓ ${i}`) },
 *         ]);
 *       }
 *     } else {
 *       ctx.ui?.json(result);
 *     }
 *
 *     // Return value (for invoke/REST/workflow)
 *     return { ok: true, ...result };
 *   },
 * });
 *
 * // Note: Use ctx.ui.showError() for error display (error() is from PresenterFacade)
 * // Available methods: success(), showError(), warning(), info()
 * // Progress helpers: startProgress(), updateProgress(), completeProgress(), failProgress()
 * // Low-level UI: table(), keyValue(), list(), box(), sideBox()
 * ```
 */
export function defineCommand<
  TFlags extends FlagSchemaDefinition = FlagSchemaDefinition,
  TResult extends CommandResult = CommandResult,
  TConfig = any,
  TArgv extends readonly string[] = string[],
  TEnv = Record<string, string | undefined>
>(
  config: CommandConfig<TFlags, TResult, TConfig, TArgv, TEnv>
): (ctx: PluginContextV2, argv: string[], rawFlags: Record<string, unknown>) => Promise<number> {
  const { name, flags, analytics, handler, formatter, env: envSchema } = config;
  const flagSchema = defineFlags(flags);

  return async function commandHandler(
    ctx: PluginContextV2,
    argv: string[],
    rawFlags: Record<string, unknown>
  ): Promise<number> {
    const tracker = new TimingTracker();
    const jsonMode = Boolean(rawFlags.json);

    // Validate flags
    let validatedFlags: InferFlags<TFlags>;
    try {
      validatedFlags = await validateFlags(rawFlags, flagSchema);
    } catch (error) {
      // Enhance validation error with command name
      if (error instanceof FlagValidationError && name && !error.commandName) {
        (error as { commandName?: string }).commandName = name;
      }

      // Show stack trace only in debug mode
      const showStack = Boolean(rawFlags.debug);
      const formatted = formatError(error, { showStack, jsonMode });

      if (jsonMode) {
        ctx.output?.json(formatted.json);
      } else {
        ctx.output?.error(formatted.message);
      }

      // Return specific exit code for validation errors
      return 3; // EXIT_CODES.INVALID_FLAGS
    }

    // Validate environment variables if schema provided
    const validatedEnv: TEnv = process.env as TEnv;
    if (envSchema) {
      const missingEnvVars: string[] = [];
      for (const [key, schema] of Object.entries(envSchema)) {
        if (schema.required && !process.env[key]) {
          missingEnvVars.push(key);
        }
      }

      if (missingEnvVars.length > 0) {
        const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
        const formatted = formatError(new Error(errorMessage), { jsonMode });

        if (jsonMode) {
          ctx.output?.json(formatted.json);
        } else {
          ctx.output?.error(formatted.message);
        }

        return 3; // EXIT_CODES.INVALID_FLAGS
      }
    }

    // Enhance context with tracker and output helpers
    // IMPORTANT: Use Object.defineProperty instead of spread operator to preserve all PluginContext fields
    // The spread operator creates a shallow copy which loses some fields from the original context
    const outputHelpers = createOutputHelpers();

    // Add helpers via mutation (preserves all original context fields)
    const baseCtx = ctx as any;
    Object.defineProperty(baseCtx, 'tracker', { value: tracker, writable: false, enumerable: true, configurable: false });
    Object.defineProperty(baseCtx, 'success', { value: outputHelpers.success, writable: false, enumerable: true, configurable: false });
    Object.defineProperty(baseCtx, 'error', { value: outputHelpers.error, writable: false, enumerable: true, configurable: false });
    Object.defineProperty(baseCtx, 'warning', { value: outputHelpers.warning, writable: false, enumerable: true, configurable: false });
    Object.defineProperty(baseCtx, 'info', { value: outputHelpers.info, writable: false, enumerable: true, configurable: false });
    Object.defineProperty(baseCtx, 'result', { value: outputHelpers.result, writable: false, enumerable: true, configurable: false });
    Object.defineProperty(baseCtx, 'env', { value: validatedEnv, writable: false, enumerable: true, configurable: false });

    const enhancedCtx: EnhancedCliContext<TConfig, TEnv> = baseCtx;

    // Setup analytics if configured
    // Note: ctx.analytics may not exist in CliContext, so we pass undefined
    // The trackCommand function will handle the case when analytics is not available
    let analyticsHelper: ReturnType<typeof trackCommand> | null = null;
    if (analytics) {
      analyticsHelper = trackCommand((ctx as { analytics?: unknown }).analytics, {
        command: analytics.command || name || 'unknown',
        startEvent: analytics.startEvent,
        finishEvent: analytics.finishEvent,
        actor: analytics.actor,
        context: analytics.context,
        includeFlags: analytics.includeFlags,
      });
    }

    // Run command within analytics scope (or directly if no analytics)
    const runCommand = async (): Promise<number> => {
      try {
        // Log start
        if (name) {
          ctx.logger?.info(`Command started: ${name}`, {
            flags: analytics?.includeFlags ? validatedFlags : undefined,
          });
        }

        // Emit started event
        if (analyticsHelper) {
          await analyticsHelper.emit('started', {
            ...(analytics?.includeFlags ? validatedFlags : {}),
          });
        }

        tracker.checkpoint('start');

        // Call user handler
        const result = await handler(enhancedCtx, argv as unknown as TArgv, validatedFlags);

        tracker.checkpoint('complete');

        // Handle result
        let exitCode = 0;
        let resultData: TResult & { timingMs?: number } = { ok: true } as TResult & { timingMs?: number };

        if (typeof result === 'number') {
          exitCode = result;
          resultData = { 
            ok: result === 0,
            status: result === 0 ? 'success' : 'failed',
          } as TResult & { timingMs?: number };
        } else if (result && typeof result === 'object' && 'ok' in result) {
          resultData = result as TResult & { timingMs?: number };
          // Ensure status is set if not provided
          if (!resultData.status) {
            resultData.status = resultData.ok ? 'success' : (resultData.error ? 'error' : 'failed');
          }
          exitCode = resultData.ok ? 0 : 1;
        } else if (result && typeof result === 'object') {
          // Result is an object but doesn't have 'ok' field - preserve all fields and add 'ok'
          resultData = { ...(result as Record<string, unknown>), ok: true, status: 'success' } as TResult & { timingMs?: number };
        } else {
          resultData = { ok: true, status: 'success' } as TResult & { timingMs?: number };
        }

        // Add timing to result
        resultData.timingMs = tracker.total();

        // Log completion
        if (name) {
          ctx.logger?.info(`Command completed: ${name}`, {
            ok: resultData.ok,
            timingMs: tracker.total(),
          });
        }

        // Emit finished event
        if (analyticsHelper) {
          await analyticsHelper.emit('finished', {
            result: resultData.ok ? 'success' : 'failed',
            timingMs: tracker.total(),
            ...(analytics?.includeFlags ? validatedFlags : {}),
          });
        }

            // Format output
            if (formatter) {
              formatter(resultData, enhancedCtx, validatedFlags, argv as unknown as TArgv);
            } else {
          // Default formatting
          if (jsonMode) {
            ctx.output?.json(resultData);
          } else {
            if (resultData.ok) {
              ctx.output?.write(`✓ ${name || 'Command'} completed`);
            } else {
              ctx.output?.error(`✗ ${name || 'Command'} failed`);
            }
          }
        }

        return exitCode;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Log error
        if (name) {
          ctx.logger?.error(`Command failed: ${name}`, {
            error: errorMessage,
            timingMs: tracker.total(),
          });
        }

        // Emit error event
        if (analyticsHelper) {
          await analyticsHelper.emit('finished', {
            result: 'error',
            error: errorMessage,
            timingMs: tracker.total(),
          });
        }

        // Format error
        const formatted = formatError(error, {
          jsonMode,
          timingMs: tracker.total(),
        });

        if (jsonMode) {
          ctx.output?.json(formatted.json);
        } else {
          ctx.output?.error(formatted.message);
        }

        return 1;
      }
    };

    // Run within analytics scope if available
    if (analyticsHelper) {
      return await analyticsHelper.scope(async () => {
        return await runCommand();
      });
    } else {
      return await runCommand();
    }
  };
}

