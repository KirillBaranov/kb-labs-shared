import type { ModuleBoundariesSpec } from "./types";

/**
 * Simple checker factory.
 * Given a spec, returns a function (from, to) ⇒ boolean (is allowed?).
 * Patterns are simple "startsWith" or exact matches; plug your own globber if needed.
 */
export function makeImportChecker(spec: ModuleBoundariesSpec) {
    const index = spec.rules.map(r => ({
        files: r.files.slice(),
        allowed: (r.allowedImports ?? []).slice(),
    }));

    function matchAny(path: string, patterns: string[]): boolean {
        for (const p of patterns) {
            if (p.endsWith("/**")) {
                const base = p.slice(0, -3);
                if (path === base || path.startsWith(base)) {return true;}
            } else if (p.endsWith("/*")) {
                const base = p.slice(0, -2);
                if (path.startsWith(base) && !path.slice(base.length + 1).includes("/")) {return true;}
            } else if (p === path || path.startsWith(p)) {
                return true;
            }
        }
        return false;
    }

    return function isAllowedImport(fromPath: string, toPath: string): boolean {
        // find module of "from"
        const owner = index.find(r => matchAny(fromPath, r.files));
        if (!owner) {return true;} // out of scope → not restricted
        if (owner.allowed.length === 0) {return true;} // no restrictions set
        return matchAny(toPath, owner.allowed);
    };
}