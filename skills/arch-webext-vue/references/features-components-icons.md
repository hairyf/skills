---
name: arch-webext-vue-components-icons
description: Auto-imported Vue components and icons (unplugin-vue-components, unplugin-icons) in the Vitesse WebExtension template.
---

# Components and Icons

The template uses **unplugin-vue-components** to auto-import Vue components from **src/components/** and **unplugin-icons** (with Iconify) so icons can be used as components without explicit imports. Both are configured in the shared Vite config and apply to popup, options, sidepanel, and content script builds.

## Components

- **Directory**: `src/components/`. Any Vue file here is registered on demand when referenced in a template.
- **Config** (shared Vite config): `Components({ dirs: [r('src/components')], dts: r('src/components.d.ts') })`. TypeScript declarations are written to `src/components.d.ts` for Volar/IDE support.
- **Usage**: Use the component name (PascalCase from filename) in templates without importing, e.g. `<Logo />`, `<SharedSubtitle />`.
- **Shared**: Components are shared across popup, options, sidepanel, and content script; put only reusable UI in this folder.

## Icons

- **unplugin-icons**: Resolves icon imports or, with **unplugin-vue-components**’ IconsResolver, auto-imports icon components.
- **Config**: `IconsResolver({ prefix: '' })` so icons are used without a prefix (e.g. `<pixelarticons-power />` from Iconify set).
- **Iconify**: The template uses Iconify; icons are fetched by name and only used icons are bundled. Browse sets at [Icônes](https://icones.netlify.app/) or [Iconify](https://iconify.design/).
- **Usage**: In a template, use the icon as a component: `<pixelarticons-power class="..." />`. The component name matches the Iconify icon name (e.g. `pixelarticons-power` for the “power” icon in the “pixelarticons” set).

## UnoCSS and Icons

UnoCSS config includes **presetIcons()** so UnoCSS can also use icon sets if needed. For Vue components, unplugin-icons + IconsResolver are the primary way to use icons; keep icon usage consistent (either component or UnoCSS class) to avoid duplication.

## Key Points

- Add new shared UI as Vue files in `src/components/`; they are auto-imported in all views and content script.
- For new icons, use the Iconify name (e.g. `mdi:home`) or the resolved component name (e.g. `MdiHome` depending on resolver). Prefix is empty so names can be long; use kebab-case in templates if the resolver emits kebab-case.
- Do not manually import components from `src/components` in templates; let the plugin resolve them so `components.d.ts` stays accurate.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (vite.config.mts, src/components/README.md)
-->
