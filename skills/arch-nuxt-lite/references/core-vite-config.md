---
name: core-vite-config
description: Vite config, plugins, and Vitest in arch-nuxt-lite
---

# Vite config (vite.config.ts)

Vite is configured with path alias `~/` → `src/`, and plugins for Vue Router (file-based), Vue Macros, auto-import, components, and UnoCSS. Vitest uses jsdom.

## Config shape

```ts
import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: { '~/': `${path.resolve(__dirname, 'src')}/` },
  },
  plugins: [
    VueRouter(),
    VueMacros({ defineOptions: false, defineModels: false, plugins: { vue: Vue({ script: { propsDestructure: true, defineModel: true } }) } }),
    AutoImport({
      imports: ['vue', '@vueuse/core', VueRouterAutoImports, { 'vue-router/auto': ['useLink'] }],
      dts: true,
      dirs: ['./src/composables'],
      vueTemplate: true,
    }),
    Components({ dts: true }),
    UnoCSS(),
  ],
  test: { environment: 'jsdom' },
})
```

## Plugin roles

- **VueRouter()** — Generates routes from `src/pages` and provides typed `useRoute`/`useRouter` and `vue-router/auto-routes`.
- **VueMacros** — Wraps Vue plugin; enables `defineModel` and props destructure in `<script setup>`.
- **AutoImport** — Auto-imports Vue, VueUse, Vue Router APIs, and all exports from `src/composables`; writes `auto-imports.d.ts`.
- **Components** — Auto-registers components under `src/components`; writes `components.d.ts`.
- **UnoCSS()** — Loads `uno.config.ts` at root for atomic CSS and icons.

## Key points

- Keep plugin order: VueRouter first, then VueMacros (with Vue inside), then AutoImport, Components, UnoCSS.
- Vitest config is in the same file via `test.environment: 'jsdom'`.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
-->
