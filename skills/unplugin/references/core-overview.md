---
name: unplugin-overview
description: What unplugin is, supported bundlers, and when to use it for unified plugin authoring.
---

# Unplugin Overview

**Unplugin** is a library that provides a unified plugin system across multiple build tools. It uses the [Rollup plugin API](https://rollupjs.org/plugin-development/#plugins-overview) as the standard interface and implements compatibility layers for each bundler.

## Supported Bundlers

- **Vite** — Next-generation frontend tooling
- **Rollup** — ES module bundler
- **webpack** — Static module bundler (webpack 5+)
- **esbuild** — Fast JavaScript/TypeScript bundler
- **Rspack** — Rust-based web bundler
- **Rolldown** — Rollup-compatible Rust bundler
- **Farm** — Rust-based web build tool
- **Bun** — JavaScript runtime and bundler

Frameworks built on these (Nuxt, Vue CLI, Astro, etc.) can use unplugin-based plugins via the corresponding bundler integration.

## When to Use

- **Writing one plugin for many bundlers** — Same logic runs on Vite, Rollup, webpack, esbuild, Rspack, Farm, Rolldown, and Bun.
- **Consuming unplugins** — Install once and use the right entry (e.g. `unplugin-foo/vite`, `unplugin-foo/webpack`) in your config.
- **Scaffolding new plugins** — Use [unplugin/unplugin-starter](https://github.com/unplugin/unplugin-starter) or similar templates.

## Requirements

- Node.js 18.12.0 or later
- webpack 5 or later when using webpack

## Key Concepts

- **Factory**: A function `(options, meta) => UnpluginOptions` (or array for nested plugins). `createUnplugin(factory)` returns an object with `.vite`, `.rollup`, `.webpack`, etc.
- **Hooks**: Rollup-style hooks (`buildStart`, `resolveId`, `load`, `transform`, `buildEnd`, `writeBundle`, `watchChange`) are normalized across bundlers where supported.
- **Context**: `this.parse`, `this.emitFile`, `this.addWatchFile`, `this.warn`, `this.error` are available in hook handlers where the bundler supports them.

<!--
Source references:
- https://unplugin.unjs.io/
- https://github.com/unjs/unplugin
- sources/unplugin/docs/guide/index.md
-->
