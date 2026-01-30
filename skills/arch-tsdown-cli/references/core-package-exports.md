---
name: core-package-exports
description: package.json exports, bin, dist output, and published files in arch-tsdown-cli
---

# Package Exports, Bin, and Output

The CLI starter publishes both a **library** (importable) and a **bin** (executable). Exports and bin are set under `publishConfig` so the published package points at built files.

## publishConfig (Published Package)

```json
{
  "publishConfig": {
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.mjs"
      },
      "./package.json": "./package.json"
    },
    "main": "./dist/index.mjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "bin": { "pkg-placeholder": "./bin/index.mjs" }
  },
  "files": ["bin", "dist"]
}
```

- **Library:** Consumers resolve the package root to `dist/index.mjs` and types to `dist/index.d.ts`.
- **CLI:** `bin` points to `bin/index.mjs`, which imports `dist/cli/index.mjs`.
- **files:** Only `bin` and `dist` are published; source and config stay out of the package.

## Development package.json

- **main:** May point at `./src/index.ts` for local tooling; `publishConfig` overrides on publish.
- **bin:** Points at `./bin/index.dev.mjs` so local runs use tsx and source (see [core-bin-entry](core-bin-entry.md)).

## Output Layout

| Path | Purpose |
|------|---------|
| `dist/index.mjs` | Library ESM entry. |
| `dist/index.d.ts` | Library types (or `.d.mts` if using .mts). |
| `dist/cli/index.mjs` | CLI bundle (run by bin). |
| `bin/index.mjs` | Production bin script (shebang + import dist/cli). |
| `bin/index.dev.mjs` | Dev bin script (tsx + import src/cli). |

## Renaming the Bin

Replace `pkg-placeholder` with your package name (or desired CLI name) in both `bin` and `publishConfig.bin`, and rename the bin script if you want a different filename (e.g. `my-cli.mjs`).

<!--
Source references:
- https://github.com/hairyf/starter-cli
-->
