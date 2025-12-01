import { describe, it, expect } from 'vitest';
import {
  normalizeLineEndings,
  stripAnsi,
  normalizeWhitespace,
  trimLines,
  splitLines,
  estimateTokens,
  truncateByTokens,
  splitMarkdownSections
} from '../normalize';

describe('normalizeLineEndings', () => {
  it('should normalize CRLF to LF', () => {
    expect(normalizeLineEndings('line1\r\nline2\r\nline3')).toBe('line1\nline2\nline3');
  });

  it('should normalize CR to LF', () => {
    expect(normalizeLineEndings('line1\rline2\rline3')).toBe('line1\nline2\nline3');
  });

  it('should handle mixed line endings', () => {
    expect(normalizeLineEndings('line1\r\nline2\rline3\nline4')).toBe('line1\nline2\nline3\nline4');
  });

  it('should handle empty string', () => {
    expect(normalizeLineEndings('')).toBe('');
  });

  it('should handle string with no line endings', () => {
    expect(normalizeLineEndings('single line')).toBe('single line');
  });

  it('should handle already normalized string', () => {
    expect(normalizeLineEndings('line1\nline2\nline3')).toBe('line1\nline2\nline3');
  });
});

describe('stripAnsi', () => {
  it('should remove ANSI escape sequences', () => {
    const input = '\u001B[31mred text\u001B[0m normal text \u001B[32mgreen text\u001B[0m';
    expect(stripAnsi(input)).toBe('red text normal text green text');
  });

  it('should handle empty string', () => {
    expect(stripAnsi('')).toBe('');
  });

  it('should handle string with no ANSI codes', () => {
    expect(stripAnsi('normal text')).toBe('normal text');
  });

  it('should handle complex ANSI sequences', () => {
    const input = '\u001B[1;31;42mbold red on green\u001B[0m';
    expect(stripAnsi(input)).toBe('bold red on green');
  });
});

describe('normalizeWhitespace', () => {
  it('should collapse multiple spaces to single spaces', () => {
    expect(normalizeWhitespace('line1    line2')).toBe('line1 line2');
  });

  it('should preserve newlines', () => {
    expect(normalizeWhitespace('line1\n\nline2')).toBe('line1\n\nline2');
  });

  it('should trim each line', () => {
    expect(normalizeWhitespace('  line1  \n  line2  ')).toBe('line1\nline2');
  });

  it('should handle tabs and other whitespace', () => {
    expect(normalizeWhitespace('line1\t\tline2')).toBe('line1 line2');
  });

  it('should handle empty string', () => {
    expect(normalizeWhitespace('')).toBe('');
  });
});

describe('trimLines', () => {
  it('should trim each line and remove leading/trailing empty lines', () => {
    const input = '\n  \n  line1  \n  line2  \n  \n';
    expect(trimLines(input)).toBe('  line1\n  line2');
  });

  it('should handle CRLF line endings', () => {
    const input = '\r\n  line1  \r\n  line2  \r\n';
    expect(trimLines(input)).toBe('  line1\n  line2');
  });

  it('should handle single line with whitespace', () => {
    expect(trimLines('  single line  ')).toBe('  single line');
  });

  it('should handle all empty lines', () => {
    expect(trimLines('\n  \n  \n')).toBe('');
  });

  it('should handle empty string', () => {
    expect(trimLines('')).toBe('');
  });
});

describe('splitLines', () => {
  it('should split string into lines', () => {
    expect(splitLines('line1\nline2\nline3')).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle CRLF line endings', () => {
    expect(splitLines('line1\r\nline2\r\nline3')).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle empty string', () => {
    expect(splitLines('')).toEqual([]);
  });

  it('should handle single line', () => {
    expect(splitLines('single line')).toEqual(['single line']);
  });

  it('should handle trailing newline', () => {
    expect(splitLines('line1\nline2\n')).toEqual(['line1', 'line2', '']);
  });
});

describe('estimateTokens', () => {
  it('should estimate tokens in text', () => {
    expect(estimateTokens('hello world')).toBe(2);
  });

  it('should handle empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });

  it('should handle whitespace-only string', () => {
    expect(estimateTokens('   ')).toBe(0);
  });

  it('should split on punctuation', () => {
    expect(estimateTokens('hello, world!')).toBe(2);
  });

  it('should split on various separators', () => {
    expect(estimateTokens('hello-world+test=123')).toBe(4);
  });

  it('should filter out empty parts', () => {
    expect(estimateTokens('hello,,,world')).toBe(2);
  });
});

describe('truncateByTokens', () => {
  it('should truncate by tokens preserving lines by default', () => {
    const input = 'line1\nline2\nline3';
    expect(truncateByTokens(input, 2)).toBe('line1\nline2');
  });

  it('should return original if within token limit', () => {
    const input = 'short text';
    expect(truncateByTokens(input, 10)).toBe('short text');
  });

  it('should handle empty string', () => {
    expect(truncateByTokens('', 10)).toBe('');
  });

  it('should truncate word-wise when preserveLines is false', () => {
    const input = 'word1 word2 word3 word4';
    expect(truncateByTokens(input, 3, { preserveLines: false })).toBe('word1 word2 word3');
  });

  it('should handle single line truncation', () => {
    const input = 'very long line with many words';
    expect(truncateByTokens(input, 3, { preserveLines: false })).toBe('very long line');
  });

  it('should handle zero tokens', () => {
    const input = 'any text';
    expect(truncateByTokens(input, 0)).toBe('');
  });
});

describe('splitMarkdownSections', () => {
  it('should split markdown by headings', () => {
    const input = `# Section 1
content 1

## Subsection 1.1
content 1.1

# Section 2
content 2`;

    const result = splitMarkdownSections(input);

    expect(result).toEqual([
      { heading: 'Section 1', body: 'content 1\n' },
      { heading: 'Subsection 1.1', body: 'content 1.1\n' },
      { heading: 'Section 2', body: 'content 2' }
    ]);
  });

  it('should handle content before first heading', () => {
    const input = `intro content

# Section 1
content 1`;

    const result = splitMarkdownSections(input);

    expect(result).toEqual([
      { heading: 'Intro', body: 'intro content\n' },
      { heading: 'Section 1', body: 'content 1' }
    ]);
  });

  it('should handle H1, H2, H3 headings', () => {
    const input = `# H1
content 1

## H2
content 2

### H3
content 3`;

    const result = splitMarkdownSections(input);

    expect(result).toEqual([
      { heading: 'H1', body: 'content 1\n' },
      { heading: 'H2', body: 'content 2\n' },
      { heading: 'H3', body: 'content 3' }
    ]);
  });

  it('should ignore H4+ headings', () => {
    const input = `# H1
content 1

#### H4
content 4`;

    const result = splitMarkdownSections(input);

    expect(result).toEqual([
      { heading: 'H1', body: 'content 1\n\n#### H4\ncontent 4' }
    ]);
  });

  it('should handle empty input', () => {
    expect(splitMarkdownSections('')).toEqual([]);
  });

  it('should handle content without headings', () => {
    const input = 'content without headings';
    const result = splitMarkdownSections(input);

    expect(result).toEqual([
      { heading: 'Intro', body: 'content without headings' }
    ]);
  });

  it('should handle headings with extra whitespace', () => {
    const input = `#  Section 1  
content 1`;
    const result = splitMarkdownSections(input);

    expect(result).toEqual([
      { heading: 'Section 1', body: 'content 1' }
    ]);
  });
});
