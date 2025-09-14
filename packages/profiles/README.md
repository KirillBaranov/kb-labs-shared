# Shared Profiles

Neutral project **profiles** describing where knowledge lives in a repo.
Reusable by review/docs/tests.

- **Profile**: `{ id, extends?, sources{rules,adr,docs,api,src,tests}, boundaries?, policies?, meta?, schemaVersion }`
- **resolveProfile(opts)**: defaults → parents → self → envMapper → overrides
- **loadProfileFileFromFS({ repoRoot, profilesDir, id })**
- **mergeProfiles(base, over)**
- **validateProfile(profile)**

Conventions:
- Default profile id: `default`
- Files looked up at:
    - `<repo>/<profilesDir>/<id>/profile.json`
    - `<repo>/<profilesDir>/<id>.profile.json`
- Arrays are concatenated with de-duplication.
- Cycles in `extends` are warned and skipped.