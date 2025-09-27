import { describe, it, expect } from 'vitest';
import { mergeProfiles } from '../merge';
import type { Profile } from '../types';

describe('mergeProfiles', () => {
  it('should merge basic profile properties', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**'],
        src: ['src/**']
      }
    };

    const over: Partial<Profile> = {
      id: 'override',
      schemaVersion: '2.0.0'
    };

    const result = mergeProfiles(base, over);

    expect(result.id).toBe('override');
    expect(result.schemaVersion).toBe('2.0.0');
    expect(result.sources).toEqual({
      rules: ['rules/**'],
      src: ['src/**']
    });
  });

  it('should merge extends arrays with deduplication', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      extends: ['parent1', 'parent2']
    };

    const over: Partial<Profile> = {
      extends: ['parent2', 'parent3']
    };

    const result = mergeProfiles(base, over);

    expect(result.extends).toEqual(['parent1', 'parent2', 'parent3']);
  });

  it('should handle undefined extends', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0'
    };

    const over: Partial<Profile> = {
      extends: ['parent1']
    };

    const result = mergeProfiles(base, over);

    expect(result.extends).toEqual(['parent1']);
  });

  it('should merge sources with deduplication', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**', 'custom-rules/**'],
        src: ['src/**']
      }
    };

    const over: Partial<Profile> = {
      sources: {
        rules: ['rules/**', 'new-rules/**'],
        tests: ['tests/**']
      }
    };

    const result = mergeProfiles(base, over);

    expect(result.sources).toEqual({
      rules: ['rules/**', 'custom-rules/**', 'new-rules/**'],
      adr: [],
      docs: [],
      api: [],
      src: ['src/**'],
      tests: ['tests/**']
    });
  });

  it('should handle undefined sources', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0'
    };

    const over: Partial<Profile> = {
      sources: {
        rules: ['rules/**']
      }
    };

    const result = mergeProfiles(base, over);

    expect(result.sources).toEqual({
      rules: ['rules/**'],
      adr: [],
      docs: [],
      api: [],
      src: [],
      tests: []
    });
  });

  it('should merge policies', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      policies: {
        maxBytes: 1000000,
        privacy: 'team'
      }
    };

    const over: Partial<Profile> = {
      policies: {
        maxBytes: 2000000,
        timeout: 30
      }
    };

    const result = mergeProfiles(base, over);

    expect(result.policies).toEqual({
      maxBytes: 2000000,
      privacy: 'team',
      timeout: 30
    });
  });

  it('should merge meta', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      meta: {
        author: 'team',
        version: '1.0'
      }
    };

    const over: Partial<Profile> = {
      meta: {
        version: '2.0',
        description: 'Updated profile'
      }
    };

    const result = mergeProfiles(base, over);

    expect(result.meta).toEqual({
      author: 'team',
      version: '2.0',
      description: 'Updated profile'
    });
  });

  it('should handle undefined policies and meta', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0'
    };

    const over: Partial<Profile> = {
      policies: {
        maxBytes: 1000000
      },
      meta: {
        author: 'team'
      }
    };

    const result = mergeProfiles(base, over);

    expect(result.policies).toEqual({
      maxBytes: 1000000
    });
    expect(result.meta).toEqual({
      author: 'team'
    });
  });

  it('should handle boundaries property', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      boundaries: { enabled: true }
    };

    const over: Partial<Profile> = {
      boundaries: { enabled: false }
    };

    const result = mergeProfiles(base, over);

    expect(result.boundaries).toEqual({ enabled: false });
  });

  it('should handle undefined boundaries', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      boundaries: { enabled: true }
    };

    const over: Partial<Profile> = {
      boundaries: undefined
    };

    const result = mergeProfiles(base, over);

    expect(result.boundaries).toEqual({ enabled: true });
  });

  it('should preserve base properties when not overridden', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**'],
        src: ['src/**']
      },
      policies: {
        maxBytes: 1000000
      },
      meta: {
        author: 'team'
      }
    };

    const over: Partial<Profile> = {
      id: 'override'
    };

    const result = mergeProfiles(base, over);

    expect(result).toEqual({
      id: 'override',
      schemaVersion: '1.0.0',
      extends: [],
      sources: {
        rules: ['rules/**'],
        src: ['src/**']
      },
      policies: {
        maxBytes: 1000000
      },
      meta: {
        author: 'team'
      }
    });
  });

  it('should handle empty override object', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**']
      }
    };

    const over: Partial<Profile> = {};

    const result = mergeProfiles(base, over);

    expect(result).toEqual({
      ...base,
      extends: [],
      sources: {
        rules: ['rules/**']
      }
    });
  });
});
