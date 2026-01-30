---
name: features-pwa
description: VitePWA module config, manifest, workbox, and dev PWA in arch-nuxt
---

# PWA (VitePWA)

PWA is configured via `@vite-pwa/nuxt` and a dedicated config in `app/config/pwa.ts`. Options include manifest, workbox, and dev-only PWA.

## Usage

```ts
// app/config/pwa.ts
import type { ModuleOptions } from '@vite-pwa/nuxt'
import process from 'node:process'
import { appDescription, appName } from '../constants/index'

const scope = '/'

export const pwa: ModuleOptions = {
  registerType: 'autoUpdate',
  scope,
  base: scope,
  manifest: {
    id: scope,
    scope,
    name: appName,
    short_name: appName,
    description: appDescription,
    theme_color: '#ffffff',
    icons: [/* 192, 512, maskable */],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,txt,png,ico,svg}'],
    navigateFallbackDenylist: [/^\/api\//],
    navigateFallback: '/',
    cleanupOutdatedCaches: true,
    runtimeCaching: [/* e.g. Google Fonts CacheFirst */],
  },
  registerWebManifestInRouteRules: true,
  writePlugin: true,
  devOptions: {
    enabled: process.env.VITE_PLUGIN_PWA === 'true',
    navigateFallback: scope,
  },
}
```

**Enable PWA in dev**:

```bash
pnpm dev:pwa
# or
VITE_PLUGIN_PWA=true nuxt dev
```

## Key points

- **Module** — Add `@vite-pwa/nuxt` in `nuxt.config.ts` and spread `pwa` from `app/config/pwa.ts`.
- **registerType: 'autoUpdate'** — New service worker replaces old one and activates without prompt.
- **navigateFallbackDenylist** — Exclude `/api/*` from SPA fallback so API routes stay server-handled.
- **devOptions.enabled** — Only enable in dev when `VITE_PLUGIN_PWA=true` to avoid surprising dev behavior.
- **Manifest** — Use `app/constants` for `appName` and `appDescription` so they stay in sync with the rest of the app.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://github.com/vite-pwa/nuxt
-->
