---
name: arch-nuxt-module-builder package exports
description: package.json exports, typesVersions, prepack, and files for publishing a Nuxt module.
---

# Package Exports and Publishing

Correct `package.json` shape ensures consumers get the right entry and types.

## Recommended shape

```json
{
  "name": "my-module",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/types.d.mts",
      "import": "./dist/module.mjs"
    }
  },
  "main": "./dist/module.mjs",
  "typesVersions": {
    "*": {
      ".": ["./dist/types.d.mts"]
    }
  },
  "files": ["dist"],
  "scripts": {
    "prepack": "nuxt-module-build build"
  },
  "dependencies": {
    "@nuxt/kit": "latest"
  },
  "devDependencies": {
    "@nuxt/module-builder": "latest"
  }
}
```

## Notes

- **No `types` at root** — Rely on `exports["."].types` and `typesVersions`; a root `types` pointing at a missing file can trigger warnings.
- **Use `.d.mts`** — Prefer `types.d.mts` for modern resolution; the builder no longer emits `.d.ts` for the main types file.
- **ESM only** — Module-builder emits `module.mjs` only; do not reference `module.cjs`.
- **prepack** — Running `nuxt-module-build build` before publish ensures `dist/` is up to date when the tarball is created.
- **files: ["dist"]** — Only ship the built output.

## Subpath exports

For additional entrypoints (e.g. `my-module/utils`), add an export and matching typesVersions:

```json
{
  "exports": {
    ".": { "types": "./dist/types.d.mts", "default": "./dist/module.mjs" },
    "./utils": "./dist/utils.mjs"
  },
  "typesVersions": {
    "*": {
      ".": ["./dist/types.d.mts"],
      "utils": ["./dist/utils.d.mts"]
    }
  }
}
```

Build the extra entry via `package.json` `build.entries` or `build.config.ts`.

## Key Points

- Keep dependencies minimal; list `@nuxt/kit` as a dependency, `@nuxt/module-builder` as devDependency.
- Engines: Node ^18 or >=20 matches the builder’s own requirements.

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md (package.json)
- src/commands/build.ts (build:done warnings)
-->
