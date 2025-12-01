import { describe, it, expect } from 'vitest';
import {
  normalizeLineEndings,
  stripAnsi,
  normalizeWhitespace,
  trimLines,
  splitLines,
  estimateTokens,
  truncateByTokens,
  splitMarkdownSections,
  escapeRegExp,
  safeMatchAll,
  highlightMatches,
  normalizeGlob,
  matchGlob,
  dedupGlobs,
  levenshtein,
  similarity,
  longestCommonSubstr,
  takeContext
} from '../index';

describe('@kb-labs/shared-textops exports', () => {
  it('should export normalize functions', () => {
    expect(typeof normalizeLineEndings).toBe('function');
    expect(typeof stripAnsi).toBe('function');
    expect(typeof normalizeWhitespace).toBe('function');
    expect(typeof trimLines).toBe('function');
    expect(typeof splitLines).toBe('function');
    expect(typeof estimateTokens).toBe('function');
    expect(typeof truncateByTokens).toBe('function');
    expect(typeof splitMarkdownSections).toBe('function');
  });

  it('should export regex functions', () => {
    expect(typeof escapeRegExp).toBe('function');
    expect(typeof safeMatchAll).toBe('function');
    expect(typeof highlightMatches).toBe('function');
  });

  it('should export glob functions', () => {
    expect(typeof normalizeGlob).toBe('function');
    expect(typeof matchGlob).toBe('function');
    expect(typeof dedupGlobs).toBe('function');
  });

  it('should export similarity functions', () => {
    expect(typeof levenshtein).toBe('function');
    expect(typeof similarity).toBe('function');
    expect(typeof longestCommonSubstr).toBe('function');
  });

  it('should export snippet functions', () => {
    expect(typeof takeContext).toBe('function');
  });

  it('should work with normalize functions together', () => {
    const input = '  line1  \r\n  line2  \r\n  line3  ';
    const normalized = normalizeLineEndings(input);
    const trimmed = trimLines(normalized);
    const lines = splitLines(trimmed);
    const tokens = estimateTokens(lines.join(' '));

    expect(normalized).toBe('  line1  \n  line2  \n  line3  ');
    expect(trimmed).toBe('  line1\n  line2\n  line3');
    expect(lines).toEqual(['  line1', '  line2', '  line3']);
    expect(tokens).toBe(3);
  });

  it('should work with regex functions together', () => {
    const text = 'hello world hello';
    const escaped = escapeRegExp('hello');
    const regex = new RegExp(escaped, 'g');
    const matches = safeMatchAll(text, regex);
    const highlighted = highlightMatches(text, regex);

    expect(escaped).toBe('hello');
    expect(matches).toHaveLength(2);
    expect(highlighted).toBe('[[hello]] world [[hello]]');
  });

  it('should work with glob functions together', () => {
    const patterns = ['src//*.ts', 'src/*.ts', 'lib/*.js'];
    const normalized = patterns.map(normalizeGlob);
    const deduped = dedupGlobs(patterns);
    const matched = matchGlob('src/file.ts', deduped);

    expect(normalized).toEqual(['src/*.ts', 'src/*.ts', 'lib/*.js']);
    expect(deduped).toEqual(['src/*.ts', 'lib/*.js']);
    expect(matched).toBe(true);
  });

  it('should work with similarity functions together', () => {
    const text1 = 'hello world';
    const text2 = 'hello world!';
    const distance = levenshtein(text1, text2);
    const sim = similarity(text1, text2);
    const common = longestCommonSubstr(text1, text2);

    expect(distance).toBe(1);
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
    expect(common).toBe('hello world');
  });

  it('should work with snippet functions', () => {
    const text = 'line1\nline2\nline3\nline4\nline5';
    const context = takeContext(text, 3);

    expect(context.start).toBe(1);
    expect(context.end).toBe(5);
    expect(context.lines).toEqual(['line1', 'line2', 'line3', 'line4', 'line5']);
  });

  it('should handle complex workflow with multiple functions', () => {
    const input = `  # Section 1  
  content with   multiple   spaces
  more content
  
  # Section 2
  final content  `;

    // Normalize and clean up
    const normalized = normalizeLineEndings(input);
    const trimmed = trimLines(normalized);
    const sections = splitMarkdownSections(trimmed);

    // Process content
    const allContent = sections.map(s => s.body).join('\n');
    const tokens = estimateTokens(allContent);
    const truncated = truncateByTokens(allContent, 10);

    expect(sections).toHaveLength(1);
    expect(sections[0]!.heading).toBe('Intro');
    expect(tokens).toBeGreaterThan(0);
    expect(truncated.length).toBeLessThanOrEqual(allContent.length);
  });

  it('should handle text processing pipeline', () => {
    const input = '  Hello   World  \r\n  Test   Content  ';

    // Step 1: Normalize line endings
    const step1 = normalizeLineEndings(input);
    expect(step1).toBe('  Hello   World  \n  Test   Content  ');

    // Step 2: Normalize whitespace
    const step2 = normalizeWhitespace(step1);
    expect(step2).toBe('Hello World\nTest Content');

    // Step 3: Trim lines
    const step3 = trimLines(step2);
    expect(step3).toBe('Hello World\nTest Content');

    // Step 4: Split into lines
    const step4 = splitLines(step3);
    expect(step4).toEqual(['Hello World', 'Test Content']);

    // Step 5: Estimate tokens
    const step5 = estimateTokens(step4.join(' '));
    expect(step5).toBe(4);
  });
});
