/**
 * @module @kb-labs/shared-command-kit
 * System Command Definition - For KB Labs official commands with full privileges
 */

import {
  defineCommand,
  type CommandResult,
  type FlagSchemaDefinition,
  type InferFlags,
  type TrackingConfig,
  type EnhancedCliContext,
} from './index';
import type { Command, CommandGroup, FlagDefinition } from '@kb-labs/cli-contracts/command';

/**
 * Convert flag schema definition to FlagDefinition[] format
 * Used for compatibility with legacy Command interface
 */
function convertFlagSchema(schema: FlagSchemaDefinition): FlagDefinition[] {
  return Object.entries(schema).map(([name, def]) => {
    const result: FlagDefinition = {
      name,
      type: def.type,
      alias: def.alias,
      description: def.description,
      default: def.default,
      required: def.required,
    };
    
    // Add choices if present (for string flags with choices)
    if (def.type === 'string' && 'choices' in def && Array.isArray(def.choices)) {
      result.choices = [...def.choices];
    }
    
    return result;
  });
}

/**
 * Extended command config for system commands
 *
 * All type parameters are optional - use them when you want type safety, skip them for simplicity.
 *
 * TFlags can be inferred from the flags schema, but can also be explicitly provided
 * for better type inference in complex cases.
 *
 * TResult must extend CommandResult (requires ok: boolean field).
 */
export interface SystemCommandConfig<
  TFlags extends FlagSchemaDefinition = FlagSchemaDefinition,
  TResult extends CommandResult = CommandResult,
  TArgv extends readonly string[] = string[]
> {
  /** Command name (required for system commands) */
  name: string;
  /** Command description (required for system commands) */
  description: string;
  /** Long description for help */
  longDescription?: string;
  /** Category (defaults to 'system') */
  category?: string;
  /** Command aliases */
  aliases?: string[];
  /** Usage examples */
  examples?: string[];
  /** Flag schema definition - TypeScript will infer TFlags from this */
  flags: TFlags;
  /** Analytics configuration */
  analytics?: Omit<TrackingConfig, 'command'> & { command?: string };
  /** Command handler - receives EnhancedCliContext (PluginContextV2 + helpers) and must return TResult */
  handler: (ctx: EnhancedCliContext, argv: TArgv, flags: InferFlags<TFlags>) => Promise<number | TResult> | number | TResult;
  /** Optional formatter - receives TResult with inferred flags */
  formatter?: (result: TResult, ctx: EnhancedCliContext, flags: InferFlags<TFlags>, argv?: TArgv) => void;
}

/**
 * Define a system command with full privileges
 * 
 * System commands are KB Labs official commands that run with full system access,
 * bypassing sandbox restrictions. They are architecturally separated from plugin
 * commands - plugins can NEVER gain system privileges.
 * 
 * TResult is REQUIRED - every command must explicitly declare its result contract.
 * This ensures type safety and enables future contract validation.
 * 
 * @example
 * ```typescript
 * import { defineSystemCommand, type CommandResult, type FlagSchemaDefinition } from '@kb-labs/shared-command-kit';
 *
 * // Simple command with automatic flag type inference (RECOMMENDED)
 * export const helloCommand = defineSystemCommand<CommandResult & { message: string }>({
 *   name: 'hello',
 *   description: 'Print a friendly greeting',
 *   category: 'system',
 *   flags: {
 *     name: { type: 'string', description: 'Name to greet' },
 *   } satisfies FlagSchemaDefinition, // Preserves literal types for type inference
 *   async handler(ctx, argv, flags) {
 *     // ctx is EnhancedCliContext (extends PluginContextV2)
 *     // ctx.cwd - working directory (V2 promoted field)
 *     // ctx.ui - primary output API
 *     // ctx.success(), ctx.error() - output helpers
 *     // flags.name is inferred as string | undefined
 *     const message = `Hello, ${flags.name || 'World'}!`;
 *     ctx.ui.message(message);
 *     return { ok: true, message };
 *   },
 * });
 * 
 * // Command with explicit result type and automatic flag inference
 * type WorkflowListResult = CommandResult & {
 *   workflows: Array<{ id: string }>;
 *   total: number;
 * };
 * 
 * export const wfList = defineSystemCommand<WorkflowListResult>({
 *   name: 'list',
 *   description: 'List workflows',
 *   flags: {
 *     source: { type: 'string', default: 'all' },
 *     tag: { type: 'string' },
 *     json: { type: 'boolean' },
 *   } satisfies FlagSchemaDefinition, // TypeScript infers flag types automatically
 *   async handler(ctx, argv, flags) {
 *     // flags.source is inferred as string
 *     // flags.tag is inferred as string | undefined
 *     // flags.json is inferred as boolean
 *     const workflows = await listWorkflows(flags.source, flags.tag);
 *     return { ok: true, workflows, total: workflows.length };
 *   },
 * });
 * 
 * // Command with explicit flag types (for complex cases)
 * export const wfRun = defineSystemCommand<
 *   { 'workflow-id': { type: 'string'; required: true } },
 *   CommandResult & { run: WorkflowRun }
 * >({
 *   name: 'run',
 *   description: 'Execute a workflow',
 *   flags: {
 *     'workflow-id': { type: 'string', required: true },
 *   },
 *   async handler(ctx, argv, flags) {
 *     // flags['workflow-id'] is inferred as string (required)
 *     const run = await executeWorkflow(flags['workflow-id']);
 *     return { ok: true, run };
 *   },
 * });
 * ```
 */
// Overload for explicit TFlags and TResult
export function defineSystemCommand<
  TFlags extends FlagSchemaDefinition,
  TResult extends CommandResult = CommandResult,
  TArgv extends readonly string[] = string[]
>(
  config: SystemCommandConfig<TFlags, TResult, TArgv>
): Command;
// Implementation - all parameters optional with defaults
export function defineSystemCommand<
  TFlags extends FlagSchemaDefinition = FlagSchemaDefinition,
  TResult extends CommandResult = CommandResult,
  TArgv extends readonly string[] = string[]
>(
  config: SystemCommandConfig<TFlags, TResult, TArgv>
): Command {
  const { name, description, longDescription, category, aliases, examples, flags, analytics, handler, formatter } = config;

  // Create handler using defineCommand (shared base)
  const wrappedHandler = defineCommand<TFlags, TResult, any, TArgv>({
    name,
    flags: flags || ({} as TFlags),
    analytics,
    handler,
    formatter,
  });

  return {
    name,
    describe: description,
    longDescription,
    category: category || 'system',
    aliases: aliases || [],
    flags: flags ? convertFlagSchema(flags) : [],
    examples: examples || [],
    run: wrappedHandler,
  };
}

/**
 * Create a system command group
 * 
 * Groups organize related system commands for better help organization
 * and registration.
 * 
 * @example
 * ```typescript
 * export const systemInfoGroup = defineSystemCommandGroup(
 *   'system:info',
 *   'System information commands',
 *   [helloCommand, versionCommand, healthCommand]
 * );
 * ```
 */
export function defineSystemCommandGroup(
  name: string,
  describe: string,
  commands: Command[]
): CommandGroup {
  return {
    name,
    describe,
    commands,
  };
}

