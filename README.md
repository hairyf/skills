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
| [github-workflow](skills/github-workflow) | Standard flow from task source (link or description) to creating a PR: resolve task, create branch and TODO.md, create PR against origin only | Hairyf |
| [openapi-specification-v2](skills/openapi-specification-v2) | OpenAPI (Swagger) 2.0 — describe REST APIs (path, operation, parameter, response, schema). Use when writing, validating, or interpreting Swagger 2.0 specs | Hairyf |
| [openapi-specification-v3.2](skills/openapi-specification-v3.2) | OpenAPI 3.2 — OAD format, paths, operations, JSON Schema 2020-12, security. Use when authoring or validating OpenAPI 3.2 documents | Hairyf |
| [create-skill-from-repo](skills/create-skill-from-repo) | Bootstrap modular Agent Skills from any repository: clone to sources/, extract docs into references/, register in AGENTS.md | Hairyf |
| [vision](skills/vision) | Image recognition for agents without native vision support — send local images or remote URLs to an OpenAI-compatible vision model | Hairyf |
| [imagine](skills/imagine) | Image, sticker, icon, and seamless-texture generation — GPT Image 2 / Nano Banana / SiliconFlow Qwen-Image / GPT Image via a zero-dependency script | Hairyf |
| [sonic](skills/sonic) | Voice (TTS), music, lyrics, and sound-effect generation — SiliconFlow / MiniMax / OpenAI / ElevenLabs TTS, MiniMax music, local Sony Woosh SFX | Hairyf |
| [minecraft-texture](skills/minecraft-texture) | Minecraft texture generation and post-processing — image-model generation prompts, background removal, pixel-grid detection, and color-block sampling to 16x16/32x32 PNGs via a local Python script | Hairyf |
| [minecraft-model](skills/minecraft-model) | Minecraft 3D model creation — vanilla-style design and three-view generation with an image model, then Blockbench MCP modeling, texturing, and animation | Hairyf |
| [minecraft-orchestra](skills/minecraft-orchestra) | Minecraft mod team orchestration — 7-role subagent pipeline (design, bpm, worldgen, content, art, audio, rendering) with wave scheduling, shared contracts, and user review gates for complex sub-world/dimension mods | Hairyf |

### Skills Generated from Official Documentation

> Unopinionated but with tilted focus (e.g. TypeScript, ESM, Composition API, and other modern stacks)

Generated from official documentation and fine-tuned for agent usage.

#### Vue Ecosystem

