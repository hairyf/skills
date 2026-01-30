---
name: arch-nuxt-module-builder CLI
description: nuxt-module-build and nuxt-build-module commands — build, prepare, cwd, outDir, sourcemap, stub.
---

# CLI

The package exposes two bin names: `nuxt-module-build` and `nuxt-build-module`. Both run the same CLI.

## Commands

| Command | Description |
|---------|-------------|
| `nuxt-module-build build [rootDir]` | Build module for distribution (output to `dist/` by default) |
| `nuxt-module-build prepare [rootDir]` | Prepare environment: run Nuxt's prepare with the local module and write types/stubs (for development) |

## Build args

| Arg | Type | Default | Description |
|-----|------|---------|-------------|
| `cwd` | string | — | Working directory (overrides rootDir) |
| `rootDir` | positional | `.` | Project root (module source) |
| `outDir` | string | `dist` | Output directory |
| `sourcemap` | boolean | `false` | Emit sourcemaps |
| `stub` | boolean | `false` | Stub dist for dev (no full build; faster) |

## Usage examples

```bash
# Build from current directory
nuxt-module-build build

# Build a specific package (e.g. monorepo)
nuxt-module-build build ./packages/my-module

# Development: stub dist and run Nuxt prepare
nuxt-module-build build --stub && nuxt-module-build prepare
```

In `package.json`, use `prepack` so the module is built before publish:

```json
"scripts": {
  "prepack": "nuxt-module-build build"
}
```

For local dev with a playground, stub then prepare:

```json
"dev:prepare": "nuxt-module-build build --stub && nuxt-module-build prepare"
```

## Key Points

- `prepare` runs Nuxt's prepare with the module added and template writing enabled; use it to generate types and stubs when developing the module.
- With `--stub`, the build is minimal and points to source; use for fast iteration without a full dist.

<!--
Source references:
- https://github.com/nuxt/module-builder
- src/commands/build.ts, prepare.ts, _shared.ts
- package.json bin
-->
