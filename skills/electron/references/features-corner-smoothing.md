---
name: features-corner-smoothing
description: -electron-corner-smoothing CSS; smooth rounded corners; system-ui; Electron-only, experimental.
---

# Corner Smoothing (CSS)

Electron supports the **`-electron-corner-smoothing`** CSS property to smooth the rounding of **border-radius**, similar to Apple’s “continuous” corners in SwiftUI or Figma’s corner smoothing. It affects borders, outlines, and shadows. **Electron-only**; no effect in browsers. Considered experimental and may change if a standard appears.

## Usage

```css
.box {
  width: 128px;
  height: 128px;
  background-color: cornflowerblue;
  border-radius: 24px;
  -electron-corner-smoothing: 60%; /* 0% = sharp, 100% = maximum smooth */
}
```

## Values

- **&lt;percentage&gt;** — 0% (no smoothing) to 100% (maximum). Small elements may effectively get less smoothing.
- **system-ui** — Matches OS: on macOS ~60%, on Windows/Linux 0%.

## Disabling

To turn off this rule app-wide, set **webPreferences.disableBlinkFeatures: 'ElectronCSSCornerSmoothing'** on the BrowserWindow.

## Key Points

- Use only in Electron; avoid in shared CSS that runs in browsers.
- Combines with **border-radius**; smoothing backs off if the element is too small for the value.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/corner-smoothing-css
-->
