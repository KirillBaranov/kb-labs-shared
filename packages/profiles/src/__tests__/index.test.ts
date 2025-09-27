import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROFILE_ID,
  mergeProfiles,
  validateProfile,
  loadProfileFileFromFS,
  resolveProfile
} from '../index';
import type { Profile } from '../types';

describe('@kb-labs/shared-profiles exports', () => {
  it('should export DEFAULT_PROFILE constant', () => {
    expect(DEFAULT_PROFILE).toBeDefined();
    expect(DEFAULT_PROFILE.id).toBe('default');
    expect(DEFAULT_PROFILE.schemaVersion).toBe('1.0.0');
  });

  it('should export DEFAULT_PROFILE_ID constant', () => {
    expect(DEFAULT_PROFILE_ID).toBe('default');
  });

  it('should export mergeProfiles function', () => {
    expect(typeof mergeProfiles).toBe('function');
  });

  it('should export validateProfile function', () => {
    expect(typeof validateProfile).toBe('function');
  });

  it('should export loadProfileFileFromFS function', () => {
    expect(typeof loadProfileFileFromFS).toBe('function');
  });

  it('should export resolveProfile function', () => {
    expect(typeof resolveProfile).toBe('function');
  });

  it('should export types', () => {
    // Test that types are properly exported by checking if we can use them
    const profile: Profile = {
      id: 'test-profile',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**'],
        src: ['src/**']
      },
      policies: { maxBytes: 1000000, privacy: 'team' }
    };

    const validation = validateProfile(profile);
    expect(validation.ok).toBe(true);
  });

  it('should work with all exported functions together', () => {
    const base: Profile = {
      id: 'base',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**'],
        src: ['src/**']
      }
    };

    const override: Partial<Profile> = {
      id: 'override',
      sources: {
        rules: ['custom-rules/**']
      }
    };

    const merged = mergeProfiles(base, override);
    const validation = validateProfile(merged);

    expect(merged.id).toBe('override');
    expect(merged.sources!.rules).toEqual(['rules/**', 'custom-rules/**']);
    expect(validation.ok).toBe(true);
  });

  it('should work with default profile', () => {
    const validation = validateProfile(DEFAULT_PROFILE);
    expect(validation.ok).toBe(true);
    expect(DEFAULT_PROFILE.id).toBe(DEFAULT_PROFILE_ID);
  });
});
