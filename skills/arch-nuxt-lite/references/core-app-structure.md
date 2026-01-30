---
name: core-app-structure
description: App entry, RouterView, path alias in arch-nuxt-lite
---

# App structure

The app is a Vite SPA: `index.html` mounts `#app`, `main.ts` creates the Vue app, configures the router from `vue-router/auto-routes`, and mounts `App.vue`. Use `RouterView` for page content and the `~/` alias for `src/`.

## Entry

- **index.html** — Loads `/src/main.ts`; inline script applies `dark` class from `localStorage.getItem('color-schema')` and `prefers-color-scheme` before Vue boots.
- **src/main.ts** — `createApp(App)`, `createRouter({ routes, history: createWebHistory(import.meta.BASE_URL) })` with `routes` from `vue-router/auto-routes`, `app.use(router)`, `app.mount('#app')`. Imports `./styles/main.css` and `uno.css`.

## App.vue

Root component: `<main>` with global UnoCSS classes (`font-sans`, `p="x-4 y-10"`, `text="center gray-700 dark:gray-200"`), `<RouterView />`, and `<TheFooter />`.

## Path alias

- `~/` is aliased to `src/` in Vite `resolve.alias`. Use `~/composables`, `~/components`, etc. in imports.

## Key points

- Routes are generated from `src/pages` by unplugin-vue-router; do not manually define route records for page files.
- Dark mode is applied in `index.html` and toggled via VueUse `useDark` / `useToggle` in composables (e.g. `toggleDark()` in TheFooter).

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
-->
