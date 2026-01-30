---
name: core-eslint
description: ESLint config in arch-nuxt-lite
---

# ESLint (eslint.config.js)

The project uses **@antfu/eslint-config** with Unocss, formatters, and pnpm options. No Nuxt-specific append; this is a Vite/Vue SPA.

## Usage

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    pnpm: true,
  },
)
```

## Key points

- **unocss: true** — Enables UnoCSS rule support so class names are recognized.
- **formatters: true** — Enables formatting (e.g. stylistic rules).
- **pnpm: true** — Enforces pnpm for package manager.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
-->
