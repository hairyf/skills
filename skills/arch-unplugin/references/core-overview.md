---
name: arch-unplugin overview
description: What unplugin-starter is, unplugin architecture, and template usage for building universal build-tool plugins.
---

# Unplugin Starter Overview

unplugin-starter is a starter template for [unplugin](https://github.com/unjs/unplugin). It lets you author one plugin API and ship it for Vite, Rollup, Webpack, Nuxt, esbuild, Farm, Rspack, and Astro without maintaining separate implementations.

## Template Usage

Scaffold a new unplugin from the template:

```bash
npx degit unplugin/unplugin-starter my-unplugin
```

Then do a global replacement of `unplugin-starter` with your plugin name (package name, exports, and any references in code/docs).

## Core Idea

- **Single factory:** You implement a `UnpluginFactory<Options>` that returns a universal plugin object (e.g. `name`, `transformInclude`, `transform`).
- **Bundler adapters:** The unplugin library provides `createVitePlugin`, `createRollupPlugin`, `createWebpackPlugin`, etc., which wrap that factory so each bundler gets a native plugin.
- **One codebase:** Options and transform logic live in one place; each entry point (e.g. `vite.ts`, `rollup.ts`) just re-exports the adapter applied to your factory.

## Key Points

- Built on the [unplugin](https://github.com/unjs/unplugin) API; supports transform and resolve hooks.
- Test with a local playground (e.g. Vite in `playground/`) via `pnpm run dev` or `pnpm run play`.
- Release with `pnpm run release` (bumpp + publish).

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- README.md
-->
