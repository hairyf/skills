---
name: best-practices-vscode-ext
description: Best practices for VSCode extensions with arch-vscode (reactive-vscode + tsdown)
---

# Best Practices (arch-vscode)

Practical patterns for building and maintaining VSCode extensions with this starter: reactive-vscode, tsdown, and generated meta.

## Structure and Entry

- **Single entry** — Keep one extension entry (`src/index.ts`); use `config.ts` and `utils.ts` for config and logger, and import them where needed.
- **Export activate/deactivate** — Always export `{ activate, deactivate }` from the entry; reactive-vscode manages disposables inside the callback.
- **Generated meta** — Never edit `src/generated/meta.ts` by hand; run `pnpm update` after any change to `package.json` contributes.

## Contributes and Types

- **Commands** — Add every command to `contributes.commands` and run `pnpm update`; use generated command IDs in `commands.registerCommand` for type safety and discoverability.
- **Configuration** — Define all settings under `contributes.configuration.properties`; use `defineConfig` with generated `ScopedConfigKeyTypeMap` so config access is typed.
- **Activation** — Prefer `onCommand:...` for extensions that only react to commands; use `onStartupFinished` when you need to run on load (e.g. status bar, global watchers).

## Build and Publish

- **External vscode** — Always keep `vscode` in tsdown `external`; the extension host provides it.
- **CJS output** — Keep `format: ['cjs']` and `main: "./dist/index.cjs"` unless you have a specific reason to ship ESM.
- **Package before publish** — Use `pnpm ext:package` to produce a `.vsix` and test install in a clean environment; use `pnpm ext:publish` for Open VSX and vsce for the official Marketplace.

## Development

- **Watch + Extension Host** — Use the provided **Extension** launch config and **dev** task so every save triggers a rebuild and you can test in the Development Host.
- **Run on Save** — Use Run on Save to run `npm run update` on `package.json` so generated meta is always current.
- **Logging** — Use the shared `logger` (defineLogger) for user-facing and diagnostic messages; avoid `console.log` in production code.

## Testing

- **Vitest** — Use for unit tests; mock `vscode` or reactive-vscode APIs as needed. The default `test/index.test.ts` is a placeholder; add tests for utils and non-UI logic.
- **Manual QA** — Test commands, config, and UI in the Extension Development Host; verify activation events and disposal (e.g. no leaks after disabling the extension).

## Key Points

- Keep **contributes** and **generated meta** in sync via `pnpm update` (or Run on Save).
- Use **reactive-vscode** composables and **defineConfig** for reactive state and config; avoid manual disposable tracking where the library handles it.
- Prefer **onCommand** activation when possible to keep startup impact low.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://kermanx.com/reactive-vscode/
- https://code.visualstudio.com/api
-->
