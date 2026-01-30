---
name: arch-unplugin dev and release
description: Development workflow, playground usage, and releasing an unplugin package.
---

# Dev and Release

## Development

- **Build (watch):** `pnpm run dev` — runs the build in watch mode (e.g. `tsdown -w`) so changes in `src/` update `dist/`.
- **Playground:** `pnpm run play` — runs the dev server of the local playground (e.g. `npm -C playground run dev`). Use the playground to test the plugin against a real app (e.g. Vite + main.ts that uses the transformed code).
- **Test:** `pnpm run test` — runs the test suite (e.g. Vitest). Add unit or integration tests for transform logic as needed.

Typical flow: run `pnpm run dev` in one terminal and `pnpm run play` in another, or run play once and rely on watch to pick up builds.

## Playground Setup

The template playground usually has:

- A small app (e.g. `playground/index.html` + `playground/main.ts`) that triggers the plugin (e.g. a file that matches `transformInclude`).
- A config that imports the plugin from the repo (e.g. `import Unplugin from '../src/vite'`) so you test the source without publishing.

Confirm the plugin’s behavior (e.g. string replacement, resolved IDs) in the playground before releasing.

## Release

- **Release:** `pnpm run release` — typically runs `bumpp` (version bump + tag) and then `pnpm publish`. Use it when you want to publish a new version to npm.
- **Prepublish:** `prepublishOnly` usually runs the build (e.g. `npm run build`) so `dist/` is up to date before publish.

Before running release, ensure version in `package.json` is intended, changelog is updated if needed, and the package builds and tests pass.

## Key Points

- Use the playground to validate the plugin against at least one bundler (usually Vite) during development.
- Keep build and play scripts so contributors can run `dev` + `play` and `release` with minimal setup.
- Optional: add a simple Vitest test that imports the factory and asserts on `transform` output.

<!--
Source references:
- https://github.com/unplugin/unplugin-starter
- package.json scripts, playground/
-->
