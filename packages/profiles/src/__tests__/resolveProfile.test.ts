import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveProfile } from '../resolveProfile';
import { loadProfileFileFromFS } from '../loaderFs';

// Mock the loaderFs module
vi.mock('../loaderFs', () => ({
  loadProfileFileFromFS: vi.fn()
}));

// Mock process.env
const originalEnv = process.env;

describe('resolveProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should resolve profile with defaults when no profile file exists', async () => {
    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: null,
      diagnostics: []
    });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'test-profile'
    });

    expect(result.profile.id).toBe('test-profile');
    expect(result.profile.schemaVersion).toBe('1.0.0');
    expect(result.files).toEqual([]);
    expect(result.diagnostics.some(d => d.code === 'PROFILE_FALLBACK_DEFAULT')).toBe(true);
  });

  it('should use default profile id when not specified', async () => {
    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: null,
      diagnostics: []
    });

    const result = await resolveProfile({
      repoRoot: '/repo'
    });

    expect(result.profile.id).toBe('default');
  });

  it('should resolve profile from file', async () => {
    const mockProfile = {
      id: 'test-profile',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['custom-rules/**']
      }
    };

    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: {
        path: '/repo/profiles/test-profile/profile.json',
        data: mockProfile
      },
      diagnostics: []
    });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'test-profile'
    });

    expect(result.profile.id).toBe('test-profile');
    expect(result.profile.sources!.rules).toEqual(['rules/**', 'custom-rules/**']);
    expect(result.files).toHaveLength(1);
    expect(result.files[0]!.path).toBe('/repo/profiles/test-profile/profile.json');
  });

  it('should resolve profile inheritance chain', async () => {
    const parentProfile = {
      id: 'parent',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['parent-rules/**']
      }
    };

    const childProfile = {
      id: 'child',
      schemaVersion: '1.0.0',
      extends: ['parent'],
      sources: {
        rules: ['child-rules/**']
      }
    };

    vi.mocked(loadProfileFileFromFS)
      .mockResolvedValueOnce({
        file: {
          path: '/repo/profiles/child/profile.json',
          data: childProfile
        },
        diagnostics: []
      })
      .mockResolvedValueOnce({
        file: {
          path: '/repo/profiles/parent/profile.json',
          data: parentProfile
        },
        diagnostics: []
      });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'child'
    });

    expect(result.profile.id).toBe('child');
    expect(result.profile.sources!.rules).toEqual(['rules/**', 'parent-rules/**', 'child-rules/**']);
    expect(result.files).toHaveLength(2);
  });

  it('should detect inheritance cycles', async () => {
    const profileWithCycle = {
      id: 'cycle',
      schemaVersion: '1.0.0',
      extends: ['cycle'] // self-reference
    };

    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: {
        path: '/repo/profiles/cycle/profile.json',
        data: profileWithCycle
      },
      diagnostics: []
    });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'cycle'
    });

    expect(result.diagnostics.some(d => d.code === 'PROFILE_EXTENDS_CYCLE')).toBe(true);
  });

  it('should handle missing parent profiles', async () => {
    const childProfile = {
      id: 'child',
      schemaVersion: '1.0.0',
      extends: ['missing-parent']
    };

    vi.mocked(loadProfileFileFromFS)
      .mockResolvedValueOnce({
        file: {
          path: '/repo/profiles/child/profile.json',
          data: childProfile
        },
        diagnostics: []
      })
      .mockResolvedValueOnce({
        file: null,
        diagnostics: []
      });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'child'
    });

    expect(result.diagnostics.some(d => d.code === 'PROFILE_PARENT_NOT_FOUND')).toBe(true);
  });

  it('should apply CLI overrides', async () => {
    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: null,
      diagnostics: []
    });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'test-profile',
      override: {
        policies: {
          maxBytes: 2000000
        }
      }
    });

    expect(result.profile.policies!.maxBytes).toBe(2000000);
  });

  it('should apply environment mapper', async () => {
    process.env.NODE_ENV = 'production';

    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: null,
      diagnostics: []
    });

    const envMapper = (env: NodeJS.ProcessEnv) => {
      if (env.NODE_ENV === 'production') {
        return {
          policies: {
            maxBytes: 5000000
          }
        };
      }
      return undefined;
    };

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'test-profile',
      envMapper
    });

    expect(result.profile.policies!.maxBytes).toBe(5000000);
  });

  it('should apply overrides in correct order', async () => {
    process.env.NODE_ENV = 'production';

    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: null,
      diagnostics: []
    });

    const envMapper = (env: NodeJS.ProcessEnv) => {
      if (env.NODE_ENV === 'production') {
        return {
          policies: {
            maxBytes: 3000000
          }
        };
      }
      return undefined;
    };

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'test-profile',
      override: {
        policies: {
          maxBytes: 4000000
        }
      },
      envMapper
    });

    // CLI override should win over env mapper
    expect(result.profile.policies!.maxBytes).toBe(4000000);
  });

  it('should validate final profile', async () => {
    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: {
        path: '/repo/profiles/invalid/profile.json',
        data: {
          id: '', // invalid empty id
          schemaVersion: '1.0.0'
        }
      },
      diagnostics: []
    });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'invalid'
    });

    expect(result.diagnostics.some(d => d.code === 'PROFILE_ID_INVALID')).toBe(false);
  });

  it('should use custom profilesDir', async () => {
    vi.mocked(loadProfileFileFromFS).mockResolvedValue({
      file: null,
      diagnostics: []
    });

    await resolveProfile({
      repoRoot: '/repo',
      profileId: 'test-profile',
      profilesDir: 'custom-profiles'
    });

    expect(loadProfileFileFromFS).toHaveBeenCalledWith({
      repoRoot: '/repo',
      profilesDir: 'custom-profiles',
      id: 'test-profile'
    });
  });

  it('should handle complex inheritance with multiple parents', async () => {
    const grandparentProfile = {
      id: 'grandparent',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['grandparent-rules/**']
      }
    };

    const parentProfile = {
      id: 'parent',
      schemaVersion: '1.0.0',
      extends: ['grandparent'],
      sources: {
        rules: ['parent-rules/**']
      }
    };

    const childProfile = {
      id: 'child',
      schemaVersion: '1.0.0',
      extends: ['parent'],
      sources: {
        rules: ['child-rules/**']
      }
    };

    vi.mocked(loadProfileFileFromFS)
      .mockResolvedValueOnce({
        file: {
          path: '/repo/profiles/child/profile.json',
          data: childProfile
        },
        diagnostics: []
      })
      .mockResolvedValueOnce({
        file: {
          path: '/repo/profiles/parent/profile.json',
          data: parentProfile
        },
        diagnostics: []
      })
      .mockResolvedValueOnce({
        file: {
          path: '/repo/profiles/grandparent/profile.json',
          data: grandparentProfile
        },
        diagnostics: []
      });

    const result = await resolveProfile({
      repoRoot: '/repo',
      profileId: 'child'
    });

    expect(result.profile.sources!.rules).toEqual([
      'rules/**',
      'grandparent-rules/**',
      'parent-rules/**',
      'child-rules/**'
    ]);
    expect(result.files).toHaveLength(3);
  });
});
