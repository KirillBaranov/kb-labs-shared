import { splitLines } from "./normalize";

/** Take context lines around a 1-based line number. */
export function takeContext(text: string, line: number, before = 2, after = 2): { start: number; end: number; lines: string[] } {
    const arr = splitLines(text);
    const idx = Math.max(1, Math.min(line, arr.length));
    const start = Math.max(1, idx - before);
    const end = Math.min(arr.length, idx + after);
    return { start, end, lines: arr.slice(start - 1, end) };
}