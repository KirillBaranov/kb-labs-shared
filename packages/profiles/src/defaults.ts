import type { Profile } from "./types";

export const DEFAULT_PROFILE_ID = "default";

/** Minimal safe defaults; consumers can overlay product defaults. */
export const DEFAULT_PROFILE: Profile = {
    id: DEFAULT_PROFILE_ID,
    schemaVersion: "1.0.0",
    sources: {
        rules: ["rules/**"],
        adr: ["adr/**"],
        docs: ["docs/**"],
        api: ["api/**"],
        src: ["src/**"],
        tests: ["tests/**"],
    },
    policies: { maxBytes: 1_500_000, privacy: "team" },
};