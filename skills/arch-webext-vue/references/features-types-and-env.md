---
name: arch-webext-vue-types-and-env
description: Build-time globals, type declarations (global.d.ts, shim.d.ts, modules.d.ts), and runtime env (env.ts) in the Vitesse WebExtension template.
---

# Types and Environment

The template uses **build-time globals** (`__DEV__`, `__NAME__`), **type declaration files** for Vue and webext-bridge, and a small **runtime env** module (`src/env.ts`) for forbidden URLs and Firefox detection. Use these so agents know where extension name, dev mode, and runtime context come from.

## Build-Time Globals

Defined in Vite config and declared in **src/global.d.ts**:

| Global | Type | Source | Use |
|--------|------|--------|-----|
| `__DEV__` | boolean | `process.env.NODE_ENV !== 'production'` (from scripts/utils) | Branch for dev-only code (e.g. open shadow root, CSP). |
| `__NAME__` | string | `package.json` name | Extension id/name; e.g. content script root element `id={__NAME__}`. |

Declare in `global.d.ts` so TypeScript allows usage without import. Background and content Vite configs also set `process.env.NODE_ENV` for libraries that expect it.

## Type Declarations

| File | Purpose |
|------|---------|
| **src/global.d.ts** | Declares `__DEV__`, `__NAME__`, and `declare module '*.vue'` for SFC default export. |
| **shim.d.ts** | Declares `webext-bridge` module augmentation: `ProtocolMap` for message names and payload/return types (see best-practices-type-safe-messaging). |
| **modules.d.ts** | Declares Vue `ComponentCustomProperties`: `$app: { context: string }` so templates and type-checking see `$app` from common-setup. |

Ensure these are included by `tsconfig.json` (root or via references). The repo root has `shim.d.ts` and `modules.d.ts`; `src/global.d.ts` is under src so it applies to src code.

## Runtime Env (src/env.ts)

Used in **browser contexts** (content script, popup, options, sidepanel) where `navigator` and URLs are available:

```ts
const forbiddenProtocols = [
  'chrome-extension://', 'chrome-search://', 'chrome://',
  'devtools://', 'edge://', 'https://chrome.google.com/webstore',
]
export function isForbiddenUrl(url: string): boolean {
  return forbiddenProtocols.some(protocol => url.startsWith(protocol))
}
export const isFirefox = navigator.userAgent.includes('Firefox')
```

- **isForbiddenUrl**: Used by background (e.g. contentScriptHMR) to avoid injecting into extension/store pages. Add or remove protocols as needed.
- **isFirefox**: Runtime Firefox detection; use when behavior differs (e.g. path prefix for script injection). Build-time `isFirefox` in scripts/utils comes from `EXTENSION=firefox` and only affects manifest/build.

## Key Points

- Use `__DEV__` and `__NAME__` in code; do not redefine them elsewhere. They are replaced at build time.
- Keep webext-bridge message types in `shim.d.ts` (ProtocolMap) so sendMessage/onMessage stay type-safe.
- Use `src/env.ts` for runtime-only checks (URL, user agent); use scripts/utils for build-time env (port, isFirefox for manifest).

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/global.d.ts, shim.d.ts, modules.d.ts, src/env.ts, scripts/utils.ts, vite.config.mts)
-->
