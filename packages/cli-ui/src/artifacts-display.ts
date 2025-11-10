import path from 'node:path';
import { promises as fsp } from 'node:fs';
import { safeColors } from './colors';
import { formatSize, formatRelativeTime } from './format';

export interface ArtifactInfo {
  name: string;
  path: string;
  size?: number;
  modified?: Date;
  description: string;
}

export interface ArtifactDisplayOptions {
  showSize?: boolean;
  showTime?: boolean;
  showDescription?: boolean;
  maxItems?: number;
  title?: string;
  groupBy?: 'none' | 'type' | 'time';
}

/**
 * Display artifacts information in CLI
 */
export function displayArtifacts(
  artifacts: ArtifactInfo[],
  options: ArtifactDisplayOptions = {}
): string[] {
  const {
    showSize = true,
    showTime = true,
    showDescription = false,
    maxItems = 10,
    title = 'Generated Artifacts',
    groupBy = 'none'
  } = options;

  if (artifacts.length === 0) {
    return [];
  }

  // Sort and limit artifacts
  let sortedArtifacts = artifacts;
  
  if (groupBy === 'time') {
    // Sort by modification time (newest first)
    sortedArtifacts = artifacts
      .filter(artifact => artifact.modified)
      .sort((a, b) => (b.modified?.getTime() || 0) - (a.modified?.getTime() || 0));
  } else if (groupBy === 'type') {
    // Sort by type/name
    sortedArtifacts = artifacts.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Default: sort by time (newest first) for better UX
    sortedArtifacts = artifacts
      .filter(artifact => artifact.modified)
      .sort((a, b) => (b.modified?.getTime() || 0) - (a.modified?.getTime() || 0));
  }
  
  sortedArtifacts = sortedArtifacts.slice(0, maxItems);

  const lines: string[] = [];
  
  if (title) {
    lines.push('');
    lines.push(safeColors.bold(title));
  }

  if (groupBy === 'type') {
    // Group by artifact type
    const grouped = sortedArtifacts.reduce((acc, artifact) => {
      const type = artifact.name.split(' ')[0] || 'Other'; // First word as type
      if (!acc[type]) {acc[type] = [];}
      acc[type].push(artifact);
      return acc;
    }, {} as Record<string, ArtifactInfo[]>);

    Object.entries(grouped).forEach(([type, typeArtifacts]) => {
      lines.push(`  ${safeColors.dim(type)}:`);
      typeArtifacts.forEach(artifact => {
        lines.push(formatArtifactLine(artifact, { showSize, showTime, showDescription, indent: 4 }));
      });
    });
  } else {
    // Simple list
    sortedArtifacts.forEach(artifact => {
      lines.push(formatArtifactLine(artifact, { showSize, showTime, showDescription }));
    });
  }

  return lines;
}

/**
 * Format a single artifact line
 */
function formatArtifactLine(
  artifact: ArtifactInfo,
  options: {
    showSize: boolean;
    showTime: boolean;
    showDescription: boolean;
    indent?: number;
  }
): string {
  const { showSize, showTime, showDescription, indent = 2 } = options;
  const parts: string[] = [];
  
  // Name
  parts.push(safeColors.bold(artifact.name));
  
  // Path (relative)
  const relativePath = path.relative(process.cwd(), artifact.path);
  parts.push(safeColors.info(relativePath));
  
  // Size
  if (showSize && artifact.size) {
    parts.push(`(${formatSize(artifact.size)})`);
  }
  
  // Time
  if (showTime && artifact.modified) {
    parts.push(`- ${formatRelativeTime(artifact.modified)}`);
  }
  
  // Description
  if (showDescription && artifact.description) {
    parts.push(`- ${artifact.description}`);
  }
  
  const indentStr = ' '.repeat(indent);
  return `${indentStr}${parts.join(' ')}`;
}

/**
 * Display a single artifact with full details
 */
export function displaySingleArtifact(artifact: ArtifactInfo, title?: string): string[] {
  const relativePath = path.relative(process.cwd(), artifact.path);
  const lines: string[] = [];
  
  if (title) {
    lines.push('');
    lines.push(safeColors.bold(title));
  }
  
  lines.push(`  ${safeColors.bold(artifact.name)}: ${safeColors.info(relativePath)}`);
  
  if (artifact.size) {
    lines.push(`    Size: ${formatSize(artifact.size)}`);
  }
  
  if (artifact.modified) {
    lines.push(`    Modified: ${formatRelativeTime(artifact.modified)}`);
  }
  
  if (artifact.description) {
    lines.push(`    Description: ${artifact.description}`);
  }
  
  return lines;
}

/**
 * Display artifacts in a compact format (for status-like displays)
 */
export function displayArtifactsCompact(
  artifacts: ArtifactInfo[],
  options: { maxItems?: number; showSize?: boolean; sortByTime?: boolean } = {}
): string[] {
  const { maxItems = 5, showSize = true, sortByTime = true } = options;
  
  if (artifacts.length === 0) {
    return [];
  }

  // Sort artifacts by modification time (newest first) by default
  const sortedArtifacts = sortByTime 
    ? artifacts
        .filter(artifact => artifact.modified)
        .sort((a, b) => (b.modified?.getTime() || 0) - (a.modified?.getTime() || 0))
        .slice(0, maxItems)
    : artifacts.slice(0, maxItems);

  return [
    '',
    safeColors.bold('Artifacts:'),
    ...sortedArtifacts.map(artifact => {
      const parts: string[] = [];
      parts.push(safeColors.bold(artifact.name));
      
      const relativePath = path.relative(process.cwd(), artifact.path);
      parts.push(safeColors.info(relativePath));
      
      if (showSize && artifact.size) {
        parts.push(`(${formatSize(artifact.size)})`);
      }
      
      if (artifact.modified) {
        parts.push(`- ${formatRelativeTime(artifact.modified)}`);
      }
      
      return `  ${parts.join(' ')}`;
    })
  ];
}

/**
 * Discover artifacts in a directory based on patterns
 * 
 * @param baseDir - Base directory to search for artifacts
 * @param patterns - Array of artifact patterns to search for
 * @returns Array of discovered artifacts
 * 
 * @example
 * ```typescript
 * const artifacts = await discoverArtifacts('.kb/mind', [
 *   { name: 'Index', pattern: 'index.json', description: 'Main index' },
 *   { name: 'API Index', pattern: 'api-index.json', description: 'API index' },
 * ]);
 * ```
 */
export async function discoverArtifacts(
  baseDir: string,
  patterns: Array<{ name: string; pattern: string; description?: string }>
): Promise<ArtifactInfo[]> {
  const artifacts: ArtifactInfo[] = [];

  for (const artifact of patterns) {
    const artifactPath = path.join(baseDir, artifact.pattern);
    try {
      await fsp.access(artifactPath);
      const stats = await fsp.stat(artifactPath);
      artifacts.push({
        name: artifact.name,
        path: artifactPath,
        size: stats.size,
        modified: stats.mtime,
        description: artifact.description || ''
      });
    } catch {
      // Skip if file doesn't exist
    }
  }

  return artifacts;
}