| Skill | Description | Source |
|-------|-------------|--------|
| [vue](skills/vue) | Vue.js core — reactivity, components, composition API | [vuejs/docs](https://github.com/vuejs/docs) |
| [vue-router](skills/vue-router) | Vue Router — official router for Vue.js; routing, navigation guards, nested routes, programmatic navigation | [vuejs/router](https://github.com/vuejs/router) |
| [nuxt](skills/nuxt) | Nuxt framework — file-based routing, server routes, modules | [nuxt/nuxt](https://github.com/nuxt/nuxt) |
| [pinia](skills/pinia) | Pinia — intuitive, type-safe state management for Vue | [vuejs/pinia](https://github.com/vuejs/pinia) |
| [vite](skills/vite) | Vite build tool — config, plugins, SSR, library mode | [vitejs/vite](https://github.com/vitejs/vite) |
| [vitepress](skills/vitepress) | VitePress — static site generator powered by Vite | [vuejs/vitepress](https://github.com/vuejs/vitepress) |
| [vitest](skills/vitest) | Vitest — unit testing framework powered by Vite | [vitest-dev/vitest](https://github.com/vitest-dev/vitest) |
| [unocss](skills/unocss) | UnoCSS — atomic CSS engine, presets, transformers | [unocss/unocss](https://github.com/unocss/unocss) |

#### Cross-Platform (uni-app)

| Skill | Description | Source |
|-------|-------------|--------|
| [uniapp](skills/uniapp) | uni-app — cross-platform app framework (Vue syntax, App/H5/mini-programs) | [dcloud/unidocs-zh](https://gitcode.com/dcloud/unidocs-zh) |
| [uniapp-x](skills/uniapp-x) | uni-app x — next-gen cross-platform engine (UTS/uvue/Vue, Android/iOS/HarmonyOS/Web/mini-programs) | [dcloud/unidocs-uni-app-x-zh](https://gitcode.com/dcloud/unidocs-uni-app-x-zh) |

#### React Ecosystem

| Skill | Description | Source |
|-------|-------------|--------|
| [react](skills/react) | React — library for building user interfaces; components, state, side effects, performance | [reactjs/react.dev](https://github.com/reactjs/react.dev) |
| [react-router](skills/react-router) | React Router — multi-strategy router for React (Framework/Data/Declarative modes, loaders, actions) | [remix-run/react-router](https://github.com/remix-run/react-router) |
| [react-use](skills/react-use) | React Use — collection of essential React Hooks (sensors, UI, animations, side-effects, state) | [streamich/react-use](https://github.com/streamich/react-use) |
| [next](skills/next) | Next.js — React framework with App Router, Server Components, data fetching, caching | [vercel/next.js](https://github.com/vercel/next.js) |
| [tailwindcss](skills/tailwindcss) | Tailwind CSS — utility-first CSS framework | [tailwindlabs/tailwindcss.com](https://github.com/tailwindlabs/tailwindcss.com) |
| [nativewind](skills/nativewind) | NativeWind — use Tailwind CSS to style React Native components across web and native | [nativewind/website](https://github.com/nativewind/website) |

#### Mobile (React Native & Flutter)

| Skill | Description | Source |
|-------|-------------|--------|
| [react-native](skills/react-native) | React Native — build native mobile apps with React (iOS/Android, native components, platform APIs) | [facebook/react-native-website](https://github.com/facebook/react-native-website) |
| [react-native-expo](skills/react-native-expo) | Expo SDK — EAS Build, EAS Update, Continuous Native Generation; configure Expo projects, native modules, OTA updates | [expo/expo](https://github.com/expo/expo) |
| [react-native-reusables](skills/react-native-reusables) | React Native Reusables — shadcn-style components for React Native (Expo) with Nativewind/Uniwind, RN Primitives, CLI | [founded-labs/react-native-reusables](https://github.com/founded-labs/react-native-reusables) |
| [flutter](skills/flutter) | Flutter — build mobile, web, and desktop apps from one codebase; widgets, state, navigation, Material Design | [flutter/flutter](https://github.com/flutter/flutter) |

#### Desktop Apps

| Skill | Description | Source |
|-------|-------------|--------|
| [electron](skills/electron) | Electron - cross-platform desktop apps with JavaScript, HTML, and CSS | [electron/electron](https://github.com/electron/electron) |
| [electron-forge](skills/electron-forge) | Electron Forge - tool for building Electron applications | [electron-forge/electron-forge-docs](https://github.com/electron-forge/electron-forge-docs) |
| [tauri](skills/tauri) | Tauri - cross-platform app toolkit with Rust backend and WebView frontend | [tauri-apps/tauri-docs](https://github.com/tauri-apps/tauri-docs) |

#### Backend & Tools

| Skill | Description | Source |
|-------|-------------|--------|
| [nest](skills/nest) | NestJS — progressive Node.js framework | [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com) |
| [pnpm](skills/pnpm) | pnpm — fast, disk-efficient package manager; workspaces, catalogs, patches, overrides | [pnpm/pnpm.io](https://github.com/pnpm/pnpm.io) |
| [unplugin](skills/unplugin) | unplugin — unified plugin system for Vite, Rollup, webpack, esbuild, Rspack, Farm, Rolldown, Bun | [unjs/unplugin](https://github.com/unjs/unplugin) |
| [unjs](skills/unjs) | UnJS ecosystem — agnostic JavaScript libraries (h3, nitro, ofetch, unstorage) and universal JS apps | [unjs/website](https://github.com/unjs/website) |
| [undocs](skills/undocs) | undocs — minimal documentation theme and CLI for UnJS projects (Nuxt, Nuxt Content, Nuxt UI) | [unjs/undocs](https://github.com/unjs/undocs) |
| [taze](skills/taze) | taze — keep JavaScript/TypeScript dependencies fresh with safety rails and monorepo support | [antfu-collective/taze](https://github.com/antfu-collective/taze) |

#### Animation Libraries

| Skill | Description | Source |
|-------|-------------|--------|
| [motion](skills/motion) | Motion - animation library for the web | [motiondivision/motion](https://github.com/motiondivision/motion) |
| [anime](skills/anime) | Anime.js - JavaScript animation engine | [juliangarnier/anime](https://github.com/juliangarnier/anime) |

#### State Management

| Skill | Description | Source |
|-------|-------------|--------|
| [valtio](skills/valtio) | Valtio - proxy-state library for React and Vanilla | [pmndrs/valtio](https://github.com/pmndrs/valtio) |

#### Minecraft Modding

| Skill | Description | Source |
|-------|-------------|--------|
| [fabric](skills/fabric) | Fabric — lightweight Minecraft modding toolchain (Fabric Loader, Fabric API, Loom): project setup, registries, networking, events, commands, rendering, data generation, mixins, and porting | [FabricMC/fabric-docs](https://github.com/FabricMC/fabric-docs) |
| [veil](skills/veil) | Veil — advanced rendering for Minecraft mods (shaders, post-processing, framebuffers, deferred lights, Quasar particles, Flare effects, Necromancer animations) | [FoundryMC/Veil](https://github.com/FoundryMC/Veil) |
| [geckolib](skills/geckolib) | GeckoLib 5 — keyframe animations for Minecraft mods (entities, blocks, items, armor, replaced entities, Molang, render states) | [bernie-g/geckolib](https://github.com/bernie-g/geckolib) |

#### Architecture & Starters

| Skill | Description | Source |
|-------|-------------|--------|
| [arch-upkeep](skills/arch-upkeep) | Architecture health-check and upgrade orchestrator — detect repo shape and migrate to canonical tsdown-based starters | Internal |
| [arch-nuxt](skills/arch-nuxt) | Vitesse-style Nuxt 4 starter (Vite, UnoCSS, Pinia, VueUse, PWA) | [antfu/vitesse-nuxt](https://github.com/antfu/vitesse-nuxt) |
| [arch-nuxt-lite](skills/arch-nuxt-lite) | Vitesse Lite — lightweight Vite + Vue 3 SPA with file-based routing | [antfu-collective/vitesse-lite](https://github.com/antfu-collective/vitesse-lite) |
| [arch-nuxt-module-builder](skills/arch-nuxt-module-builder) | Build and ship Nuxt modules with @nuxt/module-builder | [nuxt/module-builder](https://github.com/nuxt/module-builder) |
| [arch-tsdown](skills/arch-tsdown) | TypeScript library starter using tsdown, pnpm, Vitest | [antfu/starter-ts](https://github.com/antfu/starter-ts) |
| [arch-tsdown-cli](skills/arch-tsdown-cli) | TypeScript CLI starter using tsdown (library + bin) | [hairyf/starter-cli](https://github.com/hairyf/starter-cli) |
| [arch-tsdown-monorepo](skills/arch-tsdown-monorepo) | pnpm monorepo starter for TypeScript libraries with tsdown per package | [hairyf/starter-monorepo](https://github.com/hairyf/starter-monorepo) |
| [arch-unplugin](skills/arch-unplugin) | Build universal build-tool plugins with unplugin-starter | [unplugin/unplugin-starter](https://github.com/unplugin/unplugin-starter) |
| [arch-vscode](skills/arch-vscode) | VSCode extension starter (reactive-vscode, tsdown) | [antfu/starter-vscode](https://github.com/antfu/starter-vscode) |
| [arch-webext-vue](skills/arch-webext-vue) | Browser extension with Vue 3 and Vite (popup, options, sidepanel, content script) | [antfu-collective/vitesse-webext](https://github.com/antfu-collective/vitesse-webext) |

#### Writing & Workflow

| Skill | Description | Source |
|-------|-------------|--------|
| [github-cli](skills/github-cli) | GitHub CLI (gh) — repositories, issues, pull requests, Actions, projects, releases, gists, codespaces | [github/awesome-copilot](https://github.com/github/awesome-copilot) |
| [writing-styles-juejin](skills/writing-styles-juejin) | Juejin-style technical article writing — structure, headlines, openings, and best practices for Simplified Chinese tech content | [hairyf/juejin-excellent-article](https://github.com/hairyf/juejin-excellent-article) |

### Vendored Skills

Synced from external repositories that maintain their own skills.

#### Official Skills

| Skill | Description | Source |
|-------|-------------|--------|
| [slidev](skills/slidev) | Slidev — presentation slides for developers (Markdown, Vue components, code highlighting, animations) | [slidevjs/slidev](https://github.com/slidevjs/slidev) |
| [vueuse-functions](skills/vueuse-functions) | VueUse — 200+ Vue composition utilities | [vueuse/skills](https://github.com/vueuse/skills) |
| [turborepo](skills/turborepo) | Turborepo — high-performance build system for monorepos | [vercel/turborepo](https://github.com/vercel/turborepo) |
| [tsdown](skills/tsdown) | tsdown — TypeScript library bundler powered by Rolldown | [rolldown/tsdown](https://github.com/rolldown/tsdown) |

#### Hairyf's Projects

| Skill | Description | Source |
|-------|-------------|--------|
| [hairy-utils](skills/hairy-utils) | Hairy Utils - utility functions library | [hairyf/hairylib](https://github.com/hairyf/hairylib) |
| [hairy-react-lib](skills/hairy-react-lib) | Hairy React Lib - React utilities and components | [hairyf/hairylib](https://github.com/hairyf/hairylib) |
| [valtio-define](skills/valtio-define) | Valtio Define - type-safe state management for Valtio | [hairyf/valtio-define](https://github.com/hairyf/valtio-define) |
| [overlastic](skills/overlastic) | Overlastic - overlay management library | [hairyf/overlastic](https://github.com/hairyf/overlastic) |

#### Community & Third-Party

| Skill | Description | Source |
|-------|-------------|--------|
| [create-skill](skills/create-skill) | Guide for creating effective skills that extend Claude's capabilities with specialized knowledge, workflows, or tool integrations | [anthropics/skills](https://github.com/anthropics/skills) |
| [vue-best-practices](skills/vue-best-practices) | Vue 3 + TypeScript best practices — Composition API, `<script setup>`, Volar, vue-tsc | [vuejs-ai/skills](https://github.com/vuejs-ai/skills) |
| [vue-router-best-practices](skills/vue-router-best-practices) | Vue Router best practices | [vuejs-ai/skills](https://github.com/vuejs-ai/skills) |
| [vue-testing-best-practices](skills/vue-testing-best-practices) | Vue testing best practices — Vitest, Vue Test Utils, component testing, mocking, Playwright E2E | [vuejs-ai/skills](https://github.com/vuejs-ai/skills) |
| [web-design-guidelines](skills/web-design-guidelines) | Web design guidelines for building accessible, compliant interfaces; use when reviewing UI, accessibility, or UX | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| [e2e-testing](skills/e2e-testing) | E2E testing patterns with Playwright for full-stack apps — test structure, page objects, selectors, auth reuse, CI | [hieutrtr/ai1-skills](https://github.com/hieutrtr/ai1-skills) |
| [writing-humanizer](skills/writing-humanizer) | Remove signs of AI-generated writing from text; make copy sound more natural and human-written (English) | [blader/humanizer](https://github.com/blader/humanizer) |
| [writing-humanizer-zh](skills/writing-humanizer-zh) | Remove signs of AI-generated writing from text; make copy sound more natural and human-written (Simplified Chinese) | [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh) |
| [uniwind](skills/uniwind) | Uniwind — Tailwind CSS v4 styling for React Native (classNames, theming, platform/data/state/responsive variants, custom utilities) | [uni-stack/uniwind](https://github.com/uni-stack/uniwind) |
| [migrate-nativewind-to-uniwind](skills/migrate-nativewind-to-uniwind) | Migrate a React Native project from NativeWind to Uniwind — package removal, config migration, Tailwind 4 upgrade, cssInterop removal, theme conversion | [uni-stack/uniwind](https://github.com/uni-stack/uniwind) |

## FAQ

### What Makes This Collection Different?

This collection is based on [Anthony Fu's skills collection](https://github.com/antfu/skills) and extends it with:

- **Additional Skills**: More skills covering React/Next.js ecosystem, animation libraries, backend frameworks, desktop apps (Electron, Tauri), API specifications (OpenAPI 2.0/3.2), and build tools (unplugin)
- **Architecture & Starters**: Skills for scaffolding Nuxt/Vue/TS libraries/CLI/VSCode/WebExtension projects (arch-nuxt, arch-tsdown, arch-unplugin, arch-vscode, arch-webext-vue, etc.)
- **Hairyf's Projects**: Skills for Hairyf's own open-source projects (hairylib, valtio-define, overlastic)
- **Personal Preferences**: Hairyf's own opinionated preferences and best practices

The key difference from the original collection is that it uses git submodules to directly reference source documentation. This provides more reliable context and allows the skills to stay up-to-date with upstream changes over time.

The project is also designed to be flexible - you can use it as a template to generate your own skills collection.

### Skills vs llms.txt vs AGENTS.md

To me, the value of skills lies in being **shareable** and **on-demand**.

Being shareable makes prompts easier to manage and reuse across projects. Being on-demand means skills can be pulled in as needed, scaling far beyond what any agent's context window could fit at once.

You might hear people say "AGENTS.md outperforms skills". I think that's true — AGENTS.md loads everything upfront, so agents always respect it, whereas skills can have false negatives where agents don't pull them in when you'd expect. That said, I see this more as a gap in tooling and integration that will improve over time. Skills are really just a standardized format for agents to consume—plain markdown files at the end of the day. Think of them as a knowledge base for agents. If you want certain skills to always apply, you can reference them directly in your AGENTS.md.

## Generate Your Own Skills

Fork this project to create your own customized skill collection.

1. Fork or clone this repository
2. Install dependencies: `pnpm install`
3. Update `meta.ts` with your own projects and skill sources
4. Run `nr start cleanup` to remove existing submodules and skills
5. Run `nr start init` to clone the submodules
6. Run `nr start sync` to sync vendored skills
7. Ask your agent to "generate skills for \<project\> anthor \<author\>, use <language>." (recommended one at a time to manage token usage)

**Ongoing maintenance:**

- **More, until all** — When you say "more" (or ask for more coverage) for an existing skill, the agent compares current `references/` with the source docs, identifies missing modules, adds new reference files, and updates `SKILL.md` (and `GENERATION.md` for Type 1).
- **Update** — When you say "update" (or ask to refresh from source) for a skill, the agent runs `git diff` against the SHA in `GENERATION.md` / `SYNC.md`, then updates only the affected references, `SKILL.md`, and tracking metadata.

See [AGENTS.md](AGENTS.md) for detailed generation guidelines.

## Credits

- Original project: [antfu/skills](https://github.com/antfu/skills) by [Anthony Fu](https://github.com/antfu)
- Extended by: [Hairyf](https://github.com/hairyf)

## License

Skills and the scripts in this repository are [MIT](LICENSE.md) licensed.

Vendored skills from external repositories retain their original licenses - see each skill directory for details.
