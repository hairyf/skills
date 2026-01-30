---
name: develop-environment-variables
description: Environment variables — ELECTRON_*, NODE_OPTIONS, NODE_EXTRA_CA_CERTS; fuses and packaged apps.
---

# Environment Variables

Electron and Node behaviors can be controlled via environment variables. They are read before app code runs. Use them for logging, debugging, or CA certs; in packaged apps many options are restricted and some are disabled by [fuses](references/features-fuses.md).

## Common Electron variables

- **ELECTRON_ENABLE_LOGGING** — Print Chromium’s logging to stderr.
- **ELECTRON_DISABLE_SECURITY_WARNINGS** / **ELECTRON_ENABLE_SECURITY_WARNINGS** — Show or hide security warnings in the devtools console (when the binary name is “Electron”).
- **ELECTRON_RUN_AS_NODE** — When set, the Electron binary runs as Node (used by `child_process.fork`). Disabled when the **runAsNode** [fuse](references/features-fuses.md) is off.
- **GOOGLE_API_KEY** — Set in main process (before opening windows) to enable geolocation via Google’s API; see the [environment-variables API](https://www.electronjs.org/docs/latest/api/environment-variables).

Set on **process.env** or **window** (renderer) as documented.

## NODE_OPTIONS

Electron supports a **subset** of Node’s [NODE_OPTIONS](https://nodejs.org/api/cli.html#node_optionsoptions). Unsupported options include those that conflict with Chromium (e.g. `--use-bundled-ca`, `--force-fips`, `--openssl-config`). In **packaged** apps, only a few options are allowed (e.g. `--max-http-header-size`, `--http-parser`). If the **nodeOptions** [fuse](references/features-fuses.md) is disabled, NODE_OPTIONS is ignored.

## NODE_EXTRA_CA_CERTS

Path to a PEM file of extra CA certs (see [Node docs](https://nodejs.org/api/cli.html#node_extra_ca_certsfile)). Ignored when the **nodeOptions** fuse is disabled.

## Packaged apps and fuses

In packaged apps, **NODE_OPTIONS** and **NODE_EXTRA_CA_CERTS** are only respected if the **nodeOptions** fuse is enabled. Disable that fuse in production when you don’t need it. **ELECTRON_RUN_AS_NODE** is disabled when the **runAsNode** fuse is off (use [Utility Process](references/develop-utility-process.md) instead of `child_process.fork`).

## Key points

- Use **ELECTRON_ENABLE_LOGGING** and **ELECTRON_*_SECURITY_WARNINGS** for debugging. Use **GOOGLE_API_KEY** in main for geolocation.
- **NODE_OPTIONS** and **NODE_EXTRA_CA_CERTS** are limited in packaged apps and can be disabled by fuses; check [features-fuses](references/features-fuses.md).
- Do not rely on **ELECTRON_RUN_AS_NODE** when the **runAsNode** fuse is off; use the Utility Process API instead.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/environment-variables.md
- https://www.electronjs.org/docs/latest/api/environment-variables
- https://github.com/electron/electron/blob/main/docs/tutorial/fuses.md
-->
