---
name: unplugin-hook-compatibility
description: Per-bundler support tables for lifecycle hooks and build context (this.parse, emitFile, addWatchFile, etc.).
---

# Unplugin Hook and Context Compatibility

Use these tables to check whether a hook or context method is supported on a given bundler before implementing or debugging.

## Supported Hooks

| Hook | Rollup | Vite | webpack | esbuild | Rspack | Farm | Rolldown | Bun |
|------|:------:|:----:|:-------:|:-------:|:------:|:----:|:--------:|:---:|
| `enforce` | ❌<sup>1</sup> | ✅ | ✅ | ❌<sup>1</sup> | ✅ | ✅ | ✅ | ❌ |
| `buildStart` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `resolveId` | ✅ | ✅ | ✅ | ✅ | ✅<sup>5</sup> | ✅ | ✅ | ✅ |
| ~~`loadInclude`~~<sup>2</sup> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `load` | ✅ | ✅ | ✅ | ✅<sup>3</sup> | ✅ | ✅ | ✅ | ✅ |
| ~~`transformInclude`~~<sup>2</sup> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `transform` | ✅ | ✅ | ✅ | ✅<sup>3</sup> | ✅ | ✅ | ✅ | ✅ |
| `watchChange` | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `buildEnd` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌<sup>6</sup> |
| `writeBundle`<sup>4</sup> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌<sup>6</sup> |

**Notes:**

1. **enforce**: Rollup and esbuild do not support plugin order via `enforce`; order is manual.
2. **loadInclude / transformInclude**: Deprecated. Use `load.filter` and `transform.filter` (and `resolveId.filter`) instead for better perf on webpack and Rolldown.
3. **esbuild load/transform**: Return value must be JavaScript only (no CSS or other formats in the returned code).
4. **writeBundle**: Timing-only hook; no arguments are passed.
5. **Rspack resolveId**: Supported from v1.0.0-alpha.1.
6. **Bun**: No `onEnd` in plugin API; `buildEnd` and `writeBundle` are not supported.

## Supported Context

| Context | Rollup | Vite | webpack | esbuild | Rspack | Farm | Rolldown | Bun |
|---------|:------:|:----:|:-------:|:-------:|:------:|:----:|:--------:|:---:|
| `this.parse` | ✅ | ✅ | ✅<sup>1</sup> | ✅<sup>1</sup> | ✅<sup>1</sup> | ✅<sup>1</sup> | ✅ | ✅<sup>1</sup> |
| `this.addWatchFile` | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `this.emitFile` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `this.getWatchFiles` | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `this.warn` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `this.error` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Notes:**

1. **this.parse**: For bundlers other than Rollup, Vite, or Rolldown, call `setParseImpl(parser)` once (e.g. Acorn, Babel, Oxc) so `this.parse` works.
2. **this.emitFile**: Only the `EmittedAsset` variant is supported (not `EmittedChunk`). See [features-output-and-assets](features-output-and-assets.md) for details.

<!--
Source references:
- sources/unplugin/docs/guide/index.md (Supported Hooks, Supported Context)
-->
