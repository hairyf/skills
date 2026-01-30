---
name: features-unocss
description: UnoCSS config, shortcuts, presets, and icons in arch-nuxt-lite
---

# UnoCSS (uno.config.ts)

UnoCSS is configured with Wind (presetWind4), attributify, icons, and web fonts. Use utility classes and shortcuts in templates; icons via `i-{collection}-{name}`.

## Usage

```ts
// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({ scale: 1.2, warn: true }),
    presetWebFonts({
      fonts: { sans: 'DM Sans', serif: 'DM Serif Display', mono: 'DM Mono' },
    }),
  ],
})
```

**In templates** — Shortcuts and attributify:

```vue
<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <button class="btn">Submit</button>
    <div i-carbon-campsite text-4xl inline-block />
  </main>
</template>
```

## Key points

- **Shortcuts** — `btn`, `icon-btn` reduce repeated classes; add more in `shortcuts` as needed.
- **presetIcons** — Use any Iconify set: `i-{collection}-{icon}` (e.g. `i-carbon-campsite`).
- **presetAttributify** — Write utilities as attributes: `text="center"`, `p="x-4 y-10"`.
- **presetWebFonts** — Loads DM Sans, DM Serif Display, DM Mono; use `font-sans`, `font-serif`, `font-mono`.
- Import `uno.css` in `main.ts` (or via Vite/UnoCSS entry).

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
- https://unocss.dev
-->
