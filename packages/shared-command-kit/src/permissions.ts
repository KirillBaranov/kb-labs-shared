/**
 * Permission Presets for KB Labs Plugins
 *
 * Optional helpers for defining plugin permissions without boilerplate.
 * You can always use plain objects instead - these are just conveniences.
 *
 * @example
 * ```typescript
 * import { defineManifest, permissions } from '@kb-labs/shared-command-kit';
 *
 * export const manifest = defineManifest({
 *   permissions: permissions.combine(
 *     permissions.presets.pluginWorkspace('mind'),
 *     permissions.presets.llmApi(['openai']),
 *     permissions.presets.vectorDb(['qdrant']),
 *   ),
 * });
 * ```
 */

import type { ManifestV3 } from '@kb-labs/plugin-contracts';

// Type for permissions object
export type PermissionsConfig = NonNullable<ManifestV3['permissions']>;

/**
 * Deep merge multiple permission objects
 * Later objects override earlier ones for conflicting keys
 * Arrays are concatenated and deduplicated
 */
export function combine(...permissionObjects: Partial<PermissionsConfig>[]): PermissionsConfig {
  const result: Partial<PermissionsConfig> = {};

  for (const perms of permissionObjects) {
    if (!perms) {continue;}

    // Merge fs permissions
    if (perms.fs) {
      result.fs = {
        ...(result.fs || {}),
        ...perms.fs,
        // Concatenate and deduplicate allow/deny arrays
        ...(perms.fs.allow && {
          allow: Array.from(new Set([...(result.fs?.allow || []), ...perms.fs.allow])),
        }),
        ...(perms.fs.deny && {
          deny: Array.from(new Set([...(result.fs?.deny || []), ...perms.fs.deny])),
        }),
      };
    }

    // Merge net permissions
    if (perms.net) {
      if (typeof perms.net === 'string') {
        result.net = perms.net;
      } else {
        result.net = {
          ...(typeof result.net === 'object' ? result.net : {}),
          ...perms.net,
          ...(perms.net.allowHosts && {
            allowHosts: Array.from(
              new Set([
                ...(typeof result.net === 'object' && result.net.allowHosts ? result.net.allowHosts : []),
                ...perms.net.allowHosts,
              ])
            ),
          }),
        };
      }
    }

    // Merge env permissions
    if (perms.env) {
      result.env = {
        ...(result.env || {}),
        ...perms.env,
        ...(perms.env.allow && {
          allow: Array.from(new Set([...(result.env?.allow || []), ...perms.env.allow])),
        }),
      };
    }

    // Merge quotas (last wins)
    if (perms.quotas) {
      result.quotas = {
        ...(result.quotas || {}),
        ...perms.quotas,
      };
    }

    // Merge state permissions
    if (perms.state) {
      result.state = {
        ...(result.state || {}),
        ...perms.state,
      };
    }
  }

  return result as PermissionsConfig;
}

/**
 * Permission presets for common scenarios
 */
