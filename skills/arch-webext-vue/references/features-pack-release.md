---
name: arch-webext-vue-pack-release
description: Pack scripts (zip, crx, xpi), clear, and run extension in Chromium/Firefox for the Vitesse WebExtension template.
---

# Pack and Run

After **pnpm build**, the **extension/** folder contains the full unpacked extension. Use **pack** scripts to produce distributable artifacts (zip for Chrome Web Store, crx or xpi for sideloading). Use **start:** scripts to launch a browser with the extension loaded.

## Build First

```bash
pnpm build
```

This runs: `clear` → `build:web` → `build:prepare` → `build:background` → `build:js`. Output is under `extension/` (manifest + dist/ + assets).

## Pack Scripts

| Script | Output | Use case |
|--------|--------|----------|
| `pnpm run pack` | Runs all pack:* in parallel | — |
| `pnpm run pack:zip` | `extension.zip` (all of extension/) | Chrome Web Store upload, or generic zip. |
| `pnpm run pack:crx` | `extension.crx` | Chrome packed extension (sideload). |
| `pnpm run pack:xpi` | `extension.xpi` (via web-ext build) | Firefox Add-ons upload or sideload. |

- **pack:zip**: Uses `jszip-cli`; adds `extension/*` into `extension.zip`.
- **pack:crx**: Uses `crx`; packs `extension/` to `extension.crx`.
- **pack:xpi**: Sets `WEB_EXT_ARTIFACTS_DIR=./` and runs `web-ext build --source-dir ./extension --filename extension.xpi --overwrite-dest`.

## Clear

```bash
pnpm run clear
```

Runs `rimraf --glob extension/dist extension/manifest.json extension.*`. Removes built dist, generated manifest, and any existing extension.zip / extension.crx / extension.xpi. Dev and build both run clear at the start (build then repopulates extension/).

## Start (Launch Browser with Extension)

| Script | Purpose |
|--------|---------|
| `pnpm run start:chromium` | `web-ext run --source-dir ./extension --target=chromium` |
| `pnpm run start:firefox` | `web-ext run --source-dir ./extension --target=firefox-desktop` |

Requires a built extension (`pnpm build` first). Uses **web-ext** to open a browser profile with only this extension loaded. Useful for testing the packed flow without manually loading unpacked.

## Key Points

- Pack scripts expect `extension/` to be fully built; run `pnpm build` before `pnpm run pack` or `pack:zip`/`pack:crx`/`pack:xpi`.
- Chrome Web Store typically wants a zip of the extension directory; Firefox Add-ons accept xpi from `web-ext build`.
- `extension.*` in clear removes previous pack outputs so new packs don’t mix with old ones.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (package.json)
-->
