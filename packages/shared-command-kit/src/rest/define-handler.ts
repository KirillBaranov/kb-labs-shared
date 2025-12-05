/**
 * REST Handler Definition
 *
 * Optional helper for defining REST handlers with automatic validation and error handling.
 * You can always use plain functions - this is just convenience.
 *
 * @example
 * ```typescript
 * import { defineRestHandler, schema } from '@kb-labs/shared-command-kit';
 *
 * export const handleVerify = defineRestHandler({
 *   name: 'mind:verify',
 *   input: z.object({ cwd: schema.cwd() }),
 *   output: z.object({ ok: z.boolean(), cards: z.array(cardDataSchema) }),
 *   async handler(request, ctx) {
 *     const cwd = await ctx.resolveCwd(request.cwd);
 *     const result = await verifyIndexes(cwd);
 *     return { ok: true, cards: createCardList([...]) };
 *   },
 * });
 * ```
 */

import { z } from 'zod';
import { resolveWorkspaceRoot } from '@kb-labs/core-workspace';

/**
 * REST handler context (simplified version of PluginContext for REST handlers)
 */
export interface RestHandlerContext {
  /** Request ID for tracing */
  requestId: string;
  /** Plugin ID */
  pluginId: string;
  /** Output directory (optional) */
  outdir?: string;
  /** Trace ID for distributed tracing */
  traceId?: string;
  /** Span ID for distributed tracing */
  spanId?: string;
  /** Parent span ID for distributed tracing */
  parentSpanId?: string;
  /** Runtime services (optional) */
  runtime?: {
    fetch: typeof fetch;
    fs: any;
    env: (key: string) => string | undefined;
    log: (level: 'debug' | 'info' | 'warn' | 'error', msg: string, meta?: Record<string, unknown>) => void;
    invoke?: <T = unknown>(request: any) => Promise<any>;
    artifacts?: {
      read: (request: any) => Promise<Buffer | object>;
      write: (request: any) => Promise<{ path: string; meta: any }>;
    };
  };
}

/**
 * Enhanced REST handler context with helper methods
 */
export interface EnhancedRestContext extends RestHandlerContext {
  /** Logger (always available, falls back to console) */
  log: (level: 'debug' | 'info' | 'warn' | 'error', msg: string, meta?: Record<string, unknown>) => void;
  /** Environment variable getter (always available, falls back to process.env) */
  env: (key: string) => string | undefined;
  /** Resolve current working directory from request, env, or auto-detect */
  resolveCwd: (requestCwd?: string) => Promise<string>;
}

/**
 * REST handler definition
 */
export interface RestHandlerDefinition<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny
> {
  /** Handler name (for logging/analytics) */
  name: string;
  /** Input validation schema */
  input: TInput;
  /** Output validation schema (optional, for documentation) */
  output?: TOutput;
  /** Error definitions */
  errors?: Record<string, { http: number; message?: string }>;
  /** Handler implementation */
  handler: (
    request: z.infer<TInput>,
    ctx: EnhancedRestContext
  ) => Promise<z.infer<TOutput>>;
}

/**
 * REST response (success)
 */
export interface RestSuccessResponse<T> {
  ok: true;
  data?: T;
}

/**
 * REST response (error)
 */
export interface RestErrorResponse {
  ok: false;
  code: string;
  message: string;
  hint?: string;
  details?: Record<string, unknown>;
}

/**
 * Define a REST handler with automatic validation and error handling
 *
 * @example
 * ```typescript
 * export const handleVerify = defineRestHandler({
 *   name: 'mind:verify',
 *   input: z.object({
 *     cwd: schema.cwd(),
 *   }),
 *   output: z.object({
 *     ok: z.boolean(),
 *     cards: z.array(cardDataSchema),
 *   }),
 *   errors: {
 *     'VERIFY_FAILED': { http: 500, message: 'Verification failed' },
 *   },
 *   async handler(request, ctx) {
 *     const cwd = await ctx.resolveCwd(request.cwd);
 *     const result = await verifyIndexes(cwd);
 *     return { ok: true, cards: [...] };
 *   },
 * });
 * ```
 */
