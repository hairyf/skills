---
name: develop-accessibility
description: Accessibility in Electron — app.setAccessibilitySupportEnabled, assistive technology detection, AXManualAccessibility (macOS).
---

# Accessibility

Electron apps are HTML-based, so accessibility practices for the web apply: semantic markup, ARIA, keyboard navigation, and sufficient contrast. Electron also exposes Chromium’s accessibility tree to assistive technologies (e.g. JAWS on Windows, VoiceOver on macOS) when they are present.

## Automatic detection

Electron enables accessibility features when assistive technology is detected (e.g. screen readers). No extra code is required for basic exposure of the accessibility tree. See [Chrome’s accessibility docs](https://www.chromium.org/developers/design-documents/accessibility/) for how detection works.

## Manual toggle (app preferences)

Use **`app.setAccessibilitySupportEnabled(enabled)`** (macOS and Windows) to let users turn accessibility on or off from your app’s preferences. Note: the user’s system assistive utilities take precedence and can override this setting.

```js
const { app } = require('electron')
app.setAccessibilitySupportEnabled(true)
```

Use when you offer an “Accessibility” or “Screen reader” option in settings.

## Third-party software (macOS)

On macOS, third-party assistive tools can toggle accessibility inside an Electron app by setting the **AXManualAccessibility** attribute on the app’s AXUIElement (e.g. via Objective-C or Swift and the Accessibility API). This is for native code that drives or tests your app; typical app code does not need to set it.

## Key points

- Use **semantic HTML** and **ARIA** in your renderer; ensure **keyboard** navigation and **focus** order. Chromium’s accessibility tree is exposed when assistive tech is present.
- Use **app.setAccessibilitySupportEnabled(enabled)** to offer a manual toggle in preferences; system assistive tech overrides it.
- On **macOS**, third-party code can set **AXManualAccessibility** via the Accessibility API.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/accessibility.md
- https://www.electronjs.org/docs/latest/tutorial/accessibility
- https://www.electronjs.org/docs/latest/api/app#appsetaccessibilitysupportenabledenabled-macos-windows
-->
