---
name: features-color-mode
description: useColorMode, DarkToggle, and theme-color meta in arch-nuxt
---

# ColorMode (dark/light)

Dark and light mode are handled by `@nuxtjs/color-mode`. Use `useColorMode()` for preference and value; sync `theme-color` meta with `useHead` for status bar / browser chrome.

## Usage

```vue
<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button class="!outline-none" @click="toggleDark">
    <div class="i-carbon-sun dark:i-carbon-moon" />
  </button>
</template>
```

## Key points

- **useColorMode()** — Returns reactive `value` (current mode) and writable `preference`. Set `color.preference` to switch mode; module persists preference and applies `class` or `data-*` on `<html>`.
- **colorMode.classSuffix** — In `nuxt.config.ts`, `classSuffix: ''` means dark class is `dark` (e.g. `dark:bg-gray-900`). Use empty string for Tailwind/UnoCSS-style `dark:`.
- **Theme-color** — Use `useHead({ meta: [{ name: 'theme-color', content: ... }] })` with a function so it updates when `color.value` changes.
- **Icons** — Toggle icon via `i-carbon-sun` and `dark:i-carbon-moon` so it reflects current mode.

<!--
Source references:
- https://github.com/antfu/vitesse-nuxt
- https://github.com/nuxt-modules/color-mode
-->
