---
name: best-practices-security
description: Security checklist for Electron apps — content loading, webPreferences, CSP, IPC validation, and distribution.
---

# Security Best Practices

Electron apps run with more power than a webpage; security is the developer’s responsibility. Follow these patterns when implementing or reviewing an Electron app.

## Content and webPreferences

- **Load only secure content:** Use HTTPS (and WSS, etc.) for remote resources. Do not load remote code with Node integration enabled.
- **Do not enable Node in renderers that load remote content.** Rely on preload + `contextBridge` to expose a minimal API. Default since Electron 5.
- **Keep context isolation enabled.** Default since Electron 12. Do not set `contextIsolation: false` for remote content.
- **Keep the sandbox enabled** for renderers. Default since Electron 20. Do not set `sandbox: false` without a strong reason.
- **Do not disable `webSecurity`.** Do not enable `allowRunningInsecureContent` or experimental/Blink features unless necessary.
- **Handle session permission requests** for remote content: use `session.defaultSession.setPermissionRequestHandler()` and allow only what you need (e.g. by origin).

## CSP and navigation

- **Set a strict Content-Security-Policy** (e.g. `script-src 'self'`). Prefer HTTP headers via `webRequest.onHeadersReceived`; for `file://` you can use a `<meta>` tag.
- **Limit navigation:** In `webContents` `will-navigate`, parse the URL (e.g. with `new URL()`) and `event.preventDefault()` unless the target is allowed. Avoid naive string checks (e.g. `startsWith('https://example.com')` can be bypassed).
- **Limit new windows:** Use `contents.setWindowOpenHandler()`. Prefer opening external URLs in the OS browser via `shell.openExternal(url)` and return `{ action: 'deny' }` for in-app window creation when not needed.

## IPC and preload

- **Validate the sender of IPC:** In `ipcMain.handle` and `ipcMain.on`, validate `event.sender` or `event.senderFrame` (e.g. allowlist origin) before performing sensitive actions or returning secrets.
- **Do not expose raw Electron APIs to the renderer.** Expose one method per action via `contextBridge`; never pass the IPC event or `ipcRenderer` to the page. Wrap listeners so the callback receives only safe data.

## External and protocol

- **Do not use `shell.openExternal` with untrusted or user-controlled input;** it can be abused to run local resources or protocols.
- **Prefer a custom protocol over `file://`** for serving app pages so you can restrict what is loadable and avoid full filesystem exposure on XSS.

## Distribution and tooling

- **Use a current version of Electron** and track [breaking changes](https://www.electronjs.org/docs/latest/breaking-changes) when upgrading.
- **Check fuses:** Use [Fuses](https://www.electronjs.org/docs/latest/tutorial/fuses) (e.g. `runAsNode`, `nodeCliInspect`) and turn off what your app does not need.

## WebView-specific

- Do not use `allowpopups` on `<webview>` unless required. Validate `<webview>` creation in `will-attach-webview`: restrict URL, remove or validate `preload`, and do not enable Node integration for the webview.

## Key points

- Treat remote content as untrusted: no Node in that renderer, strict CSP, limit navigation and new windows, validate IPC senders.
- Expose minimal, purpose-built APIs via preload and `contextBridge`; keep context isolation and sandbox on.
- Use HTTPS, a current Electron version, and custom protocols instead of `file://` where possible.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/security.md
- https://www.electronjs.org/docs/latest/tutorial/security
-->
