---
name: core-logging
description: defineLogger and displayName in arch-vscode
---

# Logging (defineLogger)

Extension logging uses **reactive-vscode**'s `defineLogger` with the extension **displayName** from generated meta, so output channel and log level are consistent.

## Usage

```ts
// src/utils.ts
import { defineLogger } from 'reactive-vscode'
import { displayName } from './generated/meta'

export const logger = defineLogger(displayName)
```

## Key Points

- **defineLogger(name)** — Creates a logger that writes to a VSCode Output channel with the given `name`. Typically use the extension's `displayName` so the channel matches the extension.
- **displayName** — Comes from generated meta (`src/generated/meta.ts`), derived from `package.json` `displayName`. Regenerate with `pnpm update`.
- **Usage in code** — Import `logger` where needed and call e.g. `logger.info('...')`, `logger.warn('...')`, `logger.error('...')` (exact API depends on reactive-vscode).
- **Single logger** — One shared logger in `utils.ts` is enough for most extensions; use it across commands and features.

## When to Log

- **Info:** User-visible or important state (e.g. "Extension activated", "Scan completed").
- **Warn:** Recoverable issues (e.g. missing optional config, fallback used).
- **Error:** Failures and stack traces for debugging.

Avoid logging on every trivial operation to keep the output channel readable.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://kermanx.com/reactive-vscode/
-->
