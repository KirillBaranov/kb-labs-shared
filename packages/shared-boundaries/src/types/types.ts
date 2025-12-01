/** Neutral module boundaries spec; no product/domain terms. */
export interface ModuleBoundaryRule {
    id: string;
    /** Glob or path patterns of files that belong to the module */
    files: string[];
    /** Allowed import patterns (e.g., other module file globs or package names) */
    allowedImports?: string[];
}

export interface ModuleBoundariesSpec {
    version: number;
    /** Optional namespace to disambiguate multiple specs in one repo */
    namespace?: string;
    rules: ModuleBoundaryRule[];
}