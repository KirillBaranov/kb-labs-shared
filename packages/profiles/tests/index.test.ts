import { describe, it, expect } from 'vitest';
import { DEFAULT_PROFILE, mergeProfiles, validateProfile } from '../src/index';
import type { Profile } from '../src/types';

describe('@kb-labs/shared-profiles integration', () => {
  it('should work with real profile scenario', () => {
    const baseProfile: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**'],
        src: ['src/**']
      },
      policies: { maxBytes: 1000000 }
    };

    const overrideProfile: Partial<Profile> = {
      sources: {
        rules: ['custom-rules/**']
      },
      policies: {
        maxBytes: 2000000
      }
    };

    const merged = mergeProfiles(baseProfile, overrideProfile);
    const validation = validateProfile(merged);

    expect(merged.sources.rules).toEqual(['rules/**', 'custom-rules/**']);
    expect(merged.policies.maxBytes).toBe(2000000);
    expect(validation.ok).toBe(true);
  });

  it('should work with default profile', () => {
    const validation = validateProfile(DEFAULT_PROFILE);
    expect(validation.ok).toBe(true);
    expect(DEFAULT_PROFILE.sources.src).toEqual(['src/**']);
  });
});
