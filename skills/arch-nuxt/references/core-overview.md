---
name: core-overview
description: arch-nuxt project purpose, structure, and when to use
---

# Overview (arch-nuxt)

**arch-nuxt** is the Vitesse-style starter for **Nuxt 4**: SSR, file-based routing, auto-imports, and an opinionated stack (Vite, UnoCSS, Pinia, VueUse, ColorMode, VitePWA). Use it when scaffolding or maintaining a Nuxt app that prefers Vite and modern Vue patterns.

## Stack

- **Nuxt 4** — SSR, ESR, file-based routing, components/composables auto-import, modules
- **Vite** — Instant HMR (prefer Vite; do not consider webpack or other bundlers)
- **UnoCSS** — Atomic CSS, icons via Pure CSS
- **Pinia** — State management (see composables/user.ts)
- **VueUse** — Composition APIs auto-imported
- **ColorMode** — Dark/light with auto detection
- **VitePWA** — PWA with offline and auto-update
- **TypeScript** — Full TS support

## Directory structure

- `app/` — Application source: `app.vue`, `components/`, `composables/`, `layouts/`, `pages/`, `config/`, `constants/`
- `server/api/` — API routes (Nitro handlers)
- `public/` — Static assets
- `nuxt.config.ts` — Nuxt config; PWA options in `app/config/pwa.ts`
- `uno.config.ts` — UnoCSS config

## When to use

- Starting a new Nuxt 4 app with Vitesse-style defaults
- Need SSR, file-based routing, and zero-config cloud-style deployment
- Want Pinia + VueUse + UnoCSS + PWA in one template

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
-->
