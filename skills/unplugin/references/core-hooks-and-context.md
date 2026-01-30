---
name: unplugin-hooks-and-context
description: Supported lifecycle hooks, hook filters, and build context (parse, emitFile, watch, warn/error).
---

# Unplugin Hooks and Context

Unplugin normalizes Rollup-style hooks across supported bundlers. Not every hook is supported on every bundler; check the docs’ support table for details.

## Lifecycle Hooks

| Hook | Purpose |
|------|--------|
| `enforce` | `'pre' \| 'post'` — Plugin order (Vite, webpack, Rspack, Farm, Rolldown). Not in Rollup/esbuild/Bun. |
| `buildStart` | Run once at build start. |
| `resolveId(id, importer, options)` | Resolve module id; return `string`, `{ id, external?: boolean }`, or `null`. |
| `load(id)` | Return module content (or `{ code, map }`). |
| `transform(code, id)` | Transform module content; return string or `{ code, map? }`. |
| `watchChange(id, { event })` | File changed (create/update/delete). Not in esbuild/Bun. |
| `buildEnd` | Run once at build end. Not in Bun. |
| `writeBundle` | After bundle is written (timing only; no args). Not in Bun. |

**Deprecated**: `loadInclude` and `transformInclude`. Use `load.filter` and `transform.filter` instead.

## Hook Filters

For better performance (especially on webpack and Rolldown), restrict which files a hook runs on by using the `filter` option:

```ts
createUnplugin(() => ({
  name: 'my-plugin',
  transform: {
    filter: {
      id: {
        include: [/\.ts$/, '**/*.jsx'],
        exclude: /node_modules/,
      },
      code: { include: 'foo', exclude: 'bar' },
    },
    handler(code, id) {
      return transform(code, id)
    },
  },
}))
```

- **id**: Filter by module id (path).
- **code**: Filter by file content (e.g. presence of a string).
- `include`/`exclude` can be `string | RegExp | Array<string | RegExp>`.

Use the same pattern for `resolveId` and `load` where you need to narrow the set of modules.

## Build Context (this)

Inside hook handlers you get:

| Method | Description |
|--------|-------------|
| `this.parse(input, options?)` | Parse code to AST. Requires `setParseImpl` on non-Rollup/non-Vite/non-Rolldown. |
| `this.addWatchFile(id)` | Add a file to the watch set. Not in esbuild. |
| `this.getWatchFiles()` | Get watched file list. Not in esbuild. |
| `this.emitFile(emitted)` | Emit an asset/chunk. Only `EmittedAsset` variant supported. |
| `this.warn(message \| UnpluginMessage)` | Emit a warning. |
| `this.error(message \| UnpluginMessage)` | Emit an error. |

`writeBundle` is called with `this` as `void`; no context.

## Caveats by Bundler

- **esbuild**: `load` and `transform` must return JavaScript (no CSS etc. in the return value). Use esbuild’s own loaders for other formats if needed.
- **Rspack**: `resolveId` supported from v1.0.0-alpha.1.
- **Bun**: No `buildEnd` or `writeBundle` (no onEnd in Bun’s plugin API).
- **Rollup / esbuild**: No `enforce`; order is manual.

<!--
Source references:
- https://rollupjs.org/plugin-development/
- https://unplugin.unjs.io/guide/
- sources/unplugin/docs/guide/index.md
- sources/unplugin/src/types.ts
-->
