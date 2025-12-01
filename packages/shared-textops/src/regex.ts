/** Escape string for use inside RegExp constructor */
export function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Safe matchAll that never throws and returns a materialized array */
export function safeMatchAll(s: string, re: RegExp): RegExpExecArray[] {
    const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
    const rx = new RegExp(re.source, flags);
    const out: RegExpExecArray[] = [];
    let m: RegExpExecArray | null;
    let lastIndex = 0;
    let iterations = 0;

    while ((m = rx.exec(s))) {
        out.push(m);
        iterations++;

        // Prevent infinite loop: if lastIndex didn't advance, break
        if (rx.lastIndex === lastIndex) {
            // For empty matches (like /(?=hello)/), allow one more iteration
            if (m[0].length === 0 && iterations === 1) {
                lastIndex = rx.lastIndex;
                continue;
            }
            break;
        }
        lastIndex = rx.lastIndex;

        // Safety check: limit number of matches to prevent memory issues
        if (out.length > 10000) {
            break;
        }
    }

    return out;
}

/** Wrap all matches with markers (does not mutate the pattern) */
export function highlightMatches(s: string, pattern: RegExp, markerStart = "[[", markerEnd = "]]"): string {
    const matches = safeMatchAll(s, pattern);
    if (!matches.length) { return s; }
    // rebuild using indices to avoid nested replacements
    let out = "";
    let last = 0;
    for (const m of matches) {
        const start = m.index!;
        const end = start + m[0]!.length;
        out += s.slice(last, start) + markerStart + s.slice(start, end) + markerEnd;
        last = end;
    }
    out += s.slice(last);
    return out;
}