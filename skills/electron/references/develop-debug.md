---
name: develop-debug
description: Debugging Electron apps — renderer DevTools, main process (--inspect, Chrome/VSCode), and V8 crashes.
---

# Debugging

## Renderer process

Use Chromium DevTools for any renderer (BrowserWindow, BrowserView, webview). Open them from the main process:

```js
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()
win.webContents.openDevTools()
```

DevTools debug only the JavaScript running in that window. Use breakpoints, console, and network tools as in Chrome.

## Main process

The main process has no built-in DevTools. Use an external debugger that speaks the V8 inspector protocol.

### Command-line

- **`--inspect=[port]`** — Electron listens for a debugger (default port 9229).
- **`--inspect-brk=[port]`** — Same but pauses on the first line of JavaScript.

```sh
electron --inspect=9229 .
# or
electron --inspect-brk .
```

Then attach:

- **Chrome:** Open `chrome://inspect`, find the Electron target, click "inspect".
- **VS Code:** Use a launch config that runs Electron with `--inspect` and attaches to the port.

### VS Code launch config

Example `.vscode/launch.json` to debug the main process:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."],
      "outputCapture": "std"
    }
  ]
}
```

Set breakpoints in `main.js` (or your main entry) and start this configuration from the Debug view.

## V8 crashes

If the DevTools message says "DevTools was disconnected from the page", the V8 context may have crashed. Reload the page to reconnect. Enable Chromium logging with `ELECTRON_ENABLE_LOGGING=1` or `--enable-logging` for more diagnostics.

## Key points

- Renderer: `webContents.openDevTools()` for DevTools in that window.
- Main: run with `--inspect` or `--inspect-brk` and attach Chrome or VS Code; use the launch config above for VS Code.
- Do not rely on `--inspect` in production; disable it via [fuses](references/features-fuses.md) (e.g. `nodeCliInspect`) if needed.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/application-debugging.md
- https://github.com/electron/electron/blob/main/docs/tutorial/debugging-main-process.md
- https://github.com/electron/electron/blob/main/docs/tutorial/debugging-vscode.md
- https://www.electronjs.org/docs/latest/tutorial/application-debugging
-->
