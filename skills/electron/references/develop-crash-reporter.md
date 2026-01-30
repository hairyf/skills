---
name: develop-crash-reporter
description: crashReporter — start, submitURL, extra, addExtraParameter; call early, before ready.
---

# Crash Reporter

The `crashReporter` module (main and renderer; use from preload and expose via contextBridge if needed) submits crash reports to a remote server using Crashpad. Call **start** as early as possible in app startup, preferably **before** `app.on('ready')`; renderers created before the crash reporter is started are not monitored.

## Starting the crash reporter

```js
const { crashReporter } = require('electron')

crashReporter.start({
  submitURL: 'https://your-domain.com/crash-report',
  uploadToServer: true,
  compress: true,
  extra: { key: 'value' },
  globalExtra: { _companyName: 'MyApp' }
})
```

Options include:
- **submitURL** — URL to POST crash reports (required unless `uploadToServer: false`).
- **uploadToServer** — If `false`, crashes are stored locally but not uploaded. Default `true`.
- **compress** — Send with gzip. Default `true`.
- **extra** — Key/value (string only) for main-process crashes; use **addExtraParameter** for updates.
- **globalExtra** — Key/value (string only) for all processes; cannot be changed after start. `productName` and app version are included by default.
- **ignoreSystemCrashHandler** — If `true`, main-process crashes are not forwarded to the system crash handler. Default `false`.
- **rateLimit** (macOS, Windows) — Limit uploads to 1/hour. Default `false`.

The crash reporter cannot be disabled once started. Set the crash dumps directory with **app.setPath('crashDumps', path)** before calling **start** if you want a custom location.

## Extra parameters

- **crashReporter.addExtraParameter(key, value)** — Add or update an extra parameter (main process only) for subsequent crashes. Only string values.
- For child/renderer crashes, call **addExtraParameter** from that process (e.g. in preload) if you need process-specific extra data.

## Testing

Use **process.crash()** to trigger a crash for testing. Use a server that accepts the Crashpad upload protocol (e.g. [mini-breakpad-server](https://github.com/electron/mini-breakpad-server), [Sentry](https://docs.sentry.io/clients/electron), [Backtrace](https://backtrace.io/electron/)).

## Key points

- Call **crashReporter.start()** as early as possible, **before** **ready**; otherwise some processes may not be monitored.
- Provide **submitURL** (or set **uploadToServer: false** for local-only). Use **extra** / **globalExtra** for string annotations.
- Use **addExtraParameter** to add/update extra data after start. Use **app.setPath('crashDumps', path)** before start to set the crash directory.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/crash-reporter.md
- https://www.electronjs.org/docs/latest/api/crash-reporter
-->
