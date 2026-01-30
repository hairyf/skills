---
name: develop-touch-bar
description: macOS Touch Bar; TouchBar, items (Button, Label, Slider, etc.), setTouchBar, escapeItem.
---

# Touch Bar (macOS)

The **TouchBar** API (main process) creates native macOS Touch Bar layouts. Use `BrowserWindow.setTouchBar(touchBar)` to attach a Touch Bar to a window. macOS only; experimental and may change in future Electron releases.

## Usage

```js
const { app, BrowserWindow, TouchBar } = require('electron')
const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar

const touchBar = new TouchBar({
  items: [
    new TouchBarButton({ label: 'Click', click: () => console.log('clicked') }),
    new TouchBarSpacer({ size: 'flexible' }),
    new TouchBarLabel({ label: 'Status' })
  ],
  escapeItem: new TouchBarButton({ label: 'Close' }) // replaces Esc area
})

const win = new BrowserWindow()
win.setTouchBar(touchBar)
```

## Item Types

- **TouchBarButton** — label, icon, backgroundColor, click
- **TouchBarLabel** — label
- **TouchBarColorPicker** — available colors, change callback
- **TouchBarGroup** — group of items
- **TouchBarPopover** — popover with child items
- **TouchBarScrubber** — scrollable list
- **TouchBarSegmentedControl** — segments, mode (single/multiple), change
- **TouchBarSlider** — label, value, min, max, change
- **TouchBarSpacer** — size: small, large, flexible
- **TouchBarOtherItemsProxy** — placeholder for "other" items from the system

Access constructors via `TouchBar.TouchBarButton`, etc.

## Instance Property

- **touchBar.escapeItem** — Item shown in the Esc area; set to `null` to restore default.

## Key Points

- Main process only; create in main and pass to `win.setTouchBar(touchBar)`.
- Without a physical Touch Bar, use [Touch Bar Simulator](https://github.com/sindresorhus/touch-bar-simulator) to test.
- Electron built-in classes cannot be subclassed.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/touch-bar
- https://www.electronjs.org/docs/latest/api/touch-bar-button
-->
