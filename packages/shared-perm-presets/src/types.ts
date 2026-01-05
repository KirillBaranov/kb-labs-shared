/**
 * Platform service permissions
 */
export interface PlatformPermissions {
  /** LLM access */
  llm?: boolean | { models?: string[] };
  /** Vector store access */
  vectorStore?: boolean | { collections?: string[] };
  /** Cache access */
  cache?: boolean | string[]; // true = all, string[] = namespaces
  /** Storage access */
  storage?: boolean | string[]; // true = all, string[] = paths
  /** Analytics access */
  analytics?: boolean;
  /** Embeddings access */
  embeddings?: boolean;
  /** Event bus access */
  eventBus?: boolean | { publish?: string[]; subscribe?: string[] };
}

/**
 * Permission specification for preset building (declarative format)
 * This is the format used when defining presets and combining them.
 *
 * Design:
 * - Presets declare what plugin WANTS (allow-list only)
 * - No deny - platform enforces hardcoded security patterns
 */
export interface PermissionSpec {
  /** File system permissions */
  fs?: {
    mode?: 'read' | 'readWrite';
    allow?: string[];
  };
  /** Environment variable permissions */
  env?: {
    read?: string[];
  };
  /** Network permissions */
  network?: {
    fetch?: string[];
  };
  /** Platform service permissions */
  platform?: PlatformPermissions;
  /** Shell execution permissions */
  shell?: {
    allow?: string[];
  };
  /** Resource quotas */
  quotas?: {
    timeoutMs?: number;
    memoryMb?: number;
    cpuMs?: number;
  };
}

/**
 * Runtime permission specification (explicit format)
 * This is the format used by plugin-runtime fs-shim.
 * Matches PermissionSpec from @kb-labs/plugin-contracts.
 */
export interface RuntimePermissionSpec {
  /** File system permissions - explicit read/write lists */
  fs?: {
    read?: string[];
    write?: string[];
  };
  /** Environment variable permissions */
  env?: {
    read?: string[];
  };
  /** Network permissions */
  network?: {
    fetch?: string[];
  };
  /** Platform service permissions */
  platform?: PlatformPermissions;
  /** Shell execution permissions */
  shell?: {
    allow?: string[];
  };
  /** Resource quotas */
  quotas?: {
    timeoutMs?: number;
    memoryMb?: number;
    cpuMs?: number;
  };
}

/**
 * A preset is a named permission configuration
 */
export interface PermissionPreset {
  /** Unique preset identifier */
  id: string;
  /** Human-readable description */
  description: string;
  /** The permission spec this preset provides */
  permissions: PermissionSpec;
}

/**
 * Builder for combining multiple presets
 */
export interface PresetBuilder {
  /** Add a preset to the combination */
  with(preset: PermissionPreset | PermissionSpec): PresetBuilder;
  /** Add environment variables to read */
  withEnv(vars: string[]): PresetBuilder;
  /** Add file system permissions */
  withFs(fs: PermissionSpec['fs']): PresetBuilder;
  /** Add network permissions */
  withNetwork(network: PermissionSpec['network']): PresetBuilder;
  /** Add platform service permissions */
  withPlatform(platform: PlatformPermissions): PresetBuilder;
  /** Add shell execution permissions */
  withShell(shell: PermissionSpec['shell']): PresetBuilder;
  /** Add quotas */
  withQuotas(quotas: PermissionSpec['quotas']): PresetBuilder;
  /** Build the final permission spec (converts to runtime format) */
  build(): RuntimePermissionSpec;
}
