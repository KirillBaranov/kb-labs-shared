import type { Profile, ProfileSources } from "./types";

/** Deep merge for profiles; arrays are concatenated with de-duplication. */
export function mergeProfiles(base: Profile, over: Partial<Profile>): Profile {
    const out: Profile = { ...base };

    if (over.id) out.id = over.id;
    if (over.schemaVersion) out.schemaVersion = over.schemaVersion;

    out.extends = dedup([...(base.extends ?? []), ...(over.extends ?? [])]);

    if (over.sources) out.sources = mergeSources(base.sources ?? {}, over.sources);
    if (over.boundaries !== undefined) out.boundaries = over.boundaries ?? undefined;

    if (over.policies) {
        out.policies = { ...(base.policies ?? {}), ...over.policies };
    }
    if (over.meta) {
        out.meta = { ...(base.meta ?? {}), ...over.meta };
    }
    return out;
}

function mergeSources(a: ProfileSources, b: ProfileSources): ProfileSources {
    return {
        rules: dedup([...(a.rules ?? []), ...(b.rules ?? [])]),
        adr: dedup([...(a.adr ?? []), ...(b.adr ?? [])]),
        docs: dedup([...(a.docs ?? []), ...(b.docs ?? [])]),
        api: dedup([...(a.api ?? []), ...(b.api ?? [])]),
        src: dedup([...(a.src ?? []), ...(b.src ?? [])]),
        tests: dedup([...(a.tests ?? []), ...(b.tests ?? [])]),
    };
}

function dedup<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}