/** Normalize all line endings to \n */
export function normalizeLineEndings(s: string): string {
    if (!s) {return s;}
    return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/** Strip ANSI escape sequences */
export function stripAnsi(s: string): string {
    if (!s) {return s;}
     
    const re = /\u001B\[[0-9;]*[A-Za-z]/g;
    return s.replace(re, "");
}

/** Collapse runs of whitespace to single spaces (preserves newlines) */
export function normalizeWhitespace(s: string): string {
    return s.split("\n").map(line => line.replace(/\s+/g, " ").trim()).join("\n");
}

/** Trim each line and drop leading/trailing empty lines */
export function trimLines(s: string): string {
    const lines = normalizeLineEndings(s).split("\n").map(l => l.trimEnd());
    // drop leading empties
    while (lines.length && lines[0]!.trim() === "") {lines.shift();}
    // drop trailing empties
    while (lines.length && lines[lines.length - 1]!.trim() === "") {lines.pop();}
    return lines.join("\n");
}

/** Safe split to lines (normalizes CRLF) */
export function splitLines(s: string): string[] {
    if (!s) {return [];}
    return normalizeLineEndings(s).split("\n");
}

/** Very rough token estimate (space/punct splitting) */
export function estimateTokens(s: string): number {
    if (!s) {return 0;}
    const parts = s.trim().split(/[\s.,;:!?()[\]{}"'+=*\\/|-]+/g).filter(Boolean);
    return parts.length;
}

/** Truncate string to approx maxTokens, preserving whole lines by default */
export function truncateByTokens(s: string, maxTokens: number, opts?: { preserveLines?: boolean }): string {
    if (!s) {return s;}
    if (estimateTokens(s) <= maxTokens) {return s;}

    if (opts?.preserveLines !== false) {
        const lines = splitLines(s);
        const out: string[] = [];
        let count = 0;
        for (const ln of lines) {
            const c = estimateTokens(ln);
            if (count + c > maxTokens) {break;}
            out.push(ln);
            count += c;
        }
        return out.join("\n");
    } else {
        // word-wise
        const words = s.split(/\s+/);
        let count = 0;
        let end = 0;
        for (; end < words.length; end++) {
            const c = estimateTokens(words[end]!);
            if (count + c > maxTokens) {break;}
            count += c;
        }
        return words.slice(0, end).join(" ");
    }
}

/** Split markdown by top-level headings into sections */
export function splitMarkdownSections(md: string): { heading: string; body: string }[] {
    const lines = splitLines(md);
    const sections: { heading: string; body: string }[] = [];
    let curHead = "Intro";
    let curBody: string[] = [];
    for (const ln of lines) {
        const m = ln.match(/^(#{1,3})\s+(.*)$/); // H1–H3
        if (m) {
            // flush previous
            if (curBody.length) {sections.push({ heading: curHead, body: curBody.join("\n") });}
            curHead = m[2]!.trim();
            curBody = [];
        } else {
            curBody.push(ln);
        }
    }
    if (curBody.length) {sections.push({ heading: curHead, body: curBody.join("\n") });}
    return sections;
}