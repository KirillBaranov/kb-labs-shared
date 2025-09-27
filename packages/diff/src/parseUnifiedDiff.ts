import { DiffHunk, DiffLineAdd, DiffLineDel, ParsedDiff } from "./types";

/**
 * Unified diff parser (git-like).
 * Supports: "diff --git", "---/+++", /dev/null, rename, binary markers, CRLF.
 * Returns a neutral AST with stable ordering of files.
 */
export function parseUnifiedDiff(diff: string): ParsedDiff {
    const files: string[] = [];
    const addedByFile: Record<string, DiffLineAdd[]> = {};
    const removedByFile: Record<string, DiffLineDel[]> = {};
    const hunksByFile: Record<string, DiffHunk[]> = {};

    // current state
    let curFile = "";
    let oldLine = 0;
    let newLine = 0;

    // pre-normalize CRLF
    const lines = diff.replaceAll("\r\n", "\n").split("\n");

    // helpers
    const pushFile = (p: string) => {
        if (!p) return;
        if (!files.includes(p)) files.push(p);
        addedByFile[p] ||= [];
        removedByFile[p] ||= [];
        hunksByFile[p] ||= [];
    };

    const stripPrefix = (p: string) => p.replace(/^a\//, "").replace(/^b\//, "");

    for (const raw of lines) {
        // file section start
        if (raw.startsWith("diff --git ")) {
            curFile = ""; // will be set when we see +++/---
            continue;
        }

        // rename headers (do not change line counters, only file identity)
        if (raw.startsWith("rename from ") || raw.startsWith("rename to ")) {
            // ignore: file identity will be taken from ---/+++ below
            continue;
        }

        // binary marker
        if (raw.startsWith("Binary files ") || raw === "Binary files differ") {
            // no hunks; keep whatever file was recognized by +++/---
            // If not recognized yet, we skip — nothing to count
            continue;
        }

        // classic headers
        if (raw.startsWith("--- ")) {
            // old path; could be --- /dev/null for new file
            continue; // old path not used directly in AST maps
        }
        if (raw.startsWith("+++ ")) {
            const pathPart = raw.slice(4).trim(); // "a/foo" | "b/foo" | "/dev/null"
            if (pathPart.endsWith("/dev/null") || pathPart === "/dev/null") {
                // file deleted; we'll still rely on the next proper +++ when present
                continue;
            }
            // "+++ b/xxx" → pick b/ and normalize
            const m = pathPart.match(/^[ab]\/(.+)$/);
            const normalized = m ? m[1] : stripPrefix(pathPart);
            curFile = normalized?.trim() ?? "";
            pushFile(curFile);
            continue;
        }

        // hunk header
        const h = raw.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
        if (h) {
            oldLine = Number(h[1]);
            newLine = Number(h[3]);
            if (curFile) {
                hunksByFile[curFile]!.push({
                    header: raw,
                    oldStart: oldLine,
                    oldLines: h[2] ? Number(h[2]) : undefined,
                    newStart: newLine,
                    newLines: h[4] ? Number(h[4]) : undefined,
                });
            }
            continue;
        }

        // ignore any meta lines until we know the file
        if (!curFile) continue;

        // skip secondary headers to avoid miscounting
        if (raw.startsWith("+++ ") || raw.startsWith("--- ")) continue;

        // additions / removals / context
        if (raw.startsWith("+") && !raw.startsWith("+++")) {
            addedByFile[curFile]!.push({ line: newLine, text: raw.slice(1) });
            newLine++;
            continue;
        }
        if (raw.startsWith("-") && !raw.startsWith("---")) {
            removedByFile[curFile]!.push({ line: oldLine, text: raw.slice(1) });
            oldLine++;
            continue;
        }

        // context / empty lines within hunks (but not headers)
        if (!raw.startsWith("@@")) {
            oldLine++;
            newLine++;
        }
    }

    return { files, addedByFile, removedByFile, hunksByFile };
}