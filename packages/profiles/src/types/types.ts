export type Glob = string;

export interface ProfileSources {
    rules?: Glob[];
    adr?: Glob[];
    docs?: Glob[];
    api?: Glob[];
    src?: Glob[];
    tests?: Glob[];
}

export interface ProfileBoundariesRef {
    /** Path to a ModuleBoundariesSpec JSON or inline object name (left to consumer) */
    file?: string;
}

export interface ProfilePolicies {
    /** Max bytes of context consumers may assemble from sources */
    maxBytes?: number;
    /** Optional privacy/redaction hints; consumers decide how to apply */
    privacy?: "team" | "restricted";
}

export interface ProfileMeta {
    [k: string]: unknown;
}

export interface Profile {
    /** Stable profile id: "frontend" | "backend" | "e2e" | custom */
    id: string;
    /** Optional inheritance chain; parent ids resolved via loader */
    extends?: string[];
    /** Where knowledge lives in the repo (globs) */
    sources?: ProfileSources;
    /** Optional boundaries reference (neutral) */
    boundaries?: ProfileBoundariesRef;
    /** Common limits/policies (neutral) */
    policies?: ProfilePolicies;
    /** Free-form extensions */
    meta?: ProfileMeta;
    /** Schema version for migrations/validation */
    schemaVersion: string; // e.g. "1.0.0"
}

export interface ProfileDiagnostics {
    level: "info" | "warn" | "error";
    code: string;
    message: string;
    detail?: unknown;
}

export interface LoadedProfileFile {
    path: string;
    data: Partial<Profile>;
}