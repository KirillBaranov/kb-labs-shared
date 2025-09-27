import { describe, it, expect } from 'vitest';
import {
  normalizeLineEndings,
  stripAnsi,
  matchGlob,
  similarity,
  takeContext
} from '../src/index';

describe('@kb-labs/shared-textops integration', () => {
  it('should work with real text processing scenario', () => {
    const input = `  # Section 1  
  content with   multiple   spaces\r\n
  more content
  
  # Section 2
  final content  `;

    // Normalize and clean up
    const normalized = normalizeLineEndings(input);
    const stripped = stripAnsi(normalized);

    // Test glob matching
    const matchesGlob = matchGlob('src/utils/helper.ts', ['src/**/*.ts']);

    // Test similarity
    const sim = similarity('hello world', 'hello world!');

    // Test context extraction
    const context = takeContext(stripped, 3);

    expect(normalized).toContain('\n');
    expect(stripped).toBe(normalized);
    expect(matchesGlob).toBe(true);
    expect(sim).toBeGreaterThan(0.9);
    expect(context.lines.length).toBeGreaterThan(0);
  });

  it('should work with ANSI escape sequences', () => {
    const input = '\u001B[31mred text\u001B[0m normal text';
    const stripped = stripAnsi(input);

    expect(stripped).toBe('red text normal text');
  });
});
