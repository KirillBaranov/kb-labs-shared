/**
 * Extract list of changed files from a unified diff.
 * Looks at +++ b/<path> and normalizes prefixes.
 */
export function listChangedFiles(diff: string): string[] {
    const out: string[] = [];
    const seen = new Set<string>();
    const re = /^\+\+\+\s+[ab]\/(.+)$/gm;

    let m: RegExpExecArray | null;
    while ((m = re.exec(diff))) {
        const p = m[1]!.trim();
        if (!seen.has(p)) {
            seen.add(p);
            out.push(p);
        }
    }
    return out;
}