---
name: core-overview
description: arch-nuxt-lite project purpose, structure, and when to use
---

# Overview (arch-nuxt-lite)

**arch-nuxt-lite** (Vitesse Lite) is a lightweight **Vite + Vue 3** SPA starter: file-based routing via unplugin-vue-router, components and composables auto-import, UnoCSS, VueUse, and Vitest. Use it when scaffolding or maintaining a simple Vue SPA without SSR, i18n, layouts, SSG, PWA, or Markdown.

## Stack

- **Vue 3** — Composition API, `<script setup>`, defineModel
- **Vite** — Fast HMR, ESBuild
- **unplugin-vue-router** — File-based routing from `src/pages`
- **unplugin-auto-import** — Vue, VueRouter, VueUse and `src/composables` auto-imported
- **unplugin-vue-components** — Components in `src/components` auto-registered
- **unplugin-vue-macros** — defineModel, propsDestructure
- **UnoCSS** — Atomic CSS, preset-icons, preset-web-fonts
- **VueUse** — Composition APIs (e.g. useDark, useToggle, useCounter)
- **Vitest** — Unit and component tests (jsdom)
- **TypeScript** — Full TS support
- **pnpm** — Package manager

## Dropped from full Vitesse

- i18n, Layouts, SSG, PWA, Markdown

## Directory structure

- `src/` — App source: `App.vue`, `main.ts`, `components/`, `composables/`, `pages/`, `styles/`
- `public/` — Static assets
- `index.html` — Entry HTML; dark mode class applied before hydration via inline script
- `vite.config.ts` — Vite config and plugins
- `uno.config.ts` — UnoCSS config

## When to use

- Starting a minimal Vue 3 SPA with Vite and file-based routing
- Prefer client-only app; no need for Nuxt/SSR
- Want UnoCSS + VueUse + typed routes in one template

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
-->
