---
name: unplugin-conventions
description: Naming, package.json keyword, and export layout for unplugin-powered packages.
---

# Unplugin Plugin Conventions

Following these conventions improves discoverability and DX for unplugin-based packages.

## Naming

- Use a clear name with the **`unplugin-`** prefix (e.g. `unplugin-icons`, `unplugin-vue-components`).
- Makes it obvious the package is a unified plugin and works across bundlers.

## package.json

- Add the **`unplugin`** keyword so the package appears in [npm search](https://www.npmjs.com/search?q=keywords:unplugin) and similar discovery.

```json
{
  "name": "unplugin-foo",
  "keywords": ["unplugin", "vite", "rollup", "webpack", "..."],
}
```

## Export Layout

Provide two consumption styles:

1. **Default export** — The full object returned by `createUnplugin`, for users who want one import and then pick the bundler:

   ```ts
   import UnpluginFoo from 'unplugin-foo'
   // Use: UnpluginFoo.vite, UnpluginFoo.webpack, etc.
   ```

2. **Subpath exports** — One entry per bundler so tree-shaking and clarity are better:

   ```ts
   import VitePlugin from 'unplugin-foo/vite'
   import WebpackPlugin from 'unplugin-foo/webpack'
   ```

In `package.json`:

```json
{
  "exports": {
    ".": "./dist/index.mjs",
    "./vite": "./dist/vite.mjs",
    "./rollup": "./dist/rollup.mjs",
    "./webpack": "./dist/webpack.mjs",
    "./rspack": "./dist/rspack.mjs",
    "./esbuild": "./dist/esbuild.mjs",
    "./farm": "./dist/farm.mjs",
    "./rolldown": "./dist/rolldown.mjs",
    "./bun": "./dist/bun.mjs"
  }
}
```

Implementation: default export is `createUnplugin(factory)`; each subpath re-exports the corresponding property (e.g. `unplugin.vite`). See [unplugin-starter](https://github.com/unplugin/unplugin-starter) for a full setup.

<!--
Source references:
- sources/unplugin/docs/guide/plugin-conventions.md
- https://github.com/unplugin/unplugin-starter
-->
