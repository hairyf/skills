---
name: arch-webext-vue-overview
description: Overview of the Vitesse WebExtension (Vue + Vite) starter—features, stack, and when to use it.
---

# arch-webext-vue Overview

Vitesse WebExt is a **Vite-powered WebExtension** starter for Chrome, Firefox, and other browsers. It uses **Vue 3** (Composition API, `<script setup>`), **TypeScript**, **UnoCSS**, and **webext-bridge** for cross-context communication. Use this skill when scaffolding or maintaining a browser extension with Vue and Vite.

## Features (Agent-Relevant)

- **Multi-entry Vite**: Popup, options, sidepanel as HTML entries; background and content scripts built with separate Vite configs.
- **Dynamic manifest**: `manifest.json` is generated from `src/manifest.ts` (reads `package.json`, dev vs prod, Firefox vs Chrome).
- **Instant HMR**: Dev uses Vite; load the `extension/` folder in the browser. Stub HTML and manifest are written/updated by scripts.
- **Cross-context communication**: `webext-bridge` for background ↔ content-script ↔ popup/options messaging.
- **Content script with Vue**: Content script entry mounts a Vue app inside a shadow DOM; styles are loaded via `web_accessible_resources`.
- **Extension storage**: Composable `useWebExtensionStorage` wraps `webextension-polyfill` storage with VueUse-style reactive API.
- **Shared setup**: `setupApp()` in `~/logic/common-setup` used by popup, options, sidepanel, and content script for consistent Vue plugins and globals.

## Stack

| Layer | Tech |
|-------|------|
| Build | Vite, multi-config (main + background + content) |
| UI | Vue 3, UnoCSS, unplugin-vue-components, unplugin-icons |
| Extension | webextension-polyfill, webext-bridge |
| Dev | esno, npm-run-all, web-ext (optional for Firefox) |

## When to Use

- Creating a new Chrome/Firefox extension with Vue and TypeScript.
- Needing popup, options page, side panel, and/or content script UI.
- Wanting a single codebase with dynamic manifest and dev/build scripts that match this template.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (README.md, package.json)
-->
