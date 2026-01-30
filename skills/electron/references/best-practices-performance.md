---
name: best-practices-performance
description: Performance guidelines for Electron — measure first, avoid blocking, defer loading, bundle, and common pitfalls.
---

# Performance Best Practices

Performance is the developer’s responsibility. Profile first, then optimize the hottest paths. General web and Node.js performance wisdom applies; below are Electron-specific and common pitfalls.

## Measure first

Profile the running app (Chrome DevTools Performance/Memory, or Chrome Tracing for multi-process) to find bottlenecks. Optimize the most expensive operations and repeat. Do not guess.

## Checklist: common pitfalls

1. **Carelessly including modules** — Check dependency size and cost of `require()`. A module that parses huge JSON or does heavy work on load can slow startup. Prefer lean alternatives; profile with `node --cpu-prof --heap-prof -e "require('module')"` if needed.
2. **Loading and running code too soon** — Defer expensive setup (updates, disk I/O, heavy parsing) until the user needs it. Use lazy `require()` or dynamic `import()` so heavy modules load only when used.
3. **Blocking the main process** — Avoid synchronous I/O or CPU-heavy work in the main process; it freezes the app. Use async APIs, move work to a Utility Process or Worker, or do it in the renderer (with care).
4. **Blocking the renderer process** — Avoid long-running synchronous work in the renderer; it freezes the UI. Use async/workers or move work to main/utility process.
5. **Unnecessary polyfills** — Do not polyfill APIs that Chromium/Node already provide in your target environment; they add bundle size and runtime cost.
6. **Unnecessary or blocking network requests** — Avoid blocking or redundant requests at startup; defer and cache where possible.
7. **Bundle your code** — Use a bundler (webpack, esbuild, etc.) for main, preload, and renderer to reduce load time and tree-shake unused code.
8. **Default application menu** — If you do not need a menu, call `Menu.setApplicationMenu(null)` to avoid the cost of building and maintaining the default menu.

## Key points

- Profile before optimizing; focus on the biggest cost (startup, memory, main/renderer blocking).
- Defer loading and work; use async I/O and avoid blocking the main or renderer thread.
- Bundle and tree-shake; avoid heavy or unnecessary dependencies and polyfills.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/performance.md
- https://www.electronjs.org/docs/latest/tutorial/performance
-->
