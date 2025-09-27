import type { DiffLineDel } from "./types";

/** Symmetric to addedLinesByFile: collects removed lines per file. */
export function removedLinesByFile(diff: string): Record<string, DiffLineDel[]> {
    const out: Record<string, DiffLineDel[]> = {};
    let file = "";
    let oldLine = 0;

    const lines = diff.replaceAll("\r\n", "\n").split("\n");
    for (const line of lines) {
        if (line.startsWith("+++ b/")) {
            // rely on +++ to fix file identity consistently with "added" pass
            file = line.slice(6).trim();
            out[file] ||= [];
            continue;
        }
        const m = line.match(/^@@ -(\d+)(?:,\d+)? \+\d+(?:,\d+)? @@/);
        if (m) {
            oldLine = Number(m[1]);
            continue;
        }
        if (file && line.startsWith("-") && !line.startsWith("---")) {
            out[file]!.push({ line: oldLine, text: line.slice(1) });
            oldLine++;
        } else if (file && !line.startsWith("+")) {
            if (line && !line.startsWith("@@")) {oldLine++;}
        }
    }
    return out;
}