import type { Profile, ProfileDiagnostics } from "./types";

export function validateProfile(p: Profile): { ok: boolean; diagnostics: ProfileDiagnostics[] } {
    const d: ProfileDiagnostics[] = [];

    if (!p.id || typeof p.id !== "string") {
        d.push({ level: "error", code: "PROFILE_ID_INVALID", message: "Profile.id must be a non-empty string" });
    }
    if (!p.schemaVersion || typeof p.schemaVersion !== "string") {
        d.push({ level: "error", code: "SCHEMA_VERSION_INVALID", message: "schemaVersion must be a string" });
    }
    if (p.sources) {
        const keys: (keyof NonNullable<typeof p.sources>)[] = ["rules","adr","docs","api","src","tests"];
        for (const k of keys) {
            const v = (p.sources as any)[k];
            if (v && !Array.isArray(v)) {
                d.push({ level: "error", code: "SOURCES_SHAPE_INVALID", message: `sources.${String(k)} must be an array of globs` });
            }
        }
    }
    return { ok: d.find(x => x.level === "error") === undefined, diagnostics: d };
}