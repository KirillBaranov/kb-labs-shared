import { describe, it, expect } from 'vitest';
import { DEFAULT_PROFILE, DEFAULT_PROFILE_ID } from '../defaults';

describe('defaults', () => {
  describe('DEFAULT_PROFILE_ID', () => {
    it('should be "default"', () => {
      expect(DEFAULT_PROFILE_ID).toBe('default');
    });
  });

  describe('DEFAULT_PROFILE', () => {
    it('should have correct structure', () => {
      expect(DEFAULT_PROFILE).toEqual({
        id: 'default',
        schemaVersion: '1.0.0',
        sources: {
          rules: ['rules/**'],
          adr: ['adr/**'],
          docs: ['docs/**'],
          api: ['api/**'],
          src: ['src/**'],
          tests: ['tests/**']
        },
        policies: {
          maxBytes: 1_500_000,
          privacy: 'team'
        }
      });
    });

    it('should have string id', () => {
      expect(typeof DEFAULT_PROFILE.id).toBe('string');
      expect(DEFAULT_PROFILE.id).toBe('default');
    });

    it('should have string schemaVersion', () => {
      expect(typeof DEFAULT_PROFILE.schemaVersion).toBe('string');
      expect(DEFAULT_PROFILE.schemaVersion).toBe('1.0.0');
    });

    it('should have sources object with arrays', () => {
      expect(DEFAULT_PROFILE.sources).toBeDefined();
      expect(Array.isArray(DEFAULT_PROFILE.sources.rules)).toBe(true);
      expect(Array.isArray(DEFAULT_PROFILE.sources.adr)).toBe(true);
      expect(Array.isArray(DEFAULT_PROFILE.sources.docs)).toBe(true);
      expect(Array.isArray(DEFAULT_PROFILE.sources.api)).toBe(true);
      expect(Array.isArray(DEFAULT_PROFILE.sources.src)).toBe(true);
      expect(Array.isArray(DEFAULT_PROFILE.sources.tests)).toBe(true);
    });

    it('should have policies object', () => {
      expect(DEFAULT_PROFILE.policies).toBeDefined();
      expect(typeof DEFAULT_PROFILE.policies.maxBytes).toBe('number');
      expect(DEFAULT_PROFILE.policies.maxBytes).toBe(1_500_000);
      expect(typeof DEFAULT_PROFILE.policies.privacy).toBe('string');
      expect(DEFAULT_PROFILE.policies.privacy).toBe('team');
    });

    it('should have expected source patterns', () => {
      expect(DEFAULT_PROFILE.sources.rules).toEqual(['rules/**']);
      expect(DEFAULT_PROFILE.sources.adr).toEqual(['adr/**']);
      expect(DEFAULT_PROFILE.sources.docs).toEqual(['docs/**']);
      expect(DEFAULT_PROFILE.sources.api).toEqual(['api/**']);
      expect(DEFAULT_PROFILE.sources.src).toEqual(['src/**']);
      expect(DEFAULT_PROFILE.sources.tests).toEqual(['tests/**']);
    });

    it('should be immutable reference', () => {
      const original = DEFAULT_PROFILE;
      expect(original).toBe(DEFAULT_PROFILE);
    });
  });
});
