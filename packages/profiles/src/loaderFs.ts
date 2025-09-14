import { promises as fsp } from "node:fs";
import path from "node:path";
import type { LoadedProfileFile, ProfileDiagnostics } from "./types";

/**
 * Loads a profile JSON file from FS if present.
 * Search order for a given id:
 *   1) <profilesDir>/<id>/profile.json
 *   2) <profilesDir>/<id>.profile.json
 */
export async function loadProfileFileFromFS(opts: {
    repoRoot: string;
    profilesDir?: string; // default: "profiles"
    id: string;
}): Promise<{ file: LoadedProfileFile | null; diagnostics: ProfileDiagnostics[] }> {
    const diagnostics: ProfileDiagnostics[] = [];
    const profilesDir = opts.profilesDir ?? "profiles";
    const cand1 = path.join(opts.repoRoot, profilesDir, opts.id, "profile.json");
    const cand2 = path.join(opts.repoRoot, profilesDir, `${opts.id}.profile.json`);

    const tried = [cand1, cand2];

    for (const p of tried) {
        try {
            const raw = await fsp.readFile(p, "utf8");
            const data = JSON.parse(raw);
            return { file: { path: p, data }, diagnostics };
        } catch (e: any) {
            if (e?.code === "ENOENT") continue;
            diagnostics.push({ level: "warn", code: "PROFILE_READ_FAILED", message: `Failed to read ${p}`, detail: String(e) });
        }
    }
    return { file: null, diagnostics };
}