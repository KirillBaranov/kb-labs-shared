import { describe, it, expect } from 'vitest';
import { validateProfile } from '../validate';
import type { Profile } from '../types';

describe('validateProfile', () => {
  it('should validate a correct profile', () => {
    const profile: Profile = {
      id: 'test-profile',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**'],
        adr: ['adr/**'],
        docs: ['docs/**'],
        api: ['api/**'],
        src: ['src/**'],
        tests: ['tests/**']
      },
      policies: { maxBytes: 1000000, privacy: 'team' }
    };

    const result = validateProfile(profile);

    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it('should fail validation for missing id', () => {
    const profile = {
      schemaVersion: '1.0.0'
    } as any;

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      {
        level: 'error',
        code: 'PROFILE_ID_INVALID',
        message: 'Profile.id must be a non-empty string'
      }
    ]);
  });

  it('should fail validation for empty string id', () => {
    const profile: Profile = {
      id: '',
      schemaVersion: '1.0.0'
    };

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      {
        level: 'error',
        code: 'PROFILE_ID_INVALID',
        message: 'Profile.id must be a non-empty string'
      }
    ]);
  });

  it('should fail validation for non-string id', () => {
    const profile = {
      id: 123,
      schemaVersion: '1.0.0'
    } as any;

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      {
        level: 'error',
        code: 'PROFILE_ID_INVALID',
        message: 'Profile.id must be a non-empty string'
      }
    ]);
  });

  it('should fail validation for missing schemaVersion', () => {
    const profile = {
      id: 'test-profile'
    } as any;

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      {
        level: 'error',
        code: 'SCHEMA_VERSION_INVALID',
        message: 'schemaVersion must be a string'
      }
    ]);
  });

  it('should fail validation for non-string schemaVersion', () => {
    const profile = {
      id: 'test-profile',
      schemaVersion: 123
    } as any;

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      {
        level: 'error',
        code: 'SCHEMA_VERSION_INVALID',
        message: 'schemaVersion must be a string'
      }
    ]);
  });

  it('should validate sources shape', () => {
    const profile: Profile = {
      id: 'test-profile',
      schemaVersion: '1.0.0',
      sources: {
        rules: 'not-an-array',
        adr: ['adr/**'],
        docs: ['docs/**'],
        api: ['api/**'],
        src: ['src/**'],
        tests: ['tests/**']
      } as any
    };

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toEqual([
      {
        level: 'error',
        code: 'SOURCES_SHAPE_INVALID',
        message: 'sources.rules must be an array of globs'
      }
    ]);
  });

  it('should validate all source properties', () => {
    const profile: Profile = {
      id: 'test-profile',
      schemaVersion: '1.0.0',
      sources: {
        rules: 'not-an-array',
        adr: 'not-an-array',
        docs: 'not-an-array',
        api: 'not-an-array',
        src: 'not-an-array',
        tests: 'not-an-array'
      } as any
    };

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toHaveLength(6);
    expect(result.diagnostics.map(d => d.code)).toEqual([
      'SOURCES_SHAPE_INVALID',
      'SOURCES_SHAPE_INVALID',
      'SOURCES_SHAPE_INVALID',
      'SOURCES_SHAPE_INVALID',
      'SOURCES_SHAPE_INVALID',
      'SOURCES_SHAPE_INVALID'
    ]);
  });

  it('should allow undefined sources', () => {
    const profile: Profile = {
      id: 'test-profile',
      schemaVersion: '1.0.0'
    };

    const result = validateProfile(profile);

    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it('should allow undefined source properties', () => {
    const profile: Profile = {
      id: 'test-profile',
      schemaVersion: '1.0.0',
      sources: {
        rules: ['rules/**']
      }
    };

    const result = validateProfile(profile);

    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it('should allow empty arrays for source properties', () => {
    const profile: Profile = {
      id: 'test-profile',
      schemaVersion: '1.0.0',
      sources: {
        rules: [],
        adr: [],
        docs: [],
        api: [],
        src: [],
        tests: []
      }
    };

    const result = validateProfile(profile);

    expect(result.ok).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it('should handle multiple validation errors', () => {
    const profile = {
      id: '',
      schemaVersion: 123,
      sources: {
        rules: 'not-an-array'
      }
    } as any;

    const result = validateProfile(profile);

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toHaveLength(3);
    expect(result.diagnostics.map(d => d.code)).toEqual([
      'PROFILE_ID_INVALID',
      'SCHEMA_VERSION_INVALID',
      'SOURCES_SHAPE_INVALID'
    ]);
  });
});
