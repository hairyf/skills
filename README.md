# Hairy's Skills

> Forked from [antfu/skills](https://github.com/antfu/skills)

A curated collection of [Agent Skills](https://agentskills.io/home) based on [Anthony Fu's skills collection](https://github.com/antfu/skills), extended with additional skills reflecting [Hairyf](https://github.com/hairyf)'s preferences, experience, and best practices for web development.

> [!IMPORTANT]
> This is a proof-of-concept project for generating agent skills from source documentation and keeping them in sync.
> I haven't fully tested how well the skills perform in practice, so feedback and contributions are greatly welcome.

## Installation

```bash
pnpx skills add hairyf/skills
```

or to install all of them globally:

```bash
pnpx skills add hairyf/skills --all -g
```

Learn more about the CLI usage at [skills](https://github.com/vercel-labs/skills).

## Skills

This collection extends Anthony Fu's original collection with additional skills from Hairyf. It includes skills from different sources with different scopes, covering both Vue/Vite/Nuxt ecosystem and React/Next.js ecosystem.

### Hand-maintained Skills

> Opinionated

Manually maintained skills reflecting personal preferences and best practices.

| Skill | Description | Maintainer |
|-------|-------------|------------|
| [hairy](skills/hairy) | Hairyf's preferences and best practices for web development (TypeScript, ESLint, pnpm, Vitest, etc.) | Hairyf |
| [antfu](skills/antfu) | Anthony Fu's preferences and best practices for app/library projects (eslint, pnpm, vitest, vue, etc.) | Anthony Fu |

### Skills Generated from Official Documentation

> Unopinionated but with tilted focus (e.g. TypeScript, ESM, Composition API, and other modern stacks)

Generated from official documentation and fine-tuned for agent usage.

#### Vue Ecosystem

| Skill | Description | Source |
|-------|-------------|--------|
| [vue](skills/vue) | Vue.js core - reactivity, components, composition API | [vuejs/docs](https://github.com/vuejs/docs) |
| [nuxt](skills/nuxt) | Nuxt framework - file-based routing, server routes, modules | [nuxt/nuxt](https://github.com/nuxt/nuxt) |
| [pinia](skills/pinia) | Pinia - intuitive, type-safe state management for Vue | [vuejs/pinia](https://github.com/vuejs/pinia) |
| [vite](skills/vite) | Vite build tool - config, plugins, SSR, library mode | [vitejs/vite](https://github.com/vitejs/vite) |
| [vitepress](skills/vitepress) | VitePress - static site generator powered by Vite | [vuejs/vitepress](https://github.com/vuejs/vitepress) |
| [vitest](skills/vitest) | Vitest - unit testing framework powered by Vite | [vitest-dev/vitest](https://github.com/vitest-dev/vitest) |
| [unocss](skills/unocss) | UnoCSS - atomic CSS engine, presets, transformers | [unocss/unocss](https://github.com/unocss/unocss) |

#### Cross-Platform (uni-app)

| Skill | Description | Source |
|-------|-------------|--------|
| [uniapp](skills/uniapp) | uni-app - cross-platform app framework (Vue syntax, App/H5/mini-programs) | [dcloud/unidocs-zh](https://gitcode.com/dcloud/unidocs-zh) |
| [uniapp-x](skills/uniapp-x) | uni-app x - next-gen cross-platform engine (UTS/uvue/Vue, Android/iOS/HarmonyOS/Web/mini-programs) | [dcloud/unidocs-uni-app-x-zh](https://gitcode.com/dcloud/unidocs-uni-app-x-zh) |

#### React Ecosystem

| Skill | Description | Source |
|-------|-------------|--------|
| [react-use](skills/react-use) | React Use - collection of essential React Hooks | [streamich/react-use](https://github.com/streamich/react-use) |
| [next](skills/next) | Next.js - React framework for production | [vercel/next.js](https://github.com/vercel/next.js) |
| [tailwindcss](skills/tailwindcss) | Tailwind CSS - utility-first CSS framework | [tailwindlabs/tailwindcss.com](https://github.com/tailwindlabs/tailwindcss.com) |

#### Desktop Apps

| Skill | Description | Source |
|-------|-------------|--------|
| [electron](skills/electron) | Electron - cross-platform desktop apps with JavaScript, HTML, and CSS | [electron/electron](https://github.com/electron/electron) |
| [tauri](skills/tauri) | Tauri - cross-platform app toolkit with Rust backend and WebView frontend | [tauri-apps/tauri-docs](https://github.com/tauri-apps/tauri-docs) |

#### Backend & Tools

| Skill | Description | Source |
|-------|-------------|--------|
| [nest](skills/nest) | NestJS - progressive Node.js framework | [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com) |
| [pnpm](skills/pnpm) | pnpm - fast, disk space efficient package manager | [pnpm/pnpm.io](https://github.com/pnpm/pnpm.io) |
| [tsdown](skills/tsdown) | tsdown - TypeScript library bundler powered by Rolldown | [rolldown/tsdown](https://github.com/rolldown/tsdown) |
| [unplugin](skills/unplugin) | unplugin - unified plugin system for Vite, Rollup, webpack, esbuild, etc. | [unjs/unplugin](https://github.com/unjs/unplugin) |

#### Animation Libraries

| Skill | Description | Source |
|-------|-------------|--------|
| [motion](skills/motion) | Motion - animation library for the web | [motiondivision/motion](https://github.com/motiondivision/motion) |
| [anime](skills/anime) | Anime.js - JavaScript animation engine | [juliangarnier/anime](https://github.com/juliangarnier/anime) |

#### State Management

| Skill | Description | Source |
|-------|-------------|--------|
| [valtio](skills/valtio) | Valtio - proxy-state library for React and Vanilla | [pmndrs/valtio](https://github.com/pmndrs/valtio) |

#### API Specification

| Skill | Description | Source |
|-------|-------------|--------|
| [openapi-specification-v2](skills/openapi-specification-v2) | OpenAPI (Swagger) 2.0 - describe REST APIs, path/operation/parameter/response/schema | [OAI/OpenAPI-Specification](https://github.com/OAI/OpenAPI-Specification) |
| [openapi-specification-v3.2](skills/openapi-specification-v3.2) | OpenAPI 3.2 - OAD format, paths, operations, JSON Schema 2020-12, security | [OAI/OpenAPI-Specification](https://github.com/OAI/OpenAPI-Specification) |

#### Architecture & Starters

| Skill | Description | Source |
|-------|-------------|--------|
| [arch-nuxt](skills/arch-nuxt) | Vitesse-style Nuxt 4 starter (Vite, UnoCSS, Pinia, VueUse, PWA) | [antfu/vitesse-nuxt](https://github.com/antfu/vitesse-nuxt) |
| [arch-nuxt-lite](skills/arch-nuxt-lite) | Vitesse Lite - lightweight Vite + Vue 3 SPA with file-based routing | [antfu-collective/vitesse-lite](https://github.com/antfu-collective/vitesse-lite) |
| [arch-nuxt-module-builder](skills/arch-nuxt-module-builder) | Build and ship Nuxt modules with @nuxt/module-builder | [nuxt/module-builder](https://github.com/nuxt/module-builder) |
| [arch-tsdown](skills/arch-tsdown) | TypeScript library starter using tsdown, pnpm, Vitest | [antfu/starter-ts](https://github.com/antfu/starter-ts) |
| [arch-tsdown-cli](skills/arch-tsdown-cli) | TypeScript CLI starter using tsdown (library + bin) | [hairyf/starter-cli](https://github.com/hairyf/starter-cli) |
| [arch-unplugin](skills/arch-unplugin) | Build universal build-tool plugins with unplugin-starter | [unplugin/unplugin-starter](https://github.com/unplugin/unplugin-starter) |
| [arch-vscode](skills/arch-vscode) | VSCode extension starter (reactive-vscode, tsdown) | [antfu/starter-vscode](https://github.com/antfu/starter-vscode) |
| [arch-webext-vue](skills/arch-webext-vue) | Browser extension with Vue 3 and Vite (popup, options, sidepanel, content script) | [antfu-collective/vitesse-webext](https://github.com/antfu-collective/vitesse-webext) |

### Vendored Skills

Synced from external repositories that maintain their own skills.

#### Official Skills

| Skill | Description | Source |
|-------|-------------|--------|
| [slidev](skills/slidev) | Slidev - presentation slides for developers | [slidevjs/slidev](https://github.com/slidevjs/slidev) |
| [vueuse-functions](skills/vueuse-functions) | VueUse - 200+ Vue composition utilities | [vueuse/skills](https://github.com/vueuse/skills) |
| [turborepo](skills/turborepo) | Turborepo - high-performance build system for monorepos | [vercel/turborepo](https://github.com/vercel/turborepo) |

#### Hairyf's Projects

| Skill | Description | Source |
|-------|-------------|--------|
| [hairy-utils](skills/hairy-utils) | Hairy Utils - utility functions library | [hairyf/hairylib](https://github.com/hairyf/hairylib) |
| [hairy-react-lib](skills/hairy-react-lib) | Hairy React Lib - React utilities and components | [hairyf/hairylib](https://github.com/hairyf/hairylib) |
| [valtio-define](skills/valtio-define) | Valtio Define - type-safe state management for Valtio | [hairyf/valtio-define](https://github.com/hairyf/valtio-define) |
| [overlastic](skills/overlastic) | Overlastic - overlay management library | [hairyf/overlastic](https://github.com/hairyf/overlastic) |

#### Community Skills

| Skill | Description | Source |
|-------|-------------|--------|
| [vue-best-practices](skills/vue-best-practices) | Vue 3 + TypeScript best practices for Volar | [hyf0/vue-skills](https://github.com/hyf0/vue-skills) |
| [web-design-guidelines](skills/web-design-guidelines) | Web design guidelines for building beautiful interfaces | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |

## What Makes This Collection Different?

This collection is based on [Anthony Fu's skills collection](https://github.com/antfu/skills) and extends it with:

- **Additional Skills**: More skills covering React/Next.js ecosystem, animation libraries, backend frameworks, desktop apps (Electron, Tauri), API specifications (OpenAPI 2.0/3.2), and build tools (unplugin)
- **Architecture & Starters**: Skills for scaffolding Nuxt/Vue/TS libraries/CLI/VSCode/WebExtension projects (arch-nuxt, arch-tsdown, arch-unplugin, arch-vscode, arch-webext-vue, etc.)
- **Hairyf's Projects**: Skills for Hairyf's own open-source projects (hairylib, valtio-define, overlastic)
- **Personal Preferences**: Hairyf's own opinionated preferences and best practices

The key difference from the original collection is that it uses git submodules to directly reference source documentation. This provides more reliable context and allows the skills to stay up-to-date with upstream changes over time.

The project is also designed to be flexible - you can use it as a template to generate your own skills collection.

## Generate Your Own Skills

Fork this project to create your own customized skill collection.

1. Fork or clone this repository
2. Install dependencies: `pnpm install`
3. Update `meta.ts` with your own projects and skill sources
4. Run `nr start cleanup` to remove existing submodules and skills
5. Run `nr start init` to clone the submodules
6. Run `nr start sync` to sync vendored skills
7. Ask your agent to "generate skills for \<project\>" (recommended one at a time to manage token usage)

**Ongoing maintenance:**

- **More** — When you say "more" (or ask for more coverage) for an existing skill, the agent compares current `references/` with the source docs, identifies missing modules, adds new reference files, and updates `SKILL.md` (and `GENERATION.md` for Type 1).
- **Update** — When you say "update" (or ask to refresh from source) for a skill, the agent runs `git diff` against the SHA in `GENERATION.md` / `SYNC.md`, then updates only the affected references, `SKILL.md`, and tracking metadata.

See [AGENTS.md](AGENTS.md) for detailed generation guidelines.

## Credits

- Original project: [antfu/skills](https://github.com/antfu/skills) by [Anthony Fu](https://github.com/antfu)
- Extended by: [Hairyf](https://github.com/hairyf)

## License

Skills and the scripts in this repository are [MIT](LICENSE.md) licensed.

Vendored skills from external repositories retain their original licenses - see each skill directory for details.
