---
name: features-unocss
description: UnoCSS config, shortcuts, presets, and icons in arch-nuxt
---

# UnoCSS (uno.config.ts)

UnoCSS is configured in `uno.config.ts` with Wind preset, attributify, icons, typography, and web fonts. Use it for atomic utility classes and icon classes.

## Usage

```ts
// uno.config.ts
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({ scale: 1.2 }),
    presetTypography(),
    presetWebFonts({
      fonts: { sans: 'DM Sans', serif: 'DM Serif Display', mono: 'DM Mono' },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
```

**In templates** — Use utilities and shortcuts; icons via `i-{collection}-{name}`:

```vue
<template>
  <button class="btn">Submit</button>
  <div i-carbon-warning class="inline-block" />
  <div text-2xl font-500 op-50>Attributify</div>
</template>
```

## Key points

- **Module** — `@unocss/nuxt` in `nuxt.config.ts` picks up `uno.config.ts` at project root.
- **Shortcuts** — `btn`, `icon-btn` reduce repeated utility lists; add more as needed.
- **presetIcons** — Use any Iconify set; reference as `i-{collection}-{icon}` (e.g. `i-carbon-warning`, `i-twemoji-waving-hand`).
- **presetAttributify** — Write utilities as attributes: `text="center"`, `m="3 t8"`.
- **presetWebFonts + createLocalFontProcessor** — Local font loading for DM Sans/Serif/Mono.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://unocss.dev
-->
