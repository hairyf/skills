---
name: features-components
description: Auto-imported components and icons in arch-nuxt-lite
---

# Components (unplugin-vue-components)

Components under `src/components` are auto-registered and on-demand; no manual import in templates. Use PascalCase for component files (e.g. `TheFooter.vue`, `TheInput.vue`).

## Usage

In any template, use the component by name:

```vue
<template>
  <TheInput v-model="name" placeholder="What's your name?" @keydown.enter="go" />
  <TheFooter />
</template>
```

Icons are provided by **UnoCSS preset-icons** (Iconify). Use the `i-{collection}-{icon}` class:

```vue
<div i-carbon-campsite text-4xl inline-block />
<button icon-btn @click="toggleDark()">
  <div i-carbon-sun dark:i-carbon-moon />
</button>
```

Only used icons are bundled. Use [Icônes](https://icones.netlify.app/) or Iconify to find names (e.g. `carbon:campsite` → `i-carbon-campsite`).

## Key points

- **unplugin-vue-components** writes `components.d.ts` for type hints; keep it committed.
- Components are resolved from `src/components` by default (Vite plugin config).
- For `defineModel()` in a child (e.g. TheInput), parent uses `v-model` as usual.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
- https://github.com/antfu/unocss/tree/main/packages/preset-icons
-->
