import { box, keyValue } from './format.js';
import { formatTiming } from './command-output.js';
import { safeColors } from './colors.js';
import {
  displayArtifactsCompact,
  type ArtifactInfo,
  type ArtifactDisplayOptions,
} from './artifacts-display.js';
import { TimingTracker } from './timing-tracker.js';

export interface CommandPresenter {
  info(message: string): void;
  warn?(message: string): void;
  error(message: string): void;
  write(payload: string): void;
  json(payload: unknown): void;
}

export interface CommandContext {
  cwd: string;
  presenter: CommandPresenter;
}

export interface CommandExecutionResult {
  summary: Record<string, string | number>;
  artifacts?: ArtifactInfo[];
  artifactsOptions?: ArtifactDisplayOptions;
  timing?: number | Record<string, number>;
  diagnostics?: string[];
  warnings?: string[];
  errors?: string[];
  data?: Record<string, unknown>;
}

export interface AnalyticsConfig {
  actor: string;
  started: string;
  finished: string;
  getPayload?: (flags: Record<string, unknown>, result?: CommandExecutionResult) => Record<string, unknown>;
}

export interface CommandRunnerOptions {
  title: string;
  analytics?: AnalyticsConfig;
  execute: (ctx: CommandContext, flags: Record<string, unknown>, tracker: TimingTracker) => Promise<CommandExecutionResult>;
}

export function createCommandRunner(options: CommandRunnerOptions) {
  return async (ctx: CommandContext, argv: string[], flags: Record<string, unknown>): Promise<number> => {
    const tracker = new TimingTracker();
    const jsonMode = flags.json === true;
    const quietMode = flags.quiet === true;
    const start = Date.now();

    const runScope =
      options.analytics !== undefined
        ? (await import('@kb-labs/analytics-sdk-node')).runScope
        : null;

    const execute = async (): Promise<number> => {
      tracker.checkpoint('start');
      try {
        const result = await options.execute(ctx, flags, tracker);
        tracker.checkpoint('complete');
        formatSuccessOutput(ctx, options.title, result, tracker.total(), {
          jsonMode,
          quietMode,
        });
        return 0;
      } catch (error) {
        tracker.checkpoint('error');
        const message = error instanceof Error ? error.message : String(error);
        formatErrorOutput(ctx, message, tracker.total(), {
          jsonMode,
          quietMode,
        });
        return 1;
      }
    };

    if (!runScope || !options.analytics) {
      return execute();
    }

    const totalStart = Date.now();
    return runScope(
      {
        actor: options.analytics.actor as never,
        ctx: { workspace: ctx.cwd },
      },
      async (emit) => {
        await emit({
          type: options.analytics!.started,
          payload: options.analytics!.getPayload?.(flags) ?? {},
        });

        let exitCode = 0;
        try {
          exitCode = await execute();
          await emit({
            type: options.analytics!.finished,
            payload: {
              ...(options.analytics!.getPayload?.(flags) ?? {}),
              durationMs: Date.now() - totalStart,
              result: exitCode === 0 ? 'success' : 'error',
            },
          });
        } catch (error) {
          await emit({
            type: options.analytics!.finished,
            payload: {
              ...(options.analytics!.getPayload?.(flags) ?? {}),
              durationMs: Date.now() - totalStart,
              result: 'error',
              error: error instanceof Error ? error.message : String(error),
            },
          });
          throw error;
        }

        return exitCode;
      },
    );
  };
}

interface OutputFlags {
  jsonMode: boolean;
  quietMode: boolean;
}

function formatSuccessOutput(
  ctx: CommandContext,
  title: string,
  result: CommandExecutionResult,
  durationMs: number,
  flags: OutputFlags,
): void {
  if (flags.jsonMode) {
    const payload: Record<string, unknown> = {
      ok: true,
      summary: result.summary,
      timing: result.timing ?? durationMs,
      diagnostics: result.diagnostics,
      warnings: result.warnings,
      errors: result.errors,
    };
    if (result.artifacts) {
      payload.artifacts = result.artifacts;
    }
    if (result.data) {
      Object.assign(payload, result.data);
    }
    ctx.presenter.json(payload);
    return;
  }

  if (flags.quietMode) {
    return;
  }

  const lines: string[] = [];
  lines.push(...keyValue(result.summary));

  if (result.artifacts && result.artifacts.length > 0) {
    const artifactsLines = displayArtifactsCompact(result.artifacts, result.artifactsOptions);
    if (artifactsLines.length > 0) {
      lines.push('', ...artifactsLines);
    }
  }

  const timing = result.timing ?? durationMs;
  if (typeof timing === 'number') {
    lines.push('', `Time: ${formatTiming(timing)}`);
  } else {
    lines.push('');
    for (const [label, value] of Object.entries(timing)) {
      lines.push(`${label}: ${formatTiming(value)}`);
    }
  }

  if (result.diagnostics && result.diagnostics.length > 0) {
    lines.push('', safeColors.info('Diagnostics:'));
    result.diagnostics.forEach((item) => lines.push(`  • ${item}`));
  }

  if (result.warnings && result.warnings.length > 0) {
    lines.push('', safeColors.warning('Warnings:'));
    result.warnings.forEach((item) => lines.push(`  • ${item}`));
  }

  if (result.errors && result.errors.length > 0) {
    lines.push('', safeColors.error('Errors:'));
    result.errors.forEach((item) => lines.push(`  • ${item}`));
  }

  ctx.presenter.write(box(title, lines));
}

function formatErrorOutput(
  ctx: CommandContext,
  errorMessage: string,
  durationMs: number,
  flags: OutputFlags,
): void {
  if (flags.jsonMode) {
    ctx.presenter.json({
      ok: false,
      error: errorMessage,
      timing: durationMs,
    });
    return;
  }

  if (flags.quietMode) {
    return;
  }

  ctx.presenter.error(errorMessage);
}

