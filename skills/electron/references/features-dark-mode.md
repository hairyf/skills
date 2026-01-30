---
name: features-dark-mode
description: Dark mode in Electron — nativeTheme, themeSource, and prefers-color-scheme in the renderer.
---

# Dark Mode

Native UI (file picker, window chrome, dialogs, context menus) follows the OS theme by default. Your own UI can follow the system theme or be overridden manually via the `nativeTheme` module.

## Automatic: follow system

Use the `prefers-color-scheme` CSS media query in the renderer so your styles follow the system light/dark setting:

```css
@media (prefers-color-scheme: dark) {
  body { background: #1e1e1e; color: #eee; }
}
```

The `nativeTheme` module (main process) exposes `shouldUseDarkColors` (boolean). You can read it from main or expose it via preload so the renderer can sync (e.g. set a class or data attribute).

## Manual: override theme

Set `nativeTheme.themeSource` to `'system'`, `'light'`, or `'dark'`. This affects both native UI and the value of `prefers-color-scheme` seen by the renderer, so your CSS will update accordingly.

```js
const { nativeTheme } = require('electron')
nativeTheme.themeSource = 'dark'   // force dark
nativeTheme.themeSource = 'light'  // force light
nativeTheme.themeSource = 'system' // follow OS
```

Listen to `nativeTheme.on('updated', () => { ... })` when the system theme or `themeSource` changes.

## macOS

On macOS 10.14+ (Mojave) system dark mode is supported. On 10.15 (Catalina) “automatic” dark mode is supported; for `nativeTheme.shouldUseDarkColors` and Tray to behave correctly, use Electron ≥7 or set `NSRequiresAquaSystemAppearance` to `false` in `Info.plist`. Electron Packager and Forge have a `darwinDarkModeSupport` (or similar) option to set this at build time. Electron 8+ does not allow opting out of native theming.

## Key points

- Use `prefers-color-scheme` in CSS to style your app for system light/dark.
- Use `nativeTheme.themeSource` to override ('system' | 'light' | 'dark'); use `nativeTheme.on('updated')` to react to changes.
- On macOS, ensure `Info.plist` / build config allows dark mode if you rely on it.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/dark-mode.md
- https://www.electronjs.org/docs/latest/tutorial/dark-mode
- https://www.electronjs.org/docs/latest/api/native-theme
-->
