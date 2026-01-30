---
name: arch-nuxt-module-builder overview
description: What @nuxt/module-builder is, requirements, and quick start for building Nuxt modules.
---

# Nuxt Module Builder Overview

@nuxt/module-builder is the complete solution to build and ship Nuxt modules. It uses unbuild under the hood and automates module build config, type generation, and runtime transformation.

## Requirements

- **Consumers:** Node.js >= 18.x (LTS preferred), Nuxt 3+
- **Authors:** Use the [Nuxt modules author guide](https://nuxt.com/docs/guide/going-further/modules) before starting with module-builder

## Quick Start

Scaffold a new module with the official starter:

```bash
npm create nuxt -- -t module my-module
```

Then in the generated project:

- Entrypoint: `src/module.ts` (defineNuxtModule)
- Runtime code: `src/runtime/` (plugins, composables, components)
- Build: `nuxt-module-build build` (typically in `prepack`)

## Key Points

- Compatible with Nuxt 3 and Nuxt Kit; unified build via unjs/unbuild
- Automated build config from module spec; TypeScript and ESM support
- Auto-generated types and shims for `@nuxt/schema` (ModuleOptions, hooks, runtime config)

<!--
Source references:
- https://github.com/nuxt/module-builder
- README.md
-->
