/**
 * Repository root discovery. Pure infrastructure, no domain keys.
 */

import path from 'node:path';
import { promises as fsp } from 'node:fs';

const markers = ['.git', 'pnpm-workspace.yaml', 'package.json'];

/**
 * Find repository root by looking for markers (.git, pnpm-workspace.yaml, package.json)
 * @param startDir - Starting directory (defaults to process.cwd())
 * @returns Path to repository root
 */
export async function findRepoRoot(startDir = process.cwd()): Promise<string> {
  let dir = path.resolve(startDir);
  while (true) {
    for (const m of markers) {
      try {
        await fsp.access(path.join(dir, m));
        return dir;
      } catch {
        /* continue */
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return dir; // FS root as fallback
    }
    dir = parent;
  }
}
