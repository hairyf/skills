---
name: unplugin-parsing
description: setParseImpl and this.parse for AST parsing in hooks when the bundler has no built-in parser.
---

# Unplugin Parsing (this.parse)

Inside hook handlers you can call `this.parse(code, options?)` to parse source code to an AST. Rollup, Vite, and Rolldown provide a built-in parser; other bundlers require you to supply one via `setParseImpl`.

## When to call setParseImpl

Call **once** before any build that uses `this.parse` on:

- **esbuild**
- **webpack**
- **Rspack**
- **Farm**
- **Bun**

No need to call it for **Rollup**, **Vite**, or **Rolldown** — they already provide a parser.

## Usage

```ts
import { setParseImpl } from 'unplugin'
import * as acorn from 'acorn'

setParseImpl((code, opts) => acorn.parse(code, { ecmaVersion: 'latest', ...opts }))
```

If `setParseImpl` was not called and a hook runs `this.parse` on a bundler that doesn’t provide one, you get:

```text
Parse implementation is not set. Please call setParseImpl first.
```

## Parser options

The second argument to `this.parse(input, options?)` is passed through to your implementation. Typical options include source type, ECMAScript version, and locations. Use the same options your parser expects (e.g. Acorn’s `ecmaVersion`, `sourceType`).

## Suggested parsers

- [Acorn](https://github.com/acornjs/acorn) — small, fast, ES-focused.
- [Babel](https://babeljs.io/) (`@babel/parser`) — full JS/TS and plugins.
- [Oxc](https://oxc.rs/) — Rust-based, fast parser with a JS API.

Call `setParseImpl` in the same process that runs the build (e.g. in your CLI or config file) before the bundler invokes your plugin.

<!--
Source references:
- sources/unplugin/src/utils/parse.ts
- sources/unplugin/docs/guide/index.md (Supported Context notice)
- https://github.com/acornjs/acorn
-->
