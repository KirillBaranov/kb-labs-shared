import { DiffLineAdd } from "./types";

/**
 * Fast pass to collect +/- lines per file without full hunk AST.
 * Use `parseUnifiedDiff` if you need hunks as well.
 */
export function addedLinesByFile(diff: string): Record<string, DiffLineAdd[]> {
    const out: Record<string, DiffLineAdd[]> = {};
    let file = "";
    let newLine = 0;

    const lines = diff.replaceAll("\r\n", "\n").split("\n");
    for (const line of lines) {
        if (line.startsWith("+++ b/")) {
            file = line.slice(6).trim();
            out[file] ||= [];
            continue;
        }
        const m = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
        if (m) {
            newLine = Number(m[1]);
            continue;
        }
        if (file && line.startsWith("+") && !line.startsWith("+++")) {
            out[file]!.push({ line: newLine, text: line.slice(1) });
            newLine++;
        } else if (file && !line.startsWith("-")) {
            // context line (skip headers)
            if (line && !line.startsWith("@@")) newLine++;
        }
    }
    return out;
}