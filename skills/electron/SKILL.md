---
name: electron
description: Build cross-platform desktop apps with JavaScript, HTML, and CSS. Use when building or maintaining Electron apps, configuring IPC/security, or packaging and distributing.
metadata:
  author: hairy
  version: "2026.1.30"
  source: Generated from https://github.com/electron/electron, scripts located at https://github.com/antfu/skills
---

Electron embeds Chromium and Node.js so you can ship one JavaScript codebase for Windows, macOS, and Linux. Use these skills when scaffolding projects, wiring main/renderer IPC, configuring security and packaging, or integrating native modules and auto-updates.

> The skill is based on Electron (latest), generated at 2026-01-30.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Process Model | Main, renderer, preload, utility process; when to use each | [core-process-model](references/core-process-model.md) |
| IPC | Renderer↔main patterns (send, invoke, main→renderer), serialization | [core-ipc](references/core-ipc.md) |
| Context Isolation | contextBridge, exposing safe APIs from preload | [core-context-isolation](references/core-context-isolation.md) |
| Sandbox | Process sandboxing, preload polyfill, when it is disabled | [core-sandbox](references/core-sandbox.md) |

## Develop

| Topic | Description | Reference |
|-------|-------------|-----------|
| Accessibility | setAccessibilitySupportEnabled, assistive tech, AXManualAccessibility | [develop-accessibility](references/develop-accessibility.md) |
| App Lifecycle | whenReady, window-all-closed, quit, single instance lock | [develop-app-lifecycle](references/develop-app-lifecycle.md) |
| BrowserWindow | Creating windows, loadURL/loadFile, ready-to-show, webPreferences | [develop-browser-window](references/develop-browser-window.md) |
| Clipboard | readText/writeText, readHTML/writeHTML; use from preload | [develop-clipboard](references/develop-clipboard.md) |
| Context Menu | Right-click menu; webContents context-menu, Menu.popup | [develop-context-menu](references/develop-context-menu.md) |
| Crash Reporter | crashReporter.start, submitURL, extra; call before ready | [develop-crash-reporter](references/develop-crash-reporter.md) |
| Debug | Renderer DevTools, main process (--inspect, Chrome/VSCode) | [develop-debug](references/develop-debug.md) |
| DevTools Extension | loadExtension, removeExtension; electron-devtools-installer | [develop-devtools-extension](references/develop-devtools-extension.md) |
| Dialog | showOpenDialog, showSaveDialog, showMessageBox; expose via IPC | [develop-dialog](references/develop-dialog.md) |
| Downloads | will-download, DownloadItem, setSavePath, preventDefault | [develop-downloads](references/develop-downloads.md) |
| Keyboard Shortcuts | Accelerators, local (MenuItem), global (globalShortcut) | [develop-keyboard-shortcuts](references/develop-keyboard-shortcuts.md) |
| Menus and Tray | Application/context/tray/dock menus; Tray icon and context menu | [develop-menus-tray](references/develop-menus-tray.md) |
| Native Image | createFromPath, createFromBuffer, template image; tray, icon | [develop-native-image](references/develop-native-image.md) |
| Native Modules | Using native Node addons; @electron/rebuild, node-gyp | [develop-native-modules](references/develop-native-modules.md) |
| Net | net.fetch, net.request; HTTP from main (Chromium stack) | [develop-net](references/develop-net.md) |
| Drag and Drop | Native file drag out; webContents.startDrag, IPC | [develop-drag-drop](references/develop-drag-drop.md) |
| ESM | ES modules in main and preload; .mjs, caveats | [develop-esm](references/develop-esm.md) |
| Multithreading | Web Workers, nodeIntegrationInWorker; no Electron in workers | [develop-multithreading](references/develop-multithreading.md) |
| Navigation History | webContents.navigationHistory, goBack, goForward, getAllEntries | [develop-navigation-history](references/develop-navigation-history.md) |
| Power Monitor | suspend, resume, battery/AC, thermal-state-change, shutdown | [develop-power-monitor](references/develop-power-monitor.md) |
| Progress Bar | setProgressBar (taskbar/dock); 0–1, indeterminate | [develop-progress-bar](references/develop-progress-bar.md) |
| Protocol | Custom protocol (protocol.handle), registerSchemesAsPrivileged | [develop-protocol](references/develop-protocol.md) |
| Recent Documents | addRecentDocument, clearRecentDocuments; JumpList, Dock | [develop-recent-documents](references/develop-recent-documents.md) |
| Safe Storage | encryptString, decryptString; OS keychain | [develop-safe-storage](references/develop-safe-storage.md) |
| Screen | getPrimaryDisplay, getAllDisplays, workAreaSize, display events | [develop-screen](references/develop-screen.md) |
| Session | partition, defaultSession, permissionRequestHandler, cookies | [develop-session](references/develop-session.md) |
| Shell | openExternal, openPath, showItemInFolder, trashItem; security | [develop-shell](references/develop-shell.md) |
| Process | process.type, process.versions, process.platform, process.mas | [develop-process](references/develop-process.md) |
| Environment Variables | ELECTRON_*, NODE_OPTIONS; fuses | [develop-environment-variables](references/develop-environment-variables.md) |
| Represented File | setRepresentedFilename, setDocumentEdited (macOS title bar) | [develop-represented-file](references/develop-represented-file.md) |
| System Preferences | getEffectiveAppearance, getColor, getMediaAccessStatus | [develop-system-preferences](references/develop-system-preferences.md) |
| Tests | WebDriver/WebdriverIO E2E, headless CI | [develop-tests](references/develop-tests.md) |
| Utility Process | utilityProcess.fork, postMessage, MessagePortMain | [develop-utility-process](references/develop-utility-process.md) |
| Web Request | onBeforeRequest, onHeadersReceived, filter; set CSP | [develop-web-request](references/develop-web-request.md) |
| webContents Navigation | will-navigate, setWindowOpenHandler, load events | [develop-webcontents-navigation](references/develop-webcontents-navigation.md) |
| Window Customization | Frameless, transparent, custom title bar | [develop-window-customization](references/develop-window-customization.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Performance | Measure first, defer loading, avoid blocking, bundle | [best-practices-performance](references/best-practices-performance.md) |
| Security | Content loading, webPreferences, CSP, IPC validation, distribution | [best-practices-security](references/best-practices-security.md) |
| Versioning | SemVer, ~ vs ^, stabilization branches, upgrade and EOL | [best-practices-versioning](references/best-practices-versioning.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| ASAR | Pack/unpack, Node and Web API usage, unpack option, integrity | [features-asar](references/features-asar.md) |
| Dark Mode | nativeTheme, themeSource, prefers-color-scheme | [features-dark-mode](references/features-dark-mode.md) |
| Desktop Capture | desktopCapturer, setDisplayMediaRequestHandler, getDisplayMedia | [features-desktop-capture](references/features-desktop-capture.md) |
| Fuses | runAsNode, nodeCliInspect, asar integrity; @electron/fuses | [features-fuses](references/features-fuses.md) |
| MessagePorts | Renderer-to-renderer and main-renderer messaging; MessagePortMain | [features-message-ports](references/features-message-ports.md) |
| Notifications | Main (Notification), renderer (Web Notifications API) | [features-notifications](references/features-notifications.md) |
| Online/Offline | net.isOnline(), net.online; navigator.onLine, online/offline events | [features-online-offline](references/features-online-offline.md) |
| Spellchecker | Enable, setSpellCheckerLanguages, context menu, dictionary URL | [features-spellchecker](references/features-spellchecker.md) |
| Updates | autoUpdater, Squirrel, publishing release metadata | [features-updates](references/features-updates.md) |
| Web Embeds | iframe, WebContentsView, webview tag; when to use each | [features-web-embeds](references/features-web-embeds.md) |

## Distribute

| Topic | Description | Reference |
|-------|-------------|-----------|
| Code Signing | macOS sign + notarize; Windows Authenticode | [distribute-code-signing](references/distribute-code-signing.md) |
| Mac App Store | MAS build, Apple Distribution, sandbox, limitations | [distribute-mac-app-store](references/distribute-mac-app-store.md) |
| Packaging | Tooling (Forge), manual layout, asar, rebranding | [distribute-packaging](references/distribute-packaging.md) |
| Windows Store | AppX/MSIX, electron-windows-store, process.windowsStore | [distribute-windows-store](references/distribute-windows-store.md) |
