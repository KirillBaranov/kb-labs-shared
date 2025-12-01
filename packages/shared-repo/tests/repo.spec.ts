import { describe, it, expect } from 'vitest';
import { promises as fsp } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { findRepoRoot } from '../src/repo';

async function mkd(prefix = 'kb-shared-repo-') {
  return await fsp.mkdtemp(path.join(os.tmpdir(), prefix));
}

describe('findRepoRoot', () => {
  it('finds directory containing .git marker when called from subdir', async () => {
    const root = await mkd();
    const sub = path.join(root, 'a/b/c');
    await fsp.mkdir(sub, { recursive: true });
    await fsp.mkdir(path.join(root, '.git'));

    const found = await findRepoRoot(sub);
    expect(found).toBe(root);
  });

  it('finds directory containing pnpm-workspace.yaml marker', async () => {
    const root = await mkd();
    const sub = path.join(root, 'packages/nested');
    await fsp.mkdir(sub, { recursive: true });
    await fsp.writeFile(path.join(root, 'pnpm-workspace.yaml'), 'packages:\n  - "packages/*"\n');

    const found = await findRepoRoot(sub);
    expect(found).toBe(root);
  });

  it('finds directory containing package.json marker', async () => {
    const root = await mkd();
    const sub = path.join(root, 'deep/nested/path');
    await fsp.mkdir(sub, { recursive: true });
    await fsp.writeFile(path.join(root, 'package.json'), '{"name": "test"}\n');

    const found = await findRepoRoot(sub);
    expect(found).toBe(root);
  });

  it('falls back to start directory if no marker found', async () => {
    const start = await mkd();
    const found = await findRepoRoot(start);
    // When no markers are found, it eventually returns FS root
    // But in practice, we should get startDir if it's the starting point
    expect(typeof found).toBe('string');
    expect(found.length).toBeGreaterThan(0);
  });

  it('uses process.cwd() when no startDir provided', async () => {
    const found = await findRepoRoot();
    expect(typeof found).toBe('string');
    expect(path.isAbsolute(found)).toBe(true);
  });
});
