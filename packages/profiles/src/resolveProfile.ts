import type { LoadedProfileFile, Profile, ProfileDiagnostics } from "./types";
import { DEFAULT_PROFILE, DEFAULT_PROFILE_ID } from "./defaults";
import { mergeProfiles } from "./merge";
import { validateProfile } from "./validate";
import { loadProfileFileFromFS } from "./loaderFs";

/**
 * Resolve a profile by id with inheritance: defaults → parents → self → cli overrides.
 * Cycle-safe; returns diagnostics.
 */
export async function resolveProfile(opts: {
    repoRoot: string;
    profileId?: string;
    profilesDir?: string;
    /** Optional CLI overrides (already parsed) */
    override?: Partial<Profile>;
    /** Optional hook to map env → Partial<Profile> (product supplies) */
    envMapper?: (env: NodeJS.ProcessEnv) => Partial<Profile> | undefined;
}): Promise<{ profile: Profile; files: LoadedProfileFile[]; diagnostics: ProfileDiagnostics[] }> {
    const id = opts.profileId ?? DEFAULT_PROFILE_ID;
    const diagnostics: ProfileDiagnostics[] = [];
    const files: LoadedProfileFile[] = [];

    // Load this profile
    const { file, diagnostics: d1 } = await loadProfileFileFromFS({ repoRoot: opts.repoRoot, profilesDir: opts.profilesDir, id });
    diagnostics.push(...d1);

    // Start with defaults or bare minimum
    let acc: Profile = { ...DEFAULT_PROFILE, id: DEFAULT_PROFILE_ID };

    // Resolve inheritance chain (BFS with cycle detection)
    const seen = new Set<string>([id]);
    const queue: string[] = [];

    const pushParents = (pf: LoadedProfileFile | null) => {
        const parents = (pf?.data?.extends as string[] | undefined) ?? [];
        for (const p of parents) {
            if (seen.has(p)) {
                diagnostics.push({ level: "warn", code: "PROFILE_EXTENDS_CYCLE", message: `Cycle or duplicate in extends: ${p}` });
                continue;
            }
            seen.add(p);
            queue.push(p);
        }
    };

    // enqueue parents of self first
    pushParents(file);

    // walk parents first → oldest ancestor merges first
    const parentFiles: LoadedProfileFile[] = [];
    while (queue.length) {
        const pid = queue.shift()!;
        const { file: pf, diagnostics: pd } = await loadProfileFileFromFS({ repoRoot: opts.repoRoot, profilesDir: opts.profilesDir, id: pid });
        diagnostics.push(...pd);
        if (pf) {
            parentFiles.push(pf);
            pushParents(pf);
        } else {
            diagnostics.push({ level: "warn", code: "PROFILE_PARENT_NOT_FOUND", message: `Parent profile not found: ${pid}` });
        }
    }

    // apply parents oldest→newest
    for (let i = parentFiles.length - 1; i >= 0; i--) {
        acc = mergeProfiles(acc, parentFiles[i]!.data as any);
    }

    // apply self
    if (file) {
        files.push(...parentFiles, file);
        acc = mergeProfiles(acc, { ...file.data, id }); // preserve requested id
    } else {
        files.push(...parentFiles);
        acc = mergeProfiles(acc, { id }); // ensure final id
        diagnostics.push({ level: "info", code: "PROFILE_FALLBACK_DEFAULT", message: `Using defaults for profile '${id}'` });
    }

    // env overlay (product-defined)
    const envPart = opts.envMapper?.(process.env);
    if (envPart) acc = mergeProfiles(acc, envPart);

    // cli overrides last
    if (opts.override) acc = mergeProfiles(acc, opts.override);

    // validate
    const vr = validateProfile(acc);
    diagnostics.push(...vr.diagnostics);

    return { profile: acc, files, diagnostics };
}