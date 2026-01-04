import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineCommand } from '../index';
import type { CliContext } from '@kb-labs/cli-contracts';

describe('defineCommand', () => {
  let mockCtx: any; // PluginContextV3
  let mockUI: {
    write: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
  };
  let mockLogger: {
    info: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockUI = {
      write: vi.fn(),
      json: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
      warn: vi.fn(),
    };

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    // PluginContextV3 structure
    mockCtx = {
      host: 'cli',
      requestId: 'test-request-id',
      pluginId: '@kb-labs/test',
      cwd: '/test',
      ui: mockUI,
      platform: {
        logger: mockLogger as unknown as any,
        llm: {} as any,
        embeddings: {} as any,
        vectorStore: {} as any,
        cache: {} as any,
        storage: {} as any,
        analytics: {} as any,
      },
      runtime: {
        fs: {} as any,
        fetch: vi.fn(),
        env: vi.fn(),
      } as any,
      api: {} as any,
      trace: {
        traceId: 'test-trace-id',
        spanId: 'test-span-id',
      },
    };
  });

  it('should validate flags and call handler', async () => {
    const handler = vi.fn().mockResolvedValue({ ok: true, result: 'success' });

    const command = defineCommand({
      name: 'test',
      flags: {
        name: { type: 'string', required: true },
        verbose: { type: 'boolean', default: false },
      },
      handler,
    });

    const result = await command(mockCtx, [], { name: 'test', verbose: true });

    expect(result).toBe(0);
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0]?.[2]).toEqual({ name: 'test', verbose: true });
  });

  it('should return error code when validation fails', async () => {
    const handler = vi.fn();

    const command = defineCommand({
      name: 'test',
      flags: {
        name: { type: 'string', required: true },
      },
      handler,
    });

    const result = await command(mockCtx, [], {});

    expect(result).toBe(3); // EXIT_CODES.INVALID_FLAGS
    expect(handler).not.toHaveBeenCalled();
    // Error is displayed via ctx.ui?.error(), not mockOutput.error
  });

  it('should handle handler returning number', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => 0,
    });

    const result = await command(mockCtx, [], {});
    expect(result).toBe(0);
  });

  it('should handle handler returning object with ok', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => ({ ok: true, data: 'test' }),
    });

    const result = await command(mockCtx, [], {});
    expect(result).toBe(0);
  });

  it('should handle errors in handler', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => {
        throw new Error('Handler error');
      },
    });

    const result = await command(mockCtx, [], {});
    expect(result).toBe(1);
    expect(mockUI.error).toHaveBeenCalled(); // Now errors go through ctx.ui.error
  });

  // Removed: tracker is no longer added to context (pure PluginContextV3)

  it('should use custom formatter when provided', async () => {
    const formatter = vi.fn();

    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => ({ ok: true }),
      formatter,
    });

    await command(mockCtx, [], {});

    expect(formatter).toHaveBeenCalled();
    const [result, ctx] = formatter.mock.calls[0] || [];
    expect(result.ok).toBe(true);
    expect(ctx).toBeDefined(); // Pure PluginContextV3, no tracker
  });

  it('should output JSON when json flag is set', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => ({ ok: true }),
    });

    await command(mockCtx, [], { json: true });

    expect(mockUI.json).toHaveBeenCalled(); // Now JSON goes through ctx.ui.json
    const jsonCall = mockUI.json.mock.calls[0]?.[0];
    expect(jsonCall.ok).toBe(true);
    // Removed: timingMs is no longer added (no tracker)
  });

  it('should handle analytics integration', async () => {
    // Analytics config is now legacy - just verify command works with it
    const command = defineCommand({
      name: 'test',
      flags: {},
      analytics: {
        startEvent: 'TEST_STARTED',
        finishEvent: 'TEST_FINISHED',
      },
      handler: async () => ({ ok: true }),
    });

    const result = await command(mockCtx, [], {});

    // Command should complete successfully (analytics is legacy, may be no-op)
    expect(result).toBe(0);
  });

  it('should handle handler returning exit code 2', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => 2,
    });

    const result = await command(mockCtx, [], {});
    expect(result).toBe(2);
  });

  it('should handle handler returning object with ok: false', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => ({ ok: false, error: 'test error' }),
    });

    const result = await command(mockCtx, [], {});
    expect(result).toBe(1);
  });

  it('should log command start and completion', async () => {
    const command = defineCommand({
      name: 'test-command',
      flags: {},
      handler: async () => ({ ok: true }),
    });

    await command(mockCtx, [], {});

    // Logger is now in ctx.platform.logger
    expect(mockLogger.info).toHaveBeenCalled();
    const calls = mockLogger.info.mock.calls;
    const hasStartLog = calls.some((call: any[]) => call[0]?.includes('started'));
    const hasCompleteLog = calls.some((call: any[]) => call[0]?.includes('completed'));
    expect(hasStartLog || hasCompleteLog).toBe(true);
  });

  // Removed: tracker.checkpoint() is no longer available (pure PluginContextV3)

  it('should handle errors with proper formatting', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => {
        throw new Error('Test error');
      },
    });

    const result = await command(mockCtx, [], {});

    expect(result).toBe(1);
    expect(mockUI.error).toHaveBeenCalled(); // Errors through ctx.ui.error
    expect(mockLogger.error).toHaveBeenCalled(); // Logger through ctx.platform.logger
  });

  it('should handle errors in JSON mode', async () => {
    const command = defineCommand({
      name: 'test',
      flags: {},
      handler: async () => {
        throw new Error('Test error');
      },
    });

    const result = await command(mockCtx, [], { json: true });

    expect(result).toBe(1);
    expect(mockUI.json).toHaveBeenCalled(); // JSON through ctx.ui.json
    const jsonCall = mockUI.json.mock.calls[0]?.[0];
    expect(jsonCall.ok).toBe(false);
    expect(jsonCall.error).toBe('Test error');
  });
});

