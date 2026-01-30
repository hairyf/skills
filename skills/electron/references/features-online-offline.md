---
name: features-online-offline
description: Online/offline detection — net.isOnline(), net.online (main), navigator.onLine and events (renderer).
---

# Online/Offline Detection

## Renderer process

Use the standard [Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) and [online/offline events](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event):

- **`navigator.onLine`** — `false` when the network is effectively down; `true` otherwise. A `true` value does not guarantee internet access (e.g. captive portals, virtual adapters).
- **`window.addEventListener('online', ...)`** / **`window.addEventListener('offline', ...)`** — Fired when the browser’s online state changes.

Use these to show a connection status indicator or to pause/resume network-dependent logic.

## Main process

Use the `net` module (available after `app` `ready`):

- **`net.isOnline()`** — Returns a boolean; same semantics as `navigator.onLine`.
- **`net.online`** — Read-only boolean property; same value.

Use when main process code needs to check connectivity (e.g. before starting a download or sync). For stronger “can reach the internet” checks, perform a small request to a known endpoint; `net.online` / `navigator.onLine` only indicate link/network availability.

## Key points

- **Renderer:** Use **navigator.onLine** and **online** / **offline** events for UI and logic.
- **Main:** Use **net.isOnline()** or **net.online** after **ready**. Treat **true** as “likely online”; add your own reachability check if needed.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/online-offline-events.md
- https://www.electronjs.org/docs/latest/tutorial/online-offline-events
- https://www.electronjs.org/docs/latest/api/net
-->