export const presets = {
  /**
   * Read-only access to plugin workspace (.kb/<pluginName>/**)
   * Includes standard security deny patterns
   *
   * @example
   * ```typescript
   * permissions: presets.pluginWorkspaceRead('mind')
   * // Results in: fs: { mode: 'read', allow: ['.kb/mind/**'], deny: ['**\/*.key', ...] }
   * ```
   */
  pluginWorkspaceRead: (pluginName: string): Partial<PermissionsConfig> => ({
    fs: {
      mode: 'read' as const,
      allow: [`.kb/${pluginName}/**`],
      deny: [
        '**/*.key',
        '**/*.secret',
        '**/*.pem',
        '**/*.env',
        '**/node_modules/**',
        '**/.git/**',
      ],
    },
    net: 'none' as const,
    env: {
      allow: ['KB_LABS_REPO_ROOT', 'NODE_ENV'],
    },
    quotas: {
      timeoutMs: 30000, // 30s
      memoryMb: 256,
      cpuMs: 15000,
    },
  }),

  /**
   * Read-write access to plugin workspace (.kb/<pluginName>/**)
   * Also allows reading package.json files for dependency resolution
   *
   * @example
   * ```typescript
   * permissions: presets.pluginWorkspace('mind')
   * // Results in: fs: { mode: 'readWrite', allow: ['.kb/mind/**', 'package.json', ...] }
   * ```
   */
  pluginWorkspace: (pluginName: string): Partial<PermissionsConfig> => ({
    fs: {
      mode: 'readWrite' as const,
      allow: [
        `.kb/${pluginName}`,        // Allow the directory itself (for mkdir)
        `.kb/${pluginName}/**`,     // Allow all files inside
        'package.json',
        '**/package.json',
      ],
      deny: [
        '**/*.key',
        '**/*.secret',
        '**/*.pem',
        '**/*.env',
        '**/node_modules/**',
        '**/.git/**',
        '**/.artifacts/**',
      ],
    },
    net: 'none' as const,
    env: {
      allow: ['KB_LABS_REPO_ROOT', 'NODE_ENV'],
    },
    quotas: {
      timeoutMs: 60000, // 60s
      memoryMb: 512,
      cpuMs: 30000,
    },
  }),

  /**
   * LLM API access for specified providers
   * Adds network access to provider APIs and environment variable access for API keys
   *
   * @example
   * ```typescript
   * permissions: presets.llmApi(['openai', 'anthropic'])
   * // Results in: net.allowHosts: ['api.openai.com', 'api.anthropic.com']
   * //            env.allow: ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY']
   * ```
   */
  llmApi: (providers: Array<'openai' | 'anthropic' | 'google' | 'cohere'>): Partial<PermissionsConfig> => {
    type Provider = 'openai' | 'anthropic' | 'google' | 'cohere';

    const providerHosts: Record<Provider, string> = {
      openai: 'api.openai.com',
      anthropic: 'api.anthropic.com',
      google: 'generativelanguage.googleapis.com',
      cohere: 'api.cohere.ai',
    };

    const providerEnvVars: Record<Provider, string> = {
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      google: 'GOOGLE_API_KEY',
      cohere: 'COHERE_API_KEY',
    };

    return {
      net: {
        allowHosts: [
          ...providers.map(p => providerHosts[p]),
          'localhost',
          '127.0.0.1',
        ],
      },
      env: {
        allow: providers.map(p => providerEnvVars[p]),
      },
      quotas: {
        timeoutMs: 120000, // 120s (LLM calls can be slow)
        memoryMb: 512,
        cpuMs: 60000,
      },
    };
  },

  /**
   * Vector database access for specified providers
   * Adds network access to vector DB endpoints and environment variable access
   *
   * @example
   * ```typescript
   * permissions: presets.vectorDb(['qdrant'])
   * // Results in: net.allowHosts: ['*.qdrant.io', 'localhost:6333']
   * //            env.allow: ['QDRANT_URL', 'QDRANT_API_KEY']
   * ```
   */
  vectorDb: (dbs: Array<'qdrant' | 'pinecone' | 'weaviate'>): Partial<PermissionsConfig> => {
    const dbHosts: Record<string, string[]> = {
      qdrant: ['*.qdrant.io', 'localhost:6333'],
      pinecone: ['*.pinecone.io'],
      weaviate: ['*.weaviate.io', 'localhost:8080'],
    };

    const dbEnvVars: Record<string, string[]> = {
      qdrant: ['QDRANT_URL', 'QDRANT_API_KEY'],
      pinecone: ['PINECONE_API_KEY', 'PINECONE_ENVIRONMENT'],
      weaviate: ['WEAVIATE_URL', 'WEAVIATE_API_KEY'],
    };

    const allHosts = dbs.flatMap(db => dbHosts[db] || []);
    const allEnvVars = dbs.flatMap(db => dbEnvVars[db] || []);

    return {
      net: {
        allowHosts: [...allHosts, 'localhost', '127.0.0.1'],
      },
      env: {
        allow: allEnvVars,
      },
      quotas: {
        timeoutMs: 60000, // 60s
        memoryMb: 512,
        cpuMs: 30000,
      },
    };
  },

  /**
   * Analytics and telemetry access
   * Grants state storage access for analytics data
   *
   * @example
   * ```typescript
   * permissions: presets.analytics()
   * // Results in: state: { own: { read: true, write: true } }
   * ```
   */
  analytics: (): Partial<PermissionsConfig> => ({
    state: {
      own: {
        read: true,
        write: true,
      },
    },
    quotas: {
      timeoutMs: 5000, // 5s (analytics should be fast)
      memoryMb: 128,
      cpuMs: 2000,
    },
  }),

  /**
   * Monorepo access for build tools and linters
   * Read-only access to entire workspace (excluding node_modules, .git, etc.)
   *
   * @example
   * ```typescript
   * permissions: presets.monorepo()
   * // Results in: fs: { mode: 'read', allow: ['**\/*'], deny: ['**\/node_modules/**', ...] }
   * ```
   */
  monorepo: (): Partial<PermissionsConfig> => ({
    fs: {
      mode: 'read' as const,
      allow: ['**/*'],
      deny: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.artifacts/**',
        '**/dist/**',
        '**/*.key',
        '**/*.secret',
        '**/*.pem',
        '**/*.env',
      ],
    },
    quotas: {
      timeoutMs: 300000, // 300s (5min - monorepo analysis can be slow)
      memoryMb: 1024,
      cpuMs: 120000,
    },
  }),

  /**
   * HTTP client access for making web requests
   * Allows access to any host (use with caution!)
   *
   * @example
   * ```typescript
   * permissions: presets.httpClient()
   * // Results in: net: { allowHosts: ['*'] }
   * ```
   */
  httpClient: (): Partial<PermissionsConfig> => ({
    net: {
      allowHosts: ['*'], // All hosts
    },
    quotas: {
      timeoutMs: 60000, // 60s
      memoryMb: 256,
      cpuMs: 30000,
    },
  }),

  /**
   * Local development access
   * Allows localhost network access for development servers
   *
   * @example
   * ```typescript
   * permissions: presets.localhost()
   * // Results in: net: { allowHosts: ['localhost', '127.0.0.1', '0.0.0.0'] }
   * ```
   */
  localhost: (): Partial<PermissionsConfig> => ({
    net: {
      allowHosts: ['localhost', '127.0.0.1', '0.0.0.0', '::1'],
    },
    quotas: {
      timeoutMs: 30000, // 30s
      memoryMb: 256,
      cpuMs: 15000,
    },
  }),
};

/**
 * Export permissions namespace for convenience
 *
 * @example
 * ```typescript
 * import { permissions } from '@kb-labs/shared-command-kit';
 *
 * const perms = permissions.combine(
 *   permissions.presets.pluginWorkspace('my-plugin'),
 *   permissions.presets.llmApi(['openai'])
 * );
 * ```
 */
export const permissions = {
  combine,
  presets,
};
