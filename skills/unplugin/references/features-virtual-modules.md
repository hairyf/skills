---
name: unplugin-virtual-modules
description: Implementing virtual modules with resolveId and load; filter pattern for load.
---

# Unplugin Virtual Modules

Virtual modules are module ids that do not correspond to real files. The plugin resolves the id in `resolveId` and provides content in `load`. This pattern is common for generated config, feature flags, or injected code.

## Pattern

1. **resolveId**: Return the virtual id (or a normalized form) when the request matches your scheme (e.g. `virtual:my-module` or `virtual/foo`). Return `null` for non-virtual requests.
2. **load**: Return the module content (string or `{ code, map? }`) for that id. Restrict which ids trigger `load` via `load.filter` (or the deprecated `loadInclude`) so the hook is not called for every file.

## Example

```ts
createUnplugin(() => ({
  name: 'virtual-module-demo',
  resolveId(id) {
    return id.startsWith('virtual/') ? id : null
  },
  load: {
    filter: { id: /^virtual\// },
    handler(id) {
      if (id === 'virtual/config')
        return 'export default { env: "development" }'
      if (id === 'virtual/version')
        return `export const version = "${process.env.npm_package_version ?? '0.0.0'}"`
      return null
    },
  },
}))
```

Consumer:

```ts
import config from 'virtual/config'
import { version } from 'virtual/version'
```

## Filter for load

Always use `load.filter` (or, if still needed, `loadInclude`) so `load` runs only for virtual ids. Otherwise the hook may be invoked for every module and hurt performance (especially on webpack and Rolldown).

```ts
load: {
  filter: { id: /^virtual\// },
  handler(id) {
    // only called for ids matching the filter
    return getContentFor(id)
  },
},
```

## Bundler internals

Unplugin uses an internal virtual path prefix (`__virtualModulePrefix`) and, on webpack/Rspack, virtual file system plugins to satisfy bundler requirements. Plugin authors do not need to set or read this; implementing `resolveId` + `load` (with a filter) is sufficient.

## Deprecated loadInclude

The deprecated `loadInclude(id)` predicate is still supported; prefer `load.filter` for new code.

<!--
Source references:
- sources/unplugin/test/fixtures/virtual-module/unplugin.js
- sources/unplugin/docs/guide/index.md
- sources/unplugin/src/types.ts (load, resolveId)
-->
