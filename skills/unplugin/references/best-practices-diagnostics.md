---
name: unplugin-diagnostics
description: this.warn and this.error; UnpluginMessage shape for structured errors and warnings.
---

# Unplugin Diagnostics (warn / error)

Use `this.warn` and `this.error` inside hook handlers to report warnings and errors. Both accept a **string** or an **UnpluginMessage** object for structured output (location, code, plugin name).

## UnpluginMessage shape

```ts
interface UnpluginMessage {
  name?: string
  id?: string        // file path
  message: string    // required
  stack?: string
  code?: string
  plugin?: string
  pluginCode?: unknown
  loc?: {
    file?: string
    line: number
    column: number
  }
  meta?: any
}
```

## Usage

```ts
// Simple string
this.warn('Deprecated option "x" used; prefer "y".')
this.error('Cannot resolve virtual module id.')

// Structured (better for IDEs and tooling)
this.warn({
  id: id,
  message: 'Empty export; consider removing.',
  loc: { line: 10, column: 0 },
  plugin: 'my-unplugin',
})
this.error({
  id: id,
  message: 'Invalid syntax in option.',
  code: 'INVALID_OPTION',
})
```

Prefer structured messages when you have a file id and location so editors can show inline diagnostics.

<!--
Source references:
- sources/unplugin/src/types.ts (UnpluginMessage, UnpluginContext)
- sources/unplugin/src/webpack/context.ts (normalizeMessage)
-->
