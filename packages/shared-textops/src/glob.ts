/**
 * Very small glob matcher supporting:
 *  - "*" within a segment
 *  - "?" single char
 *  - "**" across segments
 *  - suffix forms like "dir/**" and "dir/*"
 * Paths are compared using "/" separators.
 */

export function normalizeGlob(p: string): string {
    // Simple path normalization:
    // 1. Convert backslashes to forward slashes
    // 2. Remove dot segments (./ and /./)
    // 3. Collapse multiple consecutive slashes to single slash
    let result = p.replace(/\\/g, "/");
    result = result.replace(/(^|\/)\.(?=\/|$)/g, "$1");
    result = result.replace(/\/{2,}/g, "/");

    // Handle edge cases
    if (result === ".") {
        return "";
    }

    return result;
}

export function matchGlob(path: string, patterns: string[]): boolean {
    const p = normalizeGlob(path);
    for (const pat of patterns) {
        const g = normalizeGlob(pat);
        if (matchOne(p, g)) { return true; }
    }
    return false;
}

export function dedupGlobs(patterns: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const p of patterns.map(normalizeGlob)) {
        if (!seen.has(p)) { seen.add(p); out.push(p); }
    }
    return out;
}

function matchOne(path: string, glob: string): boolean {
    const ps = path.split("/");
    const gs = glob.split("/");

    return matchSegments(ps, gs, 0, 0);
}

function matchSegments(ps: string[], gs: string[], pi: number, gi: number): boolean {
    while (gi < gs.length && pi < ps.length) {
        const g = gs[gi]!;
        if (g === "**") {
            // try to consume zero or more segments
            if (gi === gs.length - 1) { return true; } // trailing ** matches all
            for (let skip = 0; pi + skip <= ps.length; skip++) {
                if (matchSegments(ps, gs, pi + skip, gi + 1)) { return true; }
            }
            return false;
        }
        if (!matchSegment(ps[pi]!, g)) { return false; }
        pi++; gi++;
    }
    // consume trailing ** in glob
    while (gi < gs.length && gs[gi] === "**") { gi++; }
    return pi === ps.length && gi === gs.length;
}

function matchSegment(seg: string, pat: string): boolean {
    // convert simple glob in a segment to regex
    let rx = "^";
    for (let i = 0; i < pat.length; i++) {
        const ch = pat[i]!;
        if (ch === "*") { rx += ".*"; }
        else if (ch === "?") { rx += "."; }
        else { rx += escapeRegExpChar(ch); }
    }
    rx += "$";
    return new RegExp(rx).test(seg);
}

function escapeRegExpChar(c: string): string {
    return /[.*+?^${}()|[\]\\]/.test(c) ? `\\${c}` : c;
}