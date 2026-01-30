---
name: core-nuxt-config
description: defineNuxtConfig, modules, app head, nitro, and experimental options in arch-nuxt
---

# Nuxt config (defineNuxtConfig)

Configuration lives in `nuxt.config.ts` via `defineNuxtConfig`. PWA options are split into `app/config/pwa.ts` and spread into the config.

## Usage

```ts
// nuxt.config.ts
import { pwa } from './app/config/pwa'
import { appDescription } from './app/constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [/* favicon, apple-touch-icon */],
      meta: [/* description, theme-color, viewport */],
    },
  },
  colorMode: { classSuffix: '' },
  future: { compatibilityVersion: 4 },
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  compatibilityDate: '2024-08-14',
  nitro: {
    esbuild: { options: { target: 'esnext' } },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },
  eslint: { config: { standalone: false, nuxt: { sortConfigKeys: true } } },
  pwa,
})
```

## Key points

- **Modules** — VueUse, UnoCSS, Pinia, ColorMode, VitePWA, ESLint are registered here; add or remove as needed.
- **app.head** — Viewport, favicons, meta description, theme-color (light/dark). Use `app/constants` for app name/description.
- **future.compatibilityVersion** — Set to 4 for Nuxt 4.
- **experimental** — `payloadExtraction`, `renderJsonPayloads`, `typedPages` control payload and typing behavior.
- **nitro** — Prerender routes and ignore list; esbuild target for server.
- **pwa** — Import from `app/config/pwa.ts` so manifest and workbox stay in one place.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://nuxt.com/docs
-->
