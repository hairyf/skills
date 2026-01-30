---
name: unplugin-filters
description: Using filter option on resolveId, transform, and load hooks for performance.
---

# Unplugin Hook Filters

Filters limit which modules a hook runs on, improving performance (especially for webpack and Rolldown). Use the `filter` option with a `handler` for `resolveId`, `transform`, and `load`.

## Syntax

```ts
import { createUnplugin } from 'unplugin'

type FilterPattern = string | RegExp | Array<string | RegExp>

const plugin = createUnplugin(() => ({
  name: 'my-plugin',
  transform: {
    filter: {
      id: {
        include: [/\.js$/, '**/*.ts'],
        exclude: /node_modules/,
      },
      code: {
        include: 'foo',
        exclude: 'bar',
      },
    },
    handler(code, id) {
      // only runs when filter matches
      return code
    },
  },
}))
```

## Filter Fields

- **id**: Applied to the module id (file path). Use `include` and/or `exclude` with `string | RegExp | Array<string | RegExp>`.
- **code**: Applied to file content (e.g. string presence). Same shape.

When you only need to filter by id, you can use a single pattern:

```ts
transform: {
  filter: { id: /main\.ts$/ },
  handler(code) {
    return code.replace(/<template>/, '<template><div>Injected</div>')
  },
},
```

## When to Use

- **transform**: Always prefer a `filter` when the plugin only touches specific extensions or paths (e.g. only `.vue` or `main.ts`) so webpack/Rolldown don’t run the handler on every file.
- **load**: Use when the plugin only provides content for virtual modules or a subset of ids.
- **resolveId**: Use when the plugin only resolves certain ids (e.g. virtual module prefix).

Omitting filters means the hook runs for all modules, which can hurt performance on webpack and Rolldown.

<!--
Source references:
- https://rolldown.rs/guide/plugin-development#plugin-hook-filters
- sources/unplugin/docs/guide/index.md
- sources/unplugin/src/types.ts
-->