export function defineRestHandler<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny
>(
  definition: RestHandlerDefinition<TInput, TOutput>
): (input: unknown, ctx: RestHandlerContext) => Promise<z.infer<TOutput> | RestErrorResponse> {
  return async (input: unknown, ctx: RestHandlerContext) => {
    // Create enhanced context with helpers
    const enhancedCtx = createEnhancedContext(ctx, definition.name);

    try {
      // 1. Validate input
      let validatedInput: z.infer<TInput>;
      try {
        validatedInput = definition.input.parse(input);
      } catch (error: any) {
        enhancedCtx.log('warn', 'Input validation failed', {
          handler: definition.name,
          error: error.message,
        });
        return {
          ok: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request input',
          hint: error.message,
          details: error.errors,
        } as RestErrorResponse;
      }

      enhancedCtx.log('debug', 'Handler started', {
        handler: definition.name,
        requestId: ctx.requestId,
      });

      // 2. Execute handler
      const result = await definition.handler(validatedInput, enhancedCtx);

      // 3. Validate output (optional, for development)
      if (definition.output && process.env.NODE_ENV !== 'production') {
        try {
          definition.output.parse(result);
        } catch (error: any) {
          enhancedCtx.log('error', 'Output validation failed (development only)', {
            handler: definition.name,
            error: error.message,
          });
          // In production, we don't fail on output validation
          // In development, we log it but still return the result
        }
      }

      enhancedCtx.log('debug', 'Handler completed', {
        handler: definition.name,
        requestId: ctx.requestId,
      });

      return result;
    } catch (error: any) {
      enhancedCtx.log('error', 'Handler error', {
        handler: definition.name,
        error: error.message,
        stack: error.stack,
      });

      // Check if error matches defined error codes
      const errorCode = findErrorCode(error, definition.errors);

      if (errorCode && definition.errors) {
        const errorDef = definition.errors[errorCode];
        if (errorDef) {
          return {
            ok: false,
            code: errorCode,
            message: errorDef.message || error.message,
            hint: error.hint || 'Check request parameters and permissions',
          } as RestErrorResponse;
        }
      }

      // Generic error
      return {
        ok: false,
        code: 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        hint: 'An unexpected error occurred',
      } as RestErrorResponse;
    }
  };
}

/**
 * Create enhanced context with helper methods
 */
function createEnhancedContext(
  ctx: RestHandlerContext,
  handlerName: string
): EnhancedRestContext {
  // Logger helper (always available)
  const log = ctx.runtime?.log || ((level: string, msg: string, meta?: Record<string, unknown>) => {
    console.log(`[${level}] ${msg}`, meta || '');
  });

  // Environment helper (always available)
  const env = ctx.runtime?.env || ((key: string) => process.env[key]);

  // Resolve cwd helper
  const resolveCwd = async (requestCwd?: string): Promise<string> => {
    // Priority: request.cwd → env → auto-detect → fallback
    if (requestCwd) {
      return requestCwd;
    }

    // Try environment variable
    const envCwd = env('KB_LABS_REPO_ROOT');
    if (envCwd) {
      return envCwd;
    }

    // Auto-detect workspace root
    try {
      const result = await resolveWorkspaceRoot({ startDir: process.cwd() });
      return result.rootDir;
    } catch (error) {
      log('warn', 'Failed to auto-detect workspace root, using current directory', {
        handler: handlerName,
        error: error instanceof Error ? error.message : String(error),
      });
      return '.';
    }
  };

  return {
    ...ctx,
    log,
    env,
    resolveCwd,
  };
}

/**
 * Find matching error code from error object
 */
function findErrorCode(
  error: any,
  errorDefs?: Record<string, { http: number; message?: string }>
): string | undefined {
  if (!errorDefs) return undefined;

  // Check if error has errorCode property
  if (error.errorCode && errorDefs[error.errorCode]) {
    return error.errorCode;
  }

  // Check if error has code property
  if (error.code && errorDefs[error.code]) {
    return error.code;
  }

  // Check if error name matches
  if (error.name && errorDefs[error.name]) {
    return error.name;
  }

  return undefined;
}

/**
 * Helper for creating CardListData for Studio widgets
 */
export interface CardData {
  title: string;
  content: string;
  status?: 'ok' | 'warn' | 'error' | 'info';
}

/**
 * Create card list from card data array
 *
 * @example
 * ```typescript
 * const cards = createCardList([
 *   { title: 'Status', content: 'OK', status: 'ok' },
 *   { title: 'Hint', content: result.hint, status: 'info' },
 * ]);
 * ```
 */
export function createCardList(cards: CardData[]): CardData[] {
  return cards.map(card => ({
    title: card.title,
    content: card.content,
    status: card.status || 'info',
  }));
}
