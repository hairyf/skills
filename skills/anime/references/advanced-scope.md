---
name: advanced-scope
description: createScope and Scope—execution context, defaults, methods, keepTime, revert
---

# Scope (createScope / Scope)

**createScope(params)** returns a **Scope** instance: an execution context that sets `scope.current`, `scope.root`, and `globals.defaults` while running callbacks. Use for scoped defaults, named methods, and revertible setup (e.g. layout, scroll observers).

## Usage

```javascript
import { createScope, animate, createTimeline } from 'animejs';

const sc = createScope({
  root: document.body,
  defaults: { duration: 500, ease: 'outQuad' },
  mediaQueries: { small: '(max-width: 600px)' }
});

// Run code in this scope (defaults and root apply)
sc.execute(() => {
  animate('.box', { x: 100 });  // uses sc.defaults
});

// Named methods (run in scope when called)
sc.add('.box', (self) => {
  animate(self.$target, { x: 100 });
});

// One-shot constructor (revert on next refresh)
sc.addOnce((scope) => {
  const tl = createTimeline();
  tl.add('.box', { x: 100 });
  return () => tl.revert();
});

// Preserve animation state when re-running (e.g. for hot reload)
const tickable = sc.keepTime((scope) => animate('.box', { x: 100 }));

// Refresh: revert all, re-run constructors
sc.refresh();

// Revert and remove listeners
sc.revert();
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `root` | Document or element for this scope (default `document`). |
| `defaults` | Merged with global defaults inside this scope. |
| `mediaQueries` | `{ name: query }`; scope gets `scope.matches[name]` and refreshes on change. |

## Scope API

- **`execute(callback)`** — Run `callback(scope)` with this scope current; returns callback result.
- **`add(selectorOrCb, method?)`** — If function: register constructor (revertible). If string: add named method `scope.methods[name](...args)` that runs in scope.
- **`addOnce(cb)`** — One-shot constructor; run once per `refresh()`.
- **`keepTime(cb)`** — Run `cb(scope)` and preserve animation state when run again (uses `utils.keepTime`).
- **`refresh()`** — Revert all, then re-run all constructors.
- **`revert()`** — Revert all and remove media query listeners.
- **`register(revertible)`** — Add a revertible (e.g. layout, observer) to the scope.
- **`defaults`**, **`root`**, **`methods`**, **`matches`**, **`data`** — Read/write state.

## Key points

- **Scope** sets execution context (current scope, root, defaults); **onScroll** / **scope (viewport)** are for scroll/viewport.
- Use `execute()` so `animate()` / `createTimeline()` inside use this scope’s defaults and root.
- Use `addOnce` / `add` with revert callbacks for cleanup on `refresh()` or `revert()`.

<!--
Source references:
- sources/anime/src/scope/scope.js
- https://github.com/juliangarnier/anime
-->
