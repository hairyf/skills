---
name: arch-nuxt-module-builder build config
description: Optional build.config.ts to extend or customize unbuild (unbuild preset).
---

# Build Config (build.config.ts)

Module-builder is a preset for [unjs/unbuild](https://github.com/unjs/unbuild). The CLI merges its own entries and options when you run `nuxt-module-build build`. To add or override config, add a `build.config.ts` in the project root.

## Usage

```ts
// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  // Add entries, change declaration, hooks, etc.
})
```

The builder still injects the module entry (`src/module`) and the runtime entry (`src/runtime/` → `dist/runtime`). Use `build.config.ts` for extra entries (e.g. a separate utils build) or unbuild hooks.

## Extra entries via package.json

You can also add extra build entries without a full `build.config.ts` by using the `build.entries` field in `package.json` (handled by the builder when it reads the project). Example:

```json
{
  "build": {
    "entries": ["./src/utils"]
  }
}
```

Then export the extra entry in `package.json`:

```json
{
  "exports": {
    ".": { "types": "./dist/types.d.mts", "default": "./dist/module.mjs" },
    "./utils": "./dist/utils.mjs"
  },
  "typesVersions": {
    "*": { "utils": ["./dist/utils.d.mts"] }
  }
}
```

## Key Points

- Default behavior (module + runtime) does not require `build.config.ts`.
- For reference, the built-in config is in [build command](https://github.com/nuxt/module-builder/blob/main/src/commands/build.ts): entries, declaration, mkdist for runtime, externals, and hooks for module.json and types.

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md (build.config.ts)
- src/commands/build.ts
-->
