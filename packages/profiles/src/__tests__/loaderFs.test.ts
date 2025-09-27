import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promises as fsp } from 'node:fs';
import path from 'node:path';
import { loadProfileFileFromFS } from '../loaderFs';

// Mock fs promises
vi.mock('node:fs', () => ({
  promises: {
    readFile: vi.fn()
  }
}));

// Mock path
vi.mock('node:path', () => ({
  default: {
    join: vi.fn((...args) => args.join('/'))
  }
}));

describe('loadProfileFileFromFS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load profile from first candidate path', async () => {
    const mockProfile = {
      id: 'test-profile',
      schemaVersion: '1.0.0'
    };

    vi.mocked(fsp.readFile).mockResolvedValueOnce(JSON.stringify(mockProfile));

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      id: 'test-profile'
    });

    expect(result.file).toEqual({
      path: '/repo/profiles/test-profile/profile.json',
      data: mockProfile
    });
    expect(result.diagnostics).toEqual([]);
    expect(fsp.readFile).toHaveBeenCalledWith('/repo/profiles/test-profile/profile.json', 'utf8');
  });

  it('should load profile from second candidate path if first fails', async () => {
    const mockProfile = {
      id: 'test-profile',
      schemaVersion: '1.0.0'
    };

    vi.mocked(fsp.readFile)
      .mockRejectedValueOnce(new Error('ENOENT'))
      .mockResolvedValueOnce(JSON.stringify(mockProfile));

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      id: 'test-profile'
    });

    expect(result.file).toEqual({
      path: '/repo/profiles/test-profile.profile.json',
      data: mockProfile
    });
    expect(result.diagnostics).toEqual([
      {
        level: 'warn',
        code: 'PROFILE_READ_FAILED',
        message: 'Failed to read /repo/profiles/test-profile/profile.json',
        detail: 'Error: ENOENT'
      }
    ]);
    expect(fsp.readFile).toHaveBeenCalledTimes(2);
  });

  it('should return null if both candidates fail with ENOENT', async () => {
    vi.mocked(fsp.readFile)
      .mockRejectedValueOnce({ code: 'ENOENT' })
      .mockRejectedValueOnce({ code: 'ENOENT' });

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      id: 'test-profile'
    });

    expect(result.file).toBeNull();
    expect(result.diagnostics).toEqual([]);
  });

  it('should return diagnostics for non-ENOENT errors', async () => {
    const error = new Error('Permission denied');
    vi.mocked(fsp.readFile)
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce({ code: 'ENOENT' });

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      id: 'test-profile'
    });

    expect(result.file).toBeNull();
    expect(result.diagnostics).toEqual([
      {
        level: 'warn',
        code: 'PROFILE_READ_FAILED',
        message: 'Failed to read /repo/profiles/test-profile/profile.json',
        detail: 'Error: Permission denied'
      }
    ]);
  });

  it('should use custom profilesDir', async () => {
    const mockProfile = {
      id: 'test-profile',
      schemaVersion: '1.0.0'
    };

    vi.mocked(fsp.readFile).mockResolvedValueOnce(JSON.stringify(mockProfile));

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      profilesDir: 'custom-profiles',
      id: 'test-profile'
    });

    expect(result.file).toEqual({
      path: '/repo/custom-profiles/test-profile/profile.json',
      data: mockProfile
    });
    expect(fsp.readFile).toHaveBeenCalledWith('/repo/custom-profiles/test-profile/profile.json', 'utf8');
  });

  it('should handle JSON parsing errors', async () => {
    vi.mocked(fsp.readFile)
      .mockResolvedValueOnce('invalid json')
      .mockRejectedValueOnce({ code: 'ENOENT' });

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      id: 'test-profile'
    });

    expect(result.file).toBeNull();
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]!.code).toBe('PROFILE_READ_FAILED');
  });

  it('should handle multiple non-ENOENT errors', async () => {
    const error1 = new Error('Permission denied');
    const error2 = new Error('Invalid format');

    vi.mocked(fsp.readFile)
      .mockRejectedValueOnce(error1)
      .mockRejectedValueOnce(error2);

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      id: 'test-profile'
    });

    expect(result.file).toBeNull();
    expect(result.diagnostics).toHaveLength(2);
    expect(result.diagnostics[0]!.message).toContain('/repo/profiles/test-profile/profile.json');
    expect(result.diagnostics[1]!.message).toContain('/repo/profiles/test-profile.profile.json');
  });

  it('should handle empty string repoRoot', async () => {
    const mockProfile = {
      id: 'test-profile',
      schemaVersion: '1.0.0'
    };

    vi.mocked(fsp.readFile).mockResolvedValueOnce(JSON.stringify(mockProfile));

    const result = await loadProfileFileFromFS({
      repoRoot: '',
      id: 'test-profile'
    });

    expect(result.file).toEqual({
      path: '/profiles/test-profile/profile.json',
      data: mockProfile
    });
  });

  it('should handle special characters in profile id', async () => {
    const mockProfile = {
      id: 'test-profile-with-dashes',
      schemaVersion: '1.0.0'
    };

    vi.mocked(fsp.readFile).mockResolvedValueOnce(JSON.stringify(mockProfile));

    const result = await loadProfileFileFromFS({
      repoRoot: '/repo',
      id: 'test-profile-with-dashes'
    });

    expect(result.file).toEqual({
      path: '/repo/profiles/test-profile-with-dashes/profile.json',
      data: mockProfile
    });
  });
});
