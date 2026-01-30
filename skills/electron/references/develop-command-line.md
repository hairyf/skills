---
name: develop-command-line
description: app.commandLine API and supported switches; appendSwitch, hasSwitch, getSwitchValue; Electron/Node/Chromium flags.
---

# Command Line (Switches and API)

Electron’s main process can read and modify the command-line switches that Chromium (and, for some, Node) see via `app.commandLine`. Apply switches **before** `app.whenReady()` (e.g. at top of main script).

## CommandLine API (Main Process)

`app.commandLine` is the only way to get/set these; it is not on `process.argv`.

- **`appendSwitch(switch[, value])`** — Add a switch (without `--`). Example: `app.commandLine.appendSwitch('remote-debugging-port', '8315')`.
- **`appendArgument(value)`** — Append a raw argument (e.g. `--enable-experimental-web-platform-features`).
- **`hasSwitch(switch)`** — Returns whether the switch is present.
- **`getSwitchValue(switch)`** — Returns the switch’s value or empty string.
- **`removeSwitch(switch)`** — Remove the switch.

These do **not** change `process.argv`; they only affect Chromium (and, where applicable, Node) behavior.

## Common Electron/Chromium Switches

- **`remote-debugging-port`** — Enable remote DevTools (e.g. `8315`).
- **`host-rules`** / **`host-resolver-rules`** — Host mapping (e.g. `MAP * 127.0.0.1`).
- **`proxy-server`**, **`proxy-bypass-list`**, **`proxy-pac-url`** — Proxy configuration.
- **`no-sandbox`** — Disable Chromium sandbox (testing only).
- **`disable-http-cache`**, **`disable-renderer-backgrounding`**, **`js-flags`** — Tuning/debug.
- **`enable-logging`**, **`log-file`**, **`log-level`**, **`log-net-log`** — Logging.
- **`lang`** — Custom locale.
- **`force_high_performance_gpu`** / **`force_low_power_gpu`** — GPU selection (e.g. multi-GPU laptops).

Node-related: **`--inspect`**, **`--inspect-brk`**, **`--inspect-port`** (and `-node` variants), **`--experimental-network-inspection`**. Unsupported switches passed to Electron when not running as `ELECTRON_RUN_AS_NODE` have no effect.

## Key Points

- Set switches before `app` emits `ready`.
- Full list: [Supported Command Line Switches](https://www.electronjs.org/docs/latest/api/command-line-switches). Chromium flags also apply; see Chromium’s flag metadata or `about://flags` in a Chromium build.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/command-line
- https://www.electronjs.org/docs/latest/api/command-line-switches
-->
