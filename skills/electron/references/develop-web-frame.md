---
name: develop-web-frame
description: Renderer webFrame API; zoom, insertCSS, executeJavaScript, spell check, isolated worlds, frame tree.
---

# webFrame (Renderer)

The `webFrame` API (renderer process) customizes rendering and script execution for the **current** frame. With context isolation, call it from the preload and expose only what renderer needs via `contextBridge`.

## Zoom

- **`setZoomFactor(factor)`** / **`getZoomFactor()`** — Factor: 1 = 100%, 2 = 200%.
- **`setZoomLevel(level)`** / **`getZoomLevel()`** — Level 0 = default; each step ~20% (limits ~50%–300%).
- **`setVisualZoomLevelLimits(min, max)`** — Pinch-to-zoom limits. Visual zoom is off by default; e.g. `setVisualZoomLevelLimits(1, 3)` to enable. Cmd+/-/0 are controlled by MenuItem zoom roles.

## CSS and Script

- **`insertCSS(css[, options])`** — Injects CSS; returns a key. `options.cssOrigin`: `'user'` or `'author'`.
- **`removeInsertedCSS(key)`** — Removes CSS by key.
- **`executeJavaScript(code[, userGesture][, callback])`** — Evaluates in page; `userGesture: true` allows APIs that require user gesture (e.g. fullscreen). Returns a Promise.
- **`executeJavaScriptInIsolatedWorld(worldId, scripts[, ...])`** — Run in isolated world. World `0` = main, `999` = contextIsolation preload; use other ids for custom isolation.
- **`setIsolatedWorldInfo(worldId, info)`** — Set `securityOrigin`, `csp`, `name` for an isolated world (CSP requires origin).
- **`insertText(text)`** — Insert text at focus.

## Spell Check (Custom Provider)

With built-in spellcheck disabled in `webPreferences`, use **`setSpellCheckProvider(language, provider)`**. `provider.spellCheck(words, callback)` receives an array of words and calls `callback(misspeltWords)`. Also: **`isWordMisspelled(word)`**, **`getWordSuggestions(word)`**.

## Frame Tree and Cache

- **`top`**, **`parent`**, **`firstChild`**, **`nextSibling`**, **`opener`** — Frame hierarchy (readonly).
- **`getFrameForSelector(selector)`**, **`findFrameByName(name)`**, **`findFrameByToken(frameToken)`** — Resolve child frames.
- **`getResourceUsage()`** — Blink cache usage (images, scripts, CSS, etc.).
- **`clearCache()`** — Free caches (use sparingly; e.g. after leaving a heavy page).

## Key Points

- Renderer-only; expose via preload when context isolation is on.
- Prefer `frameToken` over deprecated `routingId` for frame identity.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/web-frame
-->
