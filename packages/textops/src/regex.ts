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
    while ((m = rx.exec(s))) out.push(m);
    return out;
}

/** Wrap all matches with markers (does not mutate the pattern) */
export function highlightMatches(s: string, pattern: RegExp, markerStart = "[[", markerEnd = "]]"): string {
    const matches = safeMatchAll(s, pattern);
    if (!matches.length) return s;
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