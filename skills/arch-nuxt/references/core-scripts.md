---
name: core-scripts
description: build, dev, generate, preview, typecheck, and PWA dev scripts in arch-nuxt
---

# Scripts (package.json)

Standard Nuxt scripts plus PWA dev and typecheck. Use pnpm (or the configured packageManager).

## Usage

```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "dev:pwa": "VITE_PLUGIN_PWA=true nuxt dev",
    "generate": "nuxt generate",
    "prepare": "nuxt prepare",
    "preview": "nuxt preview",
    "start": "node .output/server/index.mjs",
    "start:generate": "npx serve .output/public",
    "lint": "eslint .",
    "typecheck": "nuxt typecheck"
  }
}
```

## Key points

- **dev** — Start dev server with HMR. Prefer Vite-powered Nuxt.
- **dev:pwa** — Enable PWA plugin in dev (`VITE_PLUGIN_PWA=true`) for testing service worker and manifest.
- **build** — Production build; output in `.output/`.
- **generate** — Static site generation; static files in `.output/public/`.
- **preview** — Serve the built app (after `nuxt build`).
- **start** — Run the built server (`.output/server/index.mjs`).
- **start:generate** — Serve the static export after `nuxt generate`.
- **typecheck** — Run Nuxt typecheck (e.g. for typed pages and composables).

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs
-->
